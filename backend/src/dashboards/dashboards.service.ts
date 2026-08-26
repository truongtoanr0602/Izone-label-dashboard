/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-base-to-string */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../auth/auth.service';
import { resolveLeadKhoiId } from '../auth/lead-scope';
import { Prisma } from '@prisma/client';
import {
  DEFAULT_DASHBOARD_THRESHOLDS,
  classifyStudent,
  type DashboardThresholds,
  type InterventionLevel,
} from './labeling-engine';
import {
  contactCoverageByClass,
  type ContactCoverage,
  type CoverageLog,
  type CoverageStudent,
} from './contact-coverage';
import {
  buildWeeklyTrend,
  calculateNetMomentum,
  compareMonthlyMetrics,
  parseReportPeriod,
  type LabelTransitionRow,
  type LeadSnapshotRow,
} from './lead-aggregation';
import { selectLabelMetricRow } from './label-metric-selection';
import {
  resolveClassObservation,
  type ClassObservationEvidence,
  type ResolvedClassObservation,
  type StudentMetricEvidence,
} from './snapshot-quality';
import { resolveCountMetric } from './student-metrics';
import {
  emptyDashboardMetric,
  hasLeadPeriodData,
} from './period-data';
import type {
  DashboardMetric,
  LeadDashboardQuery,
  MetricDirection,
} from './dashboard.types';

const DAY_MS = 86_400_000;
const DEFAULT_COURSE_ID = 2;
const SUPPORTED_COURSE_IDS = new Set([1, 2, 3]);
const COURSE_NAMES: Record<number, string> = {
  1: 'IELTS 0-3',
  2: 'IELTS 3-4',
  3: 'IELTS 4-5',
};

@Injectable()
export class DashboardsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeadDashboard(query: LeadDashboardQuery, user: AuthUser) {
    if (user.role === 'teacher') {
      throw new ForbiddenException(
        'Teacher accounts cannot access the Lead Dashboard',
      );
    }

    if (query.period && (query.from || query.to)) {
      throw new BadRequestException('Không được dùng period cùng với from/to');
    }
    if (!query.period && (query.from || query.to)) {
      this.parseLeadRange(query.from, query.to);
    }
    const requestedCourseId = this.parseOptionalInteger(
      query.courseId,
      DEFAULT_COURSE_ID,
      'courseId',
    );
    const requestedKhoiId = this.parseOptionalInteger(
      query.khoiId,
      requestedCourseId,
      'khoiId',
    );
    const khoiId = user.role === 'lead'
      ? resolveLeadKhoiId(user, requestedKhoiId)
      : requestedKhoiId;
    const courseId = user.role === 'lead' ? khoiId : requestedCourseId;
    if (!courseId || !SUPPORTED_COURSE_IDS.has(courseId)) {
      throw new BadRequestException(
        'Lead Dashboard chỉ hỗ trợ courseId thuộc 1, 2 hoặc 3',
      );
    }
    if (!khoiId) throw new ForbiddenException('User is not assigned to a khoi');

    const teacherId = this.parseNullableInteger(query.teacherId, 'teacherId');
    const classId = this.parseNullableInteger(query.classId, 'classId');
    let calendar: ReturnType<typeof parseReportPeriod>;
    try {
      calendar = parseReportPeriod(
        query.period ?? query.to?.slice(0, 7),
        this.todayInHoChiMinh(),
      );
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Kỳ báo cáo không hợp lệ',
      );
    }
    const previousCalendar = parseReportPeriod(
      calendar.previousAsOf.slice(0, 7),
      calendar.currentAsOf,
    );
    const periodStart = new Date(`${calendar.periodStart}T00:00:00Z`);
    const periodEnd = new Date(`${calendar.periodEnd}T00:00:00Z`);

    const classRows = await this.prisma.$queryRaw<any[]>`
      WITH class_membership AS (
        SELECT student_id, class_id
        FROM izone.students
        UNION
        SELECT DISTINCT student_id, class_id
        FROM izone.test_scores
        WHERE grade_status = 'confirmed'
          AND final_score IS NOT NULL
      )
      SELECT c.class_id, c.class_name, c.course_id, c.status, c.schedule,
             c.location, c.portal_url, c.total_sessions,
             c.teacher_id, t.teacher_name, t.teacher_email, t.teacher_phone,
             roster.active_students AS roster_active_students,
             roster.on_hold_students AS roster_on_hold_students,
             roster.dropped_students AS roster_dropped_students,
             roster.transferred_students AS roster_transferred_students
      FROM izone.classes c
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*) FILTER (
            WHERE st.registration_status IN ('on_going', 'active')
          )::integer AS active_students,
          COUNT(*) FILTER (
            WHERE st.registration_status = 'on_hold'
          )::integer AS on_hold_students,
          COUNT(*) FILTER (
            WHERE st.registration_status NOT IN (
              'on_going', 'active', 'on_hold', 'transferred'
            )
          )::integer AS dropped_students,
          COUNT(*) FILTER (
            WHERE st.registration_status = 'transferred'
          )::integer AS transferred_students
        FROM class_membership membership
        JOIN izone.students st ON st.student_id = membership.student_id
        WHERE membership.class_id = c.class_id
      ) roster ON TRUE
      WHERE c.course_id = ${courseId}
        AND c.status IN ('on_going', 'completed')
        AND EXISTS (
          SELECT 1
          FROM izone.class_daily_snapshots period_snapshot
          WHERE period_snapshot.class_id = c.class_id
            AND period_snapshot.snapshot_date BETWEEN ${periodStart} AND ${periodEnd}
        )
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
      ORDER BY c.class_name ASC
    `;

    const snapshotRows = await this.prisma.$queryRaw<any[]>`
      SELECT s.class_id, TO_CHAR(s.snapshot_date, 'YYYY-MM-DD') AS snapshot_date,
             s.active_students, s.on_hold_students, s.dropped_students,
             s.transferred_students, s.completed_sessions, s.total_sessions,
             s.scraped_at
      FROM izone.class_daily_snapshots s
      JOIN izone.classes c ON c.class_id = s.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${courseId}
        AND c.status IN ('on_going', 'completed')
        AND EXISTS (
          SELECT 1
          FROM izone.class_daily_snapshots period_snapshot
          WHERE period_snapshot.class_id = c.class_id
            AND period_snapshot.snapshot_date BETWEEN ${periodStart} AND ${periodEnd}
        )
        AND s.snapshot_date <= ${new Date(`${calendar.currentAsOf}T00:00:00Z`)}
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
      ORDER BY s.class_id, s.snapshot_date ASC
    `;

    const studentMetricRows = await this.prisma.$queryRaw<any[]>`
      WITH class_membership AS (
        SELECT student_id, class_id
        FROM izone.students
        UNION
        SELECT DISTINCT student_id, class_id
        FROM izone.test_scores
        WHERE grade_status = 'confirmed'
          AND final_score IS NOT NULL
      ), confirmed_test_orders AS (
        SELECT student_id, class_id, test_order, MAX(final_score) AS final_score
        FROM izone.test_scores
        WHERE grade_status = 'confirmed'
          AND final_score IS NOT NULL
        GROUP BY student_id, class_id, test_order
      ), student_test_labels AS (
        SELECT student_id, class_id, AVG(final_score) AS test_average
        FROM confirmed_test_orders
        GROUP BY student_id, class_id
      )
      SELECT r.class_id, TO_CHAR(r.record_date, 'YYYY-MM-DD') AS record_date,
             COUNT(*)::integer AS record_count,
             COUNT(r.attendance_pct)::integer AS attendance_sample_size,
             ROUND(AVG(r.attendance_pct) FILTER (WHERE r.attendance_pct IS NOT NULL), 2) AS attendance_avg,
             COUNT(r.homework_pct)::integer AS homework_sample_size,
             ROUND(AVG(r.homework_pct) FILTER (WHERE r.homework_pct IS NOT NULL), 2) AS homework_avg,
             MAX(GREATEST(
               COALESCE(r.attendance_total, 0),
               COALESCE(r.homework_total, 0)
             ))::integer AS observed_completed_sessions,
             COUNT(*) FILTER (
               WHERE COALESCE(r.tests_taken, 0) > 0
                 AND r.test_average IS NOT NULL
             )::integer AS tested_students,
             COUNT(*) FILTER (
               WHERE COALESCE(r.tests_taken, 0) > 0
                 AND r.test_average >= 60
                 AND r.attendance_pct >= 90
                 AND r.homework_pct >= 90
             )::integer AS pass_standard_students,
             COUNT(*) FILTER (
               WHERE COALESCE(r.tests_taken, 0) > 0
                 AND (
                   (r.test_average >= 50 AND r.test_average < 55
                    AND r.attendance_pct >= 100 AND r.homework_pct >= 100)
                   OR
                   (r.test_average >= 55 AND r.test_average < 60
                    AND r.attendance_pct >= 90 AND r.homework_pct >= 90)
                 )
             )::integer AS soft_pass_students,
             0::integer AS label_green,
             COUNT(*) FILTER (WHERE labels.test_average >= 60)::integer AS label_yellow,
             COUNT(*) FILTER (
               WHERE labels.test_average >= 45 AND labels.test_average < 60
             )::integer AS label_red,
             COUNT(*) FILTER (WHERE labels.test_average < 45)::integer AS label_grey,
             COUNT(*) FILTER (WHERE labels.test_average IS NULL)::integer AS label_no_data,
             MAX(r.scraped_at) AS scraped_at
      FROM izone.student_daily_records r
      JOIN class_membership membership
        ON membership.student_id = r.student_id
       AND membership.class_id = r.class_id
      JOIN izone.students s ON s.student_id = membership.student_id
      LEFT JOIN student_test_labels labels
        ON labels.student_id = r.student_id
       AND labels.class_id = r.class_id
      JOIN izone.classes c ON c.class_id = r.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${courseId}
        AND c.status IN ('on_going', 'completed')
        AND EXISTS (
          SELECT 1
          FROM izone.class_daily_snapshots period_snapshot
          WHERE period_snapshot.class_id = c.class_id
            AND period_snapshot.snapshot_date BETWEEN ${periodStart} AND ${periodEnd}
        )
        AND r.snapshot_stage IS NULL
        AND s.registration_status = 'on_going'
        AND r.record_date <= ${new Date(`${calendar.currentAsOf}T00:00:00Z`)}
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
      /*
       * HAI BỘ LỌC DƯỚI ĐÂY LÀ BẮT BUỘC — gỡ ra là mọi con số của Lead sai.
       *
       * snapshot_stage IS NULL: migration 007 biến bảng này thành hai loại dữ
       * liệu trộn chung. Dòng stage 1..8 là ảnh chụp theo MỐC TEST (record_date
       * của chúng chỉ là ngày chạy backfill, vô nghĩa) và luôn NULL điểm danh /
       * BTVN / pass. Đếm lẫn chúng thì ngày 12/08 ra 770 dòng thay vì 228.
       *
       * registration_status = 'on_going': HV queuing chỉ có 39% dòng mang điểm
       * danh, HV cancelled 15%. Business rule "queuing trong lớp on_going coi
       * như dropped" đã có ở effectiveRegistrationStatus() nhưng chỉ áp cho
       * Teacher dashboard — đây là chỗ áp cho Lead.
       */
      GROUP BY r.class_id, r.record_date
      ORDER BY r.class_id, r.record_date ASC
    `;

    const transitionRows = await this.prisma.$queryRaw<any[]>`
      SELECT
        TO_CHAR(r.record_date, 'YYYY-MM-DD') AS record_date,
        r.student_id,
        r.class_id,
        r.label_change_direction
      FROM izone.student_daily_records r
      JOIN izone.students s ON s.student_id = r.student_id
      JOIN izone.classes c ON c.class_id = r.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${courseId}
        AND c.status IN ('on_going', 'completed')
        AND EXISTS (
          SELECT 1
          FROM izone.class_daily_snapshots period_snapshot
          WHERE period_snapshot.class_id = c.class_id
            AND period_snapshot.snapshot_date BETWEEN ${periodStart} AND ${periodEnd}
        )
        AND r.snapshot_stage IS NULL
        AND s.registration_status = 'on_going'
        AND r.record_date BETWEEN ${new Date(`${previousCalendar.previousAsOf.slice(0, 7)}-01T00:00:00Z`)}
                              AND ${new Date(`${calendar.reportAsOf}T00:00:00Z`)}
        AND r.has_label_changed = TRUE
        AND r.label_change_direction IN ('up', 'down')
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
      ORDER BY r.record_date ASC
    `;

    const configRows = await this.prisma.$queryRaw<any[]>`
      SELECT config_key, config_value
      FROM izone.system_configs
      WHERE config_key IN (
        'nguong_xam_max', 'nguong_do_max', 'pass_dh_min', 'pass_btvn_min',
        'test_makeup_rule'
      )
    `;

    /*
     * Dòng live của HV đang học tại mốc hiện tại — dùng để phân loại mức can
     * thiệp cho từng HV, từ đó ra mẫu số của độ phủ liên hệ. Phải khớp cả
     * s.class_id = r.class_id để loại record lịch sử ở lớp cũ của HV đã chuyển
     * lớp; Teacher dashboard đọc roster hiện tại theo students.class_id nên
     * thiếu điều kiện này sẽ làm mẫu số Lead lớn hơn Teacher. Khoảng 264 dòng
     * cho toàn khối nên không cần phân trang.
     */
    const coverageStudentRows = await this.prisma.$queryRaw<any[]>`
      SELECT DISTINCT ON (r.student_id, r.class_id)
             r.student_id, r.class_id,
             r.attendance_pct, r.attendance_present, r.attendance_total,
             r.homework_pct, r.homework_done, r.homework_total,
             r.test_average, r.flag_attendance_drop, r.flag_homework_drop,
             s.registration_status
      FROM izone.student_daily_records r
      JOIN izone.students s ON s.student_id = r.student_id
      JOIN izone.classes c ON c.class_id = r.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${courseId}
        AND c.status IN ('on_going', 'completed')
        AND EXISTS (
          SELECT 1
          FROM izone.class_daily_snapshots period_snapshot
          WHERE period_snapshot.class_id = c.class_id
            AND period_snapshot.snapshot_date BETWEEN ${periodStart} AND ${periodEnd}
        )
        AND r.snapshot_stage IS NULL
        AND s.registration_status = 'on_going'
        AND s.class_id = r.class_id
        AND r.record_date <= ${new Date(`${calendar.currentAsOf}T00:00:00Z`)}
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
      ORDER BY r.student_id, r.class_id, r.record_date DESC
    `;

    const coverageTestRows = await this.prisma.$queryRaw<any[]>`
      SELECT ts.student_id, ts.class_id, ts.test_order, ts.test_name,
             ts.raw_score, ts.makeup_score, ts.final_score, ts.is_makeup
      FROM izone.test_scores ts
      JOIN izone.classes c ON c.class_id = ts.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${courseId}
        AND c.status IN ('on_going', 'completed')
        AND EXISTS (
          SELECT 1
          FROM izone.class_daily_snapshots period_snapshot
          WHERE period_snapshot.class_id = c.class_id
            AND period_snapshot.snapshot_date BETWEEN ${periodStart} AND ${periodEnd}
        )
        AND ts.grade_status = 'confirmed'
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
      ORDER BY ts.student_id, ts.test_order, ts.is_makeup
    `;

    const contactLogRows = await this.prisma.$queryRaw<any[]>`
      SELECT cl.student_id, cl.class_id, cl.trigger_type, cl.checkpoint
      FROM izone.contact_logs cl
      JOIN izone.classes c ON c.class_id = cl.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${courseId}
        AND c.status IN ('on_going', 'completed')
        AND EXISTS (
          SELECT 1
          FROM izone.class_daily_snapshots period_snapshot
          WHERE period_snapshot.class_id = c.class_id
            AND period_snapshot.snapshot_date BETWEEN ${periodStart} AND ${periodEnd}
        )
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
    `;

    const coverageConfig = new Map(
      configRows.map((row) => [row.config_key, row.config_value]),
    );
    const coverageThresholds: DashboardThresholds = {
      greyMax: this.configNumber(
        coverageConfig,
        'nguong_xam_max',
        DEFAULT_DASHBOARD_THRESHOLDS.greyMax,
      ),
      redMax: this.configNumber(
        coverageConfig,
        'nguong_do_max',
        DEFAULT_DASHBOARD_THRESHOLDS.redMax,
      ),
      attendanceMin: this.configNumber(
        coverageConfig,
        'pass_dh_min',
        DEFAULT_DASHBOARD_THRESHOLDS.attendanceMin,
      ),
      homeworkMin: this.configNumber(
        coverageConfig,
        'pass_btvn_min',
        DEFAULT_DASHBOARD_THRESHOLDS.homeworkMin,
      ),
    };
    const coverageTestsByStudentClass = this.groupTestsByStudentClass(
      coverageTestRows,
      String(coverageConfig.get('test_makeup_rule') ?? 'max'),
    );
    const checkpointByClass = new Map<
      number,
      { order: number; name: string }
    >();
    for (const row of coverageTestRows) {
      const classId = Number(row.class_id);
      const order = Number(row.test_order ?? 0);
      const current = checkpointByClass.get(classId);
      if (!current || order > current.order) {
        checkpointByClass.set(classId, {
          order,
          name: String(row.test_name || `Test ${order}`),
        });
      }
    }

    const coverageByClass = contactCoverageByClass(
      coverageStudentRows.map((row): CoverageStudent => {
        const scores =
          coverageTestsByStudentClass.get(
            `${Number(row.student_id)}:${Number(row.class_id)}`,
          ) ?? [];
        const scoredTests = scores.filter((score) => score.finalScore !== null);
        const computedTestAverage =
          scoredTests.length === 0
            ? null
            : Math.round(
                (scoredTests.reduce(
                  (sum, score) => sum + Number(score.finalScore),
                  0,
                ) /
                  scoredTests.length) *
                  10,
              ) / 10;
        const attendance = resolveCountMetric({
          done: this.nullableNumber(row.attendance_present),
          total: this.nullableNumber(row.attendance_total),
          sourcePercentage: this.nullableNumber(row.attendance_pct),
        });
        const homework = resolveCountMetric({
          done: this.nullableNumber(row.homework_done),
          total: this.nullableNumber(row.homework_total),
          sourcePercentage: this.nullableNumber(row.homework_pct),
        });
        const classification = classifyStudent(
          {
            registrationStatus: row.registration_status,
            attendancePct: attendance.percentage,
            homeworkPct: homework.percentage,
            testAverage: computedTestAverage,
            flagAttendanceDrop: Boolean(row.flag_attendance_drop),
            flagHomeworkDrop: Boolean(row.flag_homework_drop),
          },
          coverageThresholds,
        );
        return {
          studentId: Number(row.student_id),
          classId: Number(row.class_id),
          messageTemplateKey:
            classification.recommendedAction.messageTemplateKey,
          checkpoint:
            checkpointByClass.get(Number(row.class_id))?.name ?? 'Chưa có test',
        };
      }),
      contactLogRows.map((row): CoverageLog => ({
        studentId: Number(row.student_id),
        classId: Number(row.class_id),
        triggerType: String(row.trigger_type),
        checkpoint: String(row.checkpoint),
      })),
    );

    const transitions: LabelTransitionRow[] = transitionRows.map((row) => ({
      date: this.isoDate(row.record_date),
      studentId: Number(row.student_id),
      classId: Number(row.class_id),
      direction: row.label_change_direction,
    }));
    const evidence = this.buildClassEvidence(
      classRows,
      snapshotRows,
      studentMetricRows,
    );
    const hasDataForPeriod = hasLeadPeriodData(
      snapshotRows,
      studentMetricRows,
      calendar.period,
    );
    const reportRows = evidence.map((item) =>
      resolveClassObservation(item, calendar.reportAsOf),
    );
    const previousRows = evidence.map((item) =>
      resolveClassObservation(item, calendar.previousAsOf),
    );
    const previousPreviousRows = evidence.map((item) =>
      resolveClassObservation(item, previousCalendar.previousAsOf),
    );
    const currentRows = evidence.map((item) =>
      resolveClassObservation(item, calendar.currentAsOf),
    );
    const monthly = compareMonthlyMetrics(reportRows, previousRows);
    const attrition = this.resolvedAttrition(previousRows, reportRows);
    const previousAttrition = this.resolvedAttrition(
      previousPreviousRows,
      previousRows,
    );
    const selectedTransitions = transitions.filter((row) =>
      row.date.startsWith(calendar.period),
    );
    const previousTransitions = transitions.filter((row) =>
      row.date.startsWith(calendar.previousAsOf.slice(0, 7)),
    );
    const momentum = calculateNetMomentum(selectedTransitions);
    const previousMomentumClassIds = new Set(
      previousTransitions.map((row) => row.classId),
    );
    const comparableMomentumClassIds = new Set(
      selectedTransitions
        .map((row) => row.classId)
        .filter((classId) => previousMomentumClassIds.has(classId)),
    );
    const currentComparableMomentum = calculateNetMomentum(
      selectedTransitions.filter((row) =>
        comparableMomentumClassIds.has(row.classId),
      ),
    );
    const previousComparableMomentum = calculateNetMomentum(
      previousTransitions.filter((row) =>
        comparableMomentumClassIds.has(row.classId),
      ),
    );
    const momentumDelta =
      currentComparableMomentum.value === null ||
      previousComparableMomentum.value === null
        ? null
        : currentComparableMomentum.value - previousComparableMomentum.value;
    const weeklyTrend = (hasDataForPeriod
      ? buildWeeklyTrend(evidence, calendar)
      : []
    ).map((point) => {
      const weeklyMomentum = calculateNetMomentum(
        transitions.filter(
          (row) => row.date >= point.weekStart && row.date <= point.weekEnd,
        ),
      );
      return {
        ...point,
        upTransitions: weeklyMomentum.upTransitions,
        downTransitions: weeklyMomentum.downTransitions,
        netMomentum: weeklyMomentum.value,
      };
    });
    const currentClassRows = currentRows.map((observation) => {
      const meta = classRows.find(
        (row) => Number(row.class_id) === observation.classId,
      );
      const metrics = selectLabelMetricRow(
        studentMetricRows,
        observation.classId,
        calendar.currentAsOf,
        Number(meta?.roster_active_students ?? 0),
      );
      return this.mapResolvedLeadClass(
        meta,
        observation,
        metrics,
        coverageByClass.get(observation.classId) ?? {
          done: 0,
          total: 0,
          pct: null,
        },
      );
    });
    const dataFreshnessAt =
      [...snapshotRows, ...studentMetricRows]
        .map((row) => this.isoTimestamp(row.scraped_at))
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;
    const emptyMetric = emptyDashboardMetric(reportRows.length);
    const emptyPassMetric: DashboardMetric = {
      ...emptyMetric,
      qualifiedStudents: 0,
      classesWithTests: 0,
    };
    const activeStudents = hasDataForPeriod
      ? this.activeStudentsMetric(reportRows, previousRows)
      : emptyMetric;
    const attritionDelta =
      attrition.newDroppedStudents - previousAttrition.newDroppedStudents;

    return this.serializeBigInt({
      meta: {
        apiVersion: 'v1',
        courseId,
        khoiId,
        period: calendar.period,
        reportAsOf: calendar.reportAsOf,
        previousAsOf: calendar.previousAsOf,
        trendFrom: calendar.trendFrom,
        currentAsOf: calendar.currentAsOf,
        from: calendar.trendFrom,
        to: calendar.reportAsOf,
        timezone: 'Asia/Ho_Chi_Minh',
        generatedAt: new Date().toISOString(),
        dataFreshnessAt,
        hasDataForPeriod,
      },
      kpis: {
        activeStudents,
        attendanceAvg: hasDataForPeriod
          ? monthly.attendanceAvg
          : emptyMetric,
        homeworkAvg: hasDataForPeriod ? monthly.homeworkAvg : emptyMetric,
        passStandardRate: hasDataForPeriod
          ? monthly.passStandardRate
          : emptyPassMetric,
        softPassRate: hasDataForPeriod
          ? monthly.softPassRate
          : emptyPassMetric,
        riskRate: hasDataForPeriod
          ? this.riskMetric(reportRows, previousRows, studentMetricRows)
          : emptyMetric,
        periodAttritionRate: {
          value: hasDataForPeriod ? attrition.newDroppedStudents : null,
          baselineValue: hasDataForPeriod
            ? previousAttrition.newDroppedStudents
            : null,
          delta: hasDataForPeriod ? attritionDelta : null,
          direction: hasDataForPeriod
            ? this.direction(attritionDelta, true)
            : 'unknown',
          newDroppedStudents: hasDataForPeriod
            ? attrition.newDroppedStudents
            : 0,
          previousNewDroppedStudents: hasDataForPeriod
            ? previousAttrition.newDroppedStudents
            : 0,
          attritionRate: hasDataForPeriod
            ? attrition.periodAttritionRate
            : null,
          comparableClasses: hasDataForPeriod
            ? attrition.comparableClasses
            : 0,
          totalClasses: reportRows.length,
        },
        netMomentum: hasDataForPeriod
          ? {
              ...momentum,
              baselineValue: previousComparableMomentum.value,
              delta: momentumDelta,
              comparableClasses: comparableMomentumClassIds.size,
              totalClasses: reportRows.length,
              direction: this.direction(momentumDelta, false),
            }
          : {
              value: null,
              baselineValue: null,
              delta: null,
              upTransitions: 0,
              downTransitions: 0,
              studentsChanged: 0,
              recalculationEvents: 0,
              classesWithTests: 0,
              comparableClasses: 0,
              totalClasses: reportRows.length,
              direction: 'unknown',
            },
      },
      trend: weeklyTrend,
      labelDistribution: this.resolvedLabelDistribution(currentClassRows),
      classes: currentClassRows,
    });
  }

  async getTeacherDashboard(
    classId: number,
    asOfInput: string | undefined,
    user: AuthUser,
  ) {
    if (user.role === 'teacher' && !user.classIds.includes(classId)) {
      throw new ForbiddenException(
        `You do not have access to class ${classId}`,
      );
    }
    const asOf = this.parseDate(
      asOfInput ?? new Date().toISOString().slice(0, 10),
      'asOf',
    );

    const classRows = await this.queryTeacherClass(
      classId,
      asOf.date,
      user.role === 'lead' ? user.khoiIds : undefined,
    );
    if (classRows.length === 0)
      throw new NotFoundException(
        `Class ${classId} was not found in your scope`,
      );
    const classRow = classRows[0];

    const configRows = await this.prisma.$queryRaw<any[]>`
      SELECT config_key, config_value, updated_at
      FROM izone.system_configs
      WHERE config_key IN (
        'nguong_xam_max', 'nguong_do_max', 'pass_dh_min',
        'pass_btvn_min', 'review_deadline_days', 'test_makeup_rule'
      )
    `;
    const studentRows = await this.prisma.$queryRaw<any[]>`
      WITH class_roster AS (
        SELECT student_id
        FROM izone.students
        WHERE class_id = ${classId}
        UNION
        SELECT DISTINCT student_id
        FROM izone.test_scores
        WHERE class_id = ${classId}
          AND grade_status = 'confirmed'
          AND final_score IS NOT NULL
      )
      SELECT st.*, r.*
      FROM class_roster roster
      JOIN izone.students st ON st.student_id = roster.student_id
      LEFT JOIN LATERAL (
        SELECT sr.*
        FROM izone.student_daily_records sr
        WHERE sr.student_id = st.student_id
          AND sr.class_id = ${classId}
          AND sr.record_date <= ${asOf.date}
          /*
           * snapshot_stage IS NULL: dòng stage 1..8 (migration 007) là ảnh
           * chụp theo mốc test, luôn NULL điểm danh/BTVN, và record_date của
           * chúng là ngày backfill nên có thể mới hơn dòng live cùng ngày —
           * thiếu điều kiện này thì ORDER BY ... LIMIT 1 có thể chọn nhầm
           * dòng stage, xoá mất điểm danh/BTVN thật và kéo nhãn về no_data dù
           * đã có điểm test. Cùng lý do đã áp cho studentMetricRows ở
           * getLeadDashboard.
           */
          AND sr.snapshot_stage IS NULL
        ORDER BY sr.record_date DESC, sr.scraped_at DESC
        LIMIT 1
      ) r ON TRUE
      ORDER BY st.full_name ASC
    `;
    const testRows = await this.prisma.$queryRaw<any[]>`
      SELECT student_id, test_order, test_name, raw_score, makeup_score,
             final_score, is_makeup, grade_status
      FROM izone.test_scores
      WHERE class_id = ${classId}
        AND grade_status = 'confirmed'
      ORDER BY student_id, test_order, is_makeup
    `;
    const reviewRows = await this.prisma.$queryRaw<any[]>`
      SELECT student_id, pass_mem_group, review_status, deadline, is_overdue
      FROM izone.pass_reviews
      WHERE class_id = ${classId}
        AND review_status IN ('pending_teacher', 'escalated_lead')
    `;
    const contactRows = await this.prisma.$queryRaw<any[]>`
      SELECT student_id, trigger_type, checkpoint, created_at
      FROM izone.contact_logs
      WHERE class_id = ${classId}
      ORDER BY created_at DESC
    `;

    const config = new Map(
      configRows.map((row) => [row.config_key, row.config_value]),
    );
    const thresholds: DashboardThresholds = {
      greyMax: this.configNumber(
        config,
        'nguong_xam_max',
        DEFAULT_DASHBOARD_THRESHOLDS.greyMax,
      ),
      redMax: this.configNumber(
        config,
        'nguong_do_max',
        DEFAULT_DASHBOARD_THRESHOLDS.redMax,
      ),
      attendanceMin: this.configNumber(
        config,
        'pass_dh_min',
        DEFAULT_DASHBOARD_THRESHOLDS.attendanceMin,
      ),
      homeworkMin: this.configNumber(
        config,
        'pass_btvn_min',
        DEFAULT_DASHBOARD_THRESHOLDS.homeworkMin,
      ),
    };
    const testsByStudent = this.groupTests(
      testRows,
      String(config.get('test_makeup_rule') ?? 'max'),
    );
    const contactCheckpoint = testRows.reduce(
      (latest, row) => {
        const order = Number(row.test_order ?? 0);
        return order > latest.order
          ? {
              order,
              name: String(row.test_name || `Test ${order}`),
            }
          : latest;
      },
      { order: 0, name: 'Chưa có test' },
    ).name;
    const reviewsByStudent = new Map(
      reviewRows.map((row) => [Number(row.student_id), row]),
    );
    const contactsByStudent = this.groupContacts(contactRows);

    const students = studentRows.map((row) => {
      const registrationStatus = this.effectiveRegistrationStatus(
        row.registration_status,
        classRow.status,
      );
      const scores = testsByStudent.get(Number(row.student_id)) ?? [];
      const scoredTests = scores.filter((score) => score.finalScore !== null);
      const computedTestAverage =
        scoredTests.length === 0
          ? null
          : Math.round(
              (scoredTests.reduce(
                (sum, score) => sum + Number(score.finalScore),
                0,
              ) /
                scoredTests.length) *
                10,
            ) / 10;
      const testAverage = computedTestAverage;
      const attendance = resolveCountMetric({
        done: this.nullableNumber(row.attendance_present),
        total: this.nullableNumber(row.attendance_total),
        sourcePercentage: this.nullableNumber(row.attendance_pct),
      });
      const homework = resolveCountMetric({
        done: this.nullableNumber(row.homework_done),
        total: this.nullableNumber(row.homework_total),
        sourcePercentage: this.nullableNumber(row.homework_pct),
      });
      const classification = classifyStudent(
        {
          registrationStatus,
          attendancePct: attendance.percentage,
          homeworkPct: homework.percentage,
          testAverage,
          flagAttendanceDrop: Boolean(row.flag_attendance_drop),
          flagHomeworkDrop: Boolean(row.flag_homework_drop),
        },
        thresholds,
      );
      const review = reviewsByStudent.get(Number(row.student_id));
      const trigger = classification.recommendedAction.messageTemplateKey;
      const contact = (
        contactsByStudent.get(Number(row.student_id)) ?? []
      ).find(
        (item) =>
          item.trigger_type === trigger &&
          item.checkpoint === contactCheckpoint,
      );
      const warnings: string[] = [];
      if (!attendance.invalidCounts && attendance.percentage === null)
        warnings.push('MISSING_ATTENDANCE_DATA');
      if (attendance.invalidCounts) warnings.push('INVALID_ATTENDANCE_COUNTS');
      if (attendance.sourceMismatch)
        warnings.push('ATTENDANCE_SOURCE_PERCENT_MISMATCH');
      if (!homework.invalidCounts && homework.percentage === null)
        warnings.push('MISSING_HOMEWORK_DATA');
      if (homework.invalidCounts) warnings.push('INVALID_HOMEWORK_COUNTS');
      if (homework.sourceMismatch)
        warnings.push('HOMEWORK_SOURCE_PERCENT_MISMATCH');
      const snapshotAverage = this.nullableNumber(row.test_average);
      if (computedTestAverage === null && snapshotAverage !== null) {
        warnings.push('TEST_AVERAGE_WITHOUT_CONFIRMED_SCORE');
      }
      if (
        computedTestAverage !== null &&
        snapshotAverage !== null &&
        Math.abs(computedTestAverage - snapshotAverage) > 0.1
      ) {
        warnings.push('TEST_AVERAGE_MISMATCH');
      }

      return {
        studentId: Number(row.student_id),
        fullName: row.full_name,
        phone: row.phone,
        email: row.email,
        registrationStatus,
        recordDate: row.record_date ? this.isoDate(row.record_date) : null,
        attendance: {
          percentage: attendance.percentage,
          present: this.nullableNumber(row.attendance_present),
          total: this.nullableNumber(row.attendance_total),
          isDropping: Boolean(row.flag_attendance_drop),
        },
        homework: {
          percentage: homework.percentage,
          completed: this.nullableNumber(row.homework_done),
          total: this.nullableNumber(row.homework_total),
          isDropping: Boolean(row.flag_homework_drop),
        },
        tests: {
          taken: scoredTests.length,
          average: testAverage,
          latestScore: scores.at(-1)?.finalScore ?? null,
          trend: this.testTrend(scores),
          scores,
        },
        label: classification.label,
        previousLabel: row.previous_label ?? null,
        interventionLevel: classification.interventionLevel,
        issues: classification.issues,
        recommendedAction: classification.recommendedAction,
        actionState: {
          status:
            trigger === null
              ? 'not_applicable'
              : contact
                ? 'contacted'
                : 'pending',
          checkpoint: contactCheckpoint,
          lastContactedAt: contact
            ? this.isoTimestamp(contact.created_at)
            : null,
        },
        passEvaluation: {
          standardStatus: row.pass_chuan_status ?? 'no_data',
          standardReasons: this.parseReasons(row.pass_chuan_reasons),
          softPassStatus: row.pass_mem_status ?? '',
          softPassGroup: row.pass_mem_group || null,
          reviewStatus: review?.review_status ?? null,
          reviewDeadline: review?.deadline
            ? this.isoDate(review.deadline)
            : null,
        },
        teacherEvidence: {
          homeworkFeedback: row.teacher_feedback_btvn ?? '',
          orientationFeedback: row.teacher_feedback_orient ?? '',
          note: row.teacher_note ?? '',
        },
        dataQuality: {
          status: warnings.length === 0 ? 'complete' : 'warning',
          warnings,
        },
        updatedAt: row.scraped_at ? this.isoTimestamp(row.scraped_at) : null,
      };
    });

    const countLevel = (level: InterventionLevel) =>
      students.filter((student) => student.interventionLevel === level).length;
    const deadlineDays = this.configNumber(config, 'review_deadline_days', 7);
    const today = new Date(`${asOf.iso}T00:00:00Z`).getTime();
    const dueSoon = reviewRows.filter((row) => {
      if (row.is_overdue || !row.deadline) return false;
      const days = (new Date(row.deadline).getTime() - today) / DAY_MS;
      return days >= 0 && days <= 2;
    }).length;
    const overdue = reviewRows.filter(
      (row) =>
        row.is_overdue ||
        (row.deadline && new Date(row.deadline).getTime() < today),
    ).length;

    return this.serializeBigInt({
      meta: {
        apiVersion: 'v1',
        classId,
        asOf: asOf.iso,
        generatedAt: new Date().toISOString(),
        thresholdVersion:
          configRows
            .map((row) => this.isoTimestamp(row.updated_at))
            .filter(Boolean)
            .sort()
            .at(-1) ?? null,
      },
      classHeader: {
        ...this.mapClassHeader(classRow, this.countRoster(students)),
        contactCheckpoint,
      },
      actionSummary: {
        level1: {
          count: countLevel('level_1'),
          label: 'Nhắc chăm học',
          actionCode: 'REMIND_STUDY_HABIT',
        },
        level2: {
          count: countLevel('level_2'),
          label: 'Cần theo sát',
          actionCode: 'FOLLOW_UP_CLOSELY',
        },
        level3: {
          count: countLevel('level_3'),
          label: 'Bàn lại lộ trình',
          actionCode: 'REVIEW_LEARNING_PATH',
        },
        softPassReview: {
          pending: reviewRows.length,
          dueSoon,
          overdue,
          slaDays: deadlineDays,
        },
      },
      tabs: {
        all: students.length,
        active: students.filter(
          (student) => student.registrationStatus === 'on_going',
        ).length,
        level1: countLevel('level_1'),
        level2: countLevel('level_2'),
        level3: countLevel('level_3'),
        noAction: countLevel('none'),
        noData: students.filter((student) => student.label === 'no_data')
          .length,
      },
      students,
    });
  }

  private async queryTeacherClass(
    classId: number,
    asOf: Date,
    khoiIds?: number[],
  ) {
    const scopeFilter = khoiIds && khoiIds.length > 0
      ? Prisma.sql`AND c.course_id IN (${Prisma.join(khoiIds)})`
      : Prisma.empty;
    return this.prisma.$queryRaw<any[]>`
      SELECT
        c.class_id, c.class_name, c.course_id, c.status, c.schedule, c.location,
        c.portal_url, c.total_sessions AS class_total_sessions,
        t.teacher_id, t.teacher_name, t.teacher_email, t.teacher_phone,
        s.completed_sessions, s.total_sessions, s.progress_pct,
        p.observed_completed_sessions, p.progress_data_as_of,
        s.active_students, s.on_hold_students, s.dropped_students,
        s.transferred_students, s.snapshot_date
      FROM izone.classes c
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      LEFT JOIN LATERAL (
        SELECT cs.*
        FROM izone.class_daily_snapshots cs
        WHERE cs.class_id = c.class_id AND cs.snapshot_date <= ${asOf}
        ORDER BY cs.snapshot_date DESC
        LIMIT 1
      ) s ON TRUE
      LEFT JOIN LATERAL (
        SELECT
          GREATEST(
            COALESCE(sr.attendance_total, 0),
            COALESCE(sr.homework_total, 0)
          )::integer AS observed_completed_sessions,
          sr.record_date AS progress_data_as_of
        FROM izone.student_daily_records sr
        WHERE sr.class_id = c.class_id
          AND sr.snapshot_stage IS NULL
          AND sr.record_date <= ${asOf}
        ORDER BY observed_completed_sessions DESC, sr.record_date DESC
        LIMIT 1
      ) p ON TRUE
      WHERE c.class_id = ${classId}
        ${scopeFilter}
    `;
  }

  private todayInHoChiMinh() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const value = Object.fromEntries(
      parts.map((part) => [part.type, part.value]),
    );
    return `${value.year}-${value.month}-${value.day}`;
  }

  private buildClassEvidence(
    classRows: any[],
    snapshotRows: any[],
    studentMetricRows: any[],
  ): ClassObservationEvidence[] {
    return classRows.map((row) => {
      const classId = Number(row.class_id);
      return {
        classId,
        className: String(row.class_name),
        classStatus: String(row.status ?? ''),
        classTotalSessions: Number(row.total_sessions ?? 0),
        snapshots: snapshotRows
          .filter((snapshot) => Number(snapshot.class_id) === classId)
          .map((snapshot) => ({
            date: this.isoDate(snapshot.snapshot_date),
            activeStudents: Number(snapshot.active_students ?? 0),
            onHoldStudents: Number(snapshot.on_hold_students ?? 0),
            droppedStudents: Number(snapshot.dropped_students ?? 0),
            transferredStudents: Number(snapshot.transferred_students ?? 0),
            completedSessions: Number(snapshot.completed_sessions ?? 0),
            totalSessions: Number(
              snapshot.total_sessions ?? row.total_sessions ?? 0,
            ),
          })),
        studentMetrics: studentMetricRows
          .filter((metric) => Number(metric.class_id) === classId)
          .map((metric): StudentMetricEvidence => ({
            date: this.isoDate(metric.record_date),
            observedCompletedSessions: Number(
              metric.observed_completed_sessions ?? 0,
            ),
            recordCount: Number(metric.record_count ?? 0),
            attendanceSampleSize: Number(metric.attendance_sample_size ?? 0),
            attendanceAvg: this.nullableNumber(metric.attendance_avg),
            homeworkSampleSize: Number(metric.homework_sample_size ?? 0),
            homeworkAvg: this.nullableNumber(metric.homework_avg),
            testedStudents: Number(metric.tested_students ?? 0),
            passStandardStudents: Number(metric.pass_standard_students ?? 0),
            softPassStudents: Number(metric.soft_pass_students ?? 0),
          })),
      };
    });
  }

  private resolvedAttrition(
    startRows: ResolvedClassObservation[],
    endRows: ResolvedClassObservation[],
  ) {
    const startByClass = new Map(startRows.map((row) => [row.classId, row]));
    let newDroppedStudents = 0;
    let startingActiveStudents = 0;
    let comparableClasses = 0;
    for (const end of endRows) {
      const start = startByClass.get(end.classId);
      if (!start?.roster.dataAsOf || !end.roster.dataAsOf) continue;
      comparableClasses += 1;
      startingActiveStudents += start.roster.activeStudents;
      newDroppedStudents += Math.max(
        0,
        end.roster.droppedStudents - start.roster.droppedStudents,
      );
    }
    return {
      newDroppedStudents,
      comparableClasses,
      periodAttritionRate:
        startingActiveStudents === 0
          ? null
          : Math.round((newDroppedStudents / startingActiveStudents) * 1000) /
            10,
    };
  }

  private latestStudentMetric(rows: any[], classId: number, asOf: string) {
    return rows
      .filter(
        (row) =>
          Number(row.class_id) === classId &&
          this.isoDate(row.record_date) <= asOf &&
          Number(row.record_count ?? 0) > 0,
      )
      .sort((a, b) =>
        this.isoDate(b.record_date).localeCompare(this.isoDate(a.record_date)),
      )[0];
  }

  private activeStudentsMetric(
    current: ResolvedClassObservation[],
    previous: ResolvedClassObservation[],
  ): DashboardMetric {
    const validCurrent = current.filter((row) => row.roster.dataAsOf !== null);
    const validPrevious = previous.filter(
      (row) => row.roster.dataAsOf !== null,
    );
    const previousIds = new Set(validPrevious.map((row) => row.classId));
    const comparable = validCurrent.filter((row) =>
      previousIds.has(row.classId),
    );
    const value = validCurrent.reduce(
      (sum, row) => sum + row.roster.activeStudents,
      0,
    );
    const baselineValue = validPrevious
      .filter((row) => comparable.some((item) => item.classId === row.classId))
      .reduce((sum, row) => sum + row.roster.activeStudents, 0);
    const currentComparable = comparable.reduce(
      (sum, row) => sum + row.roster.activeStudents,
      0,
    );
    const delta =
      comparable.length === 0 ? null : currentComparable - baselineValue;
    return {
      value,
      baselineValue: comparable.length === 0 ? null : baselineValue,
      delta,
      direction: this.direction(delta, false),
      sampleSize: value,
      classesReported: validCurrent.length,
      comparableClasses: comparable.length,
      totalClasses: current.length,
    };
  }

  private riskMetric(
    current: ResolvedClassObservation[],
    previous: ResolvedClassObservation[],
    metricRows: any[],
  ): DashboardMetric {
    const valueOf = (observation: ResolvedClassObservation | undefined) => {
      if (!observation) return null;
      const metric = this.latestStudentMetric(
        metricRows,
        observation.classId,
        observation.asOf,
      );
      const count = Number(metric?.record_count ?? 0);
      if (count === 0) return null;
      return (
        Math.round(
          ((Number(metric.label_red ?? 0) + Number(metric.label_grey ?? 0)) /
            count) *
            1000,
        ) / 10
      );
    };
    const weighted = (rows: ResolvedClassObservation[]) => {
      const valid = rows
        .map((row) => ({ row, value: valueOf(row) }))
        .filter(
          (item): item is { row: ResolvedClassObservation; value: number } =>
            item.value !== null && item.row.roster.activeStudents > 0,
        );
      const denominator = valid.reduce(
        (sum, item) => sum + item.row.roster.activeStudents,
        0,
      );
      return denominator === 0
        ? null
        : Math.round(
            (valid.reduce(
              (sum, item) => sum + item.value * item.row.roster.activeStudents,
              0,
            ) /
              denominator) *
              10,
          ) / 10;
    };
    const previousById = new Map(previous.map((row) => [row.classId, row]));
    const comparableCurrent = current.filter(
      (row) =>
        valueOf(row) !== null &&
        valueOf(previousById.get(row.classId)) !== null,
    );
    const comparableIds = new Set(comparableCurrent.map((row) => row.classId));
    const comparablePrevious = previous.filter((row) =>
      comparableIds.has(row.classId),
    );
    const currentComparable = weighted(comparableCurrent);
    const baselineValue = weighted(comparablePrevious);
    const delta =
      currentComparable === null || baselineValue === null
        ? null
        : Math.round((currentComparable - baselineValue) * 10) / 10;
    return {
      value: weighted(current),
      baselineValue,
      delta,
      direction: this.direction(delta, true),
      sampleSize: current.reduce(
        (sum, row) => sum + row.roster.activeStudents,
        0,
      ),
      classesReported: current.filter((row) => valueOf(row) !== null).length,
      comparableClasses: comparableCurrent.length,
      totalClasses: current.length,
    };
  }

  private mapResolvedLeadClass(
    row: any,
    observation: ResolvedClassObservation,
    metrics: any,
    contactCoverage: ContactCoverage,
  ) {
    const activeStudents = Number(row?.roster_active_students ?? 0);
    const yellow = Number(metrics?.label_yellow ?? 0);
    const red = Number(metrics?.label_red ?? 0);
    const grey = Number(metrics?.label_grey ?? 0);
    const noData = Number(metrics?.label_no_data ?? 0);
    const explicitGreen = Number(metrics?.label_green ?? 0);
    const riskRate =
      Number(metrics?.record_count ?? 0) === 0
        ? null
        : Math.round(((red + grey) / Number(metrics.record_count)) * 1000) / 10;
    const attendance = observation.attendance.value;
    const homework = observation.homework.value;
    const healthStatus =
      attendance === null || homework === null
        ? 'no_data'
        : attendance < 70 || homework < 70
          ? 'critical'
          : attendance <= 80 || homework <= 80
            ? 'watch'
            : 'normal';
    return {
      classId: observation.classId,
      className: observation.className,
      courseId: Number(row?.course_id ?? DEFAULT_COURSE_ID),
      status: row?.status,
      schedule: row?.schedule,
      location: row?.location,
      portalUrl: row?.portal_url,
      teacher: {
        teacherId: Number(row?.teacher_id ?? 0),
        fullName: row?.teacher_name ?? '',
        email: row?.teacher_email ?? '',
        phone: row?.teacher_phone ?? 'N/A',
      },
      activeStudents,
      onHoldStudents: Number(row?.roster_on_hold_students ?? 0),
      droppedStudents: Number(row?.roster_dropped_students ?? 0),
      transferredStudents: Number(row?.roster_transferred_students ?? 0),
      attendanceAvg: attendance,
      homeworkAvg: homework,
      passStandardRate: observation.passStandard.value,
      softPassRate: observation.softPass.value,
      riskRate,
      progress: observation.progress,
      healthStatus,
      isAlarmTriggered: riskRate !== null && riskRate >= 40,
      labelDistribution: {
        green:
          explicitGreen ||
          Math.max(0, activeStudents - yellow - red - grey - noData),
        yellow,
        red,
        grey,
        noData,
      },
      lastSnapshotDate: observation.roster.dataAsOf,
      contactCoverage,
      dataQuality: observation.dataQuality,
    };
  }

  private resolvedLabelDistribution(rows: any[]) {
    return rows.reduce(
      (totals, row) => ({
        green: totals.green + Number(row.labelDistribution.green ?? 0),
        yellow: totals.yellow + Number(row.labelDistribution.yellow ?? 0),
        red: totals.red + Number(row.labelDistribution.red ?? 0),
        grey: totals.grey + Number(row.labelDistribution.grey ?? 0),
        noData: totals.noData + Number(row.labelDistribution.noData ?? 0),
      }),
      { green: 0, yellow: 0, red: 0, grey: 0, noData: 0 },
    );
  }

  private parseLeadRange(fromInput?: string, toInput?: string) {
    const to = this.parseDate(
      toInput ?? new Date().toISOString().slice(0, 10),
      'to',
    );
    const defaultFrom = new Date(to.date);
    defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 89);
    const from = this.parseDate(
      fromInput ?? defaultFrom.toISOString().slice(0, 10),
      'from',
    );
    const inclusiveDays =
      Math.floor((to.date.getTime() - from.date.getTime()) / DAY_MS) + 1;
    if (inclusiveDays < 1 || inclusiveDays > 90) {
      throw new BadRequestException('Khoảng from-to phải từ 1 đến 90 ngày');
    }
    return { from: from.iso, to: to.iso, fromDate: from.date, toDate: to.date };
  }

  private parseDate(value: string, field: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException(`${field} must use YYYY-MM-DD`);
    }
    const date = new Date(`${value}T00:00:00Z`);
    if (
      Number.isNaN(date.getTime()) ||
      date.toISOString().slice(0, 10) !== value
    ) {
      throw new BadRequestException(`${field} is not a valid date`);
    }
    return { iso: value, date };
  }

  private parseOptionalInteger(
    value: string | undefined,
    fallback: number,
    field: string,
  ) {
    if (value === undefined) return fallback;
    const result = Number(value);
    if (!Number.isInteger(result))
      throw new BadRequestException(`${field} must be an integer`);
    return result;
  }

  private parseNullableInteger(value: string | undefined, field: string) {
    if (value === undefined) return null;
    return this.parseOptionalInteger(value, 0, field);
  }

  private normalizeLeadSnapshot(row: any): LeadSnapshotRow {
    return {
      classId: Number(row.class_id),
      date: this.isoDate(row.snapshot_date),
      activeStudents: Number(row.active_students ?? 0),
      onHoldStudents: Number(row.on_hold_students ?? 0),
      droppedStudents: Number(row.dropped_students ?? 0),
      attendanceAvg: this.nullableNumber(row.attendance_avg),
      homeworkAvg: this.nullableNumber(row.homework_avg),
      passStandardRate: this.nullableNumber(row.pass_chuan_rate),
      softPassRate: this.nullableNumber(row.pass_mem_rate),
      riskStudents: Number(row.label_red ?? 0) + Number(row.label_grey ?? 0),
      hasTestSample: Boolean(
        row.has_test_sample ?? Number(row.tests_completed ?? 0) > 0,
      ),
    };
  }

  private boundaryRows(rows: LeadSnapshotRow[], boundary: 'start' | 'end') {
    const result = new Map<number, LeadSnapshotRow>();
    for (const row of rows) {
      const existing = result.get(row.classId);
      if (
        !existing ||
        (boundary === 'start'
          ? row.date < existing.date
          : row.date > existing.date)
      ) {
        result.set(row.classId, row);
      }
    }
    return [...result.values()];
  }

  private latestRawRows(rows: any[]) {
    const result = new Map<number, any>();
    for (const row of rows) {
      const id = Number(row.class_id);
      const existing = result.get(id);
      if (
        !existing ||
        this.isoDate(row.snapshot_date) > this.isoDate(existing.snapshot_date)
      ) {
        result.set(id, row);
      }
    }
    return [...result.values()].sort((a, b) =>
      String(a.class_name).localeCompare(String(b.class_name)),
    );
  }

  private metric(
    value: number | null,
    baselineValue: number | null,
    inverse = false,
    sampleSize?: number,
    classesWithTests?: number,
  ): DashboardMetric {
    const delta =
      value === null || baselineValue === null
        ? null
        : Math.round((value - baselineValue) * 10) / 10;
    return {
      value,
      baselineValue,
      delta,
      direction: this.direction(delta, inverse),
      ...(sampleSize === undefined ? {} : { sampleSize }),
      ...(classesWithTests === undefined ? {} : { classesWithTests }),
    };
  }

  private direction(value: number | null, inverse: boolean): MetricDirection {
    if (value === null) return 'unknown';
    if (value === 0) return 'stable';
    const improving = inverse ? value < 0 : value > 0;
    return improving ? 'improving' : 'declining';
  }

  private labelDistribution(rows: any[]) {
    const totals = rows.reduce(
      (sum, row) => ({
        active: sum.active + Number(row.active_students ?? 0),
        yellow: sum.yellow + Number(row.label_yellow ?? 0),
        red: sum.red + Number(row.label_red ?? 0),
        grey: sum.grey + Number(row.label_grey ?? 0),
        noData: sum.noData + Number(row.label_no_data ?? 0),
      }),
      { active: 0, yellow: 0, red: 0, grey: 0, noData: 0 },
    );
    return {
      green: Math.max(
        0,
        totals.active -
          totals.yellow -
          totals.red -
          totals.grey -
          totals.noData,
      ),
      yellow: totals.yellow,
      red: totals.red,
      grey: totals.grey,
      noData: totals.noData,
    };
  }

  private configNumber(config: Map<any, any>, key: string, fallback: number) {
    const value = Number(config.get(key));
    return Number.isFinite(value) ? value : fallback;
  }

  private groupTests(rows: any[], rule: string) {
    const grouped = new Map<
      number,
      Map<number, { original?: any; makeup?: any }>
    >();
    for (const row of rows) {
      const studentId = Number(row.student_id);
      const testOrder = Number(row.test_order);
      const studentTests = grouped.get(studentId) ?? new Map();
      const attempt = studentTests.get(testOrder) ?? {};
      if (row.is_makeup) attempt.makeup = row;
      else attempt.original = row;
      studentTests.set(testOrder, attempt);
      grouped.set(studentId, studentTests);
    }

    const result = new Map<number, Array<any>>();
    for (const [studentId, tests] of grouped) {
      const scores = [...tests.entries()]
        .sort(([a], [b]) => a - b)
        .map(([testOrder, attempt]) => {
          const rawScore =
            this.nullableNumber(attempt.original?.raw_score) ??
            this.nullableNumber(attempt.original?.final_score);
          const makeupScore =
            this.nullableNumber(attempt.makeup?.makeup_score) ??
            this.nullableNumber(attempt.makeup?.final_score) ??
            this.nullableNumber(attempt.makeup?.raw_score);
          let finalScore = rawScore;
          if (rule === 'replace') finalScore = makeupScore ?? rawScore;
          else if (rule === 'average') {
            finalScore =
              rawScore !== null && makeupScore !== null
                ? Math.round(((rawScore + makeupScore) / 2) * 10) / 10
                : (makeupScore ?? rawScore);
          } else if (makeupScore !== null) {
            finalScore =
              rawScore === null ? makeupScore : Math.max(rawScore, makeupScore);
          }
          return {
            testOrder,
            testName:
              attempt.original?.test_name ??
              attempt.makeup?.test_name ??
              `Test ${testOrder}`,
            rawScore,
            makeupScore,
            finalScore,
            isMakeup: makeupScore !== null,
          };
        });
      result.set(studentId, scores);
    }
    return result;
  }

  private groupTestsByStudentClass(rows: any[], rule: string) {
    const rowsByStudentClass = new Map<string, any[]>();
    for (const row of rows) {
      const key = `${Number(row.student_id)}:${Number(row.class_id)}`;
      rowsByStudentClass.set(key, [
        ...(rowsByStudentClass.get(key) ?? []),
        row,
      ]);
    }

    const result = new Map<string, Array<any>>();
    for (const [key, scopedRows] of rowsByStudentClass) {
      const studentId = Number(scopedRows[0].student_id);
      result.set(key, this.groupTests(scopedRows, rule).get(studentId) ?? []);
    }
    return result;
  }

  private groupContacts(rows: any[]) {
    const result = new Map<number, any[]>();
    for (const row of rows) {
      const id = Number(row.student_id);
      result.set(id, [...(result.get(id) ?? []), row]);
    }
    return result;
  }

  private testTrend(scores: Array<any>) {
    if (scores.length < 2) return scores.length === 0 ? 'no_data' : 'stable';
    const delta =
      Number(scores.at(-1).finalScore) - Number(scores.at(-2).finalScore);
    return delta > 0 ? 'improving' : delta < 0 ? 'declining' : 'stable';
  }

  private effectiveRegistrationStatus(status: string, classStatus: string) {
    return status === 'queuing' &&
      ['on_going', 'completed'].includes(classStatus)
      ? 'dropped'
      : status;
  }

  private countRoster(students: Array<{ registrationStatus: string }>) {
    return students.reduce(
      (counts, student) => {
        switch (student.registrationStatus) {
          case 'on_going':
          case 'active':
            counts.active += 1;
            break;
          case 'on_hold':
            counts.onHold += 1;
            break;
          case 'transferred':
            counts.transferred += 1;
            break;
          default:
            counts.dropped += 1;
        }
        counts.total += 1;
        return counts;
      },
      { total: 0, active: 0, onHold: 0, dropped: 0, transferred: 0 },
    );
  }

  private mapClassHeader(
    row: any,
    studentCounts: {
      total: number;
      active: number;
      onHold: number;
      dropped: number;
      transferred: number;
    },
  ) {
    const totalSessions = Math.max(
      0,
      Number(row.class_total_sessions ?? row.total_sessions ?? 0),
    );
    const observedCompletedSessions = Number(
      row.observed_completed_sessions ?? 0,
    );
    const rawCompletedSessions =
      observedCompletedSessions > 0
        ? observedCompletedSessions
        : Number(row.completed_sessions ?? 0);
    const completedSessions = Math.min(
      totalSessions || rawCompletedSessions,
      Math.max(0, rawCompletedSessions),
    );
    return {
      classId: Number(row.class_id),
      className: row.class_name,
      courseId: Number(row.course_id),
      courseName:
        COURSE_NAMES[Number(row.course_id)] ?? `Khóa học ${row.course_id}`,
      status: row.status,
      schedule: row.schedule,
      location: row.location,
      portalUrl: row.portal_url,
      teacher: {
        teacherId: Number(row.teacher_id),
        fullName: row.teacher_name,
        email: row.teacher_email,
        phone: row.teacher_phone ?? 'N/A',
      },
      progress: {
        completedSessions,
        totalSessions,
        percentage:
          totalSessions === 0
            ? null
            : Math.round((completedSessions / totalSessions) * 1000) / 10,
        dataAsOf: row.progress_data_as_of
          ? this.isoDate(row.progress_data_as_of)
          : row.snapshot_date
            ? this.isoDate(row.snapshot_date)
            : null,
      },
      studentCounts,
      lastSnapshotDate: row.snapshot_date
        ? this.isoDate(row.snapshot_date)
        : null,
    };
  }

  private parseReasons(value: unknown): string[] {
    if (!value) return [];
    return String(value)
      .split(/[,;]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private nullableNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null;
    const result = Number(value);
    return Number.isFinite(result) ? result : null;
  }

  private isoDate(value: unknown): string {
    if (typeof value === 'string') return value.slice(0, 10);
    return new Date(value as any).toISOString().slice(0, 10);
  }

  private isoTimestamp(value: unknown): string | null {
    if (!value) return null;
    return new Date(value as any).toISOString();
  }

  private serializeBigInt<T>(data: T): T {
    return JSON.parse(
      JSON.stringify(data, (_key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }
}
