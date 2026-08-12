/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-base-to-string */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../auth/auth.service';
import {
  DEFAULT_DASHBOARD_THRESHOLDS,
  classifyStudent,
  type DashboardThresholds,
  type InterventionLevel,
} from './labeling-engine';
import {
  aggregateSnapshots,
  buildTrend,
  calculateAttrition,
  calculateNetMomentum,
  type LabelTransitionRow,
  type LeadSnapshotRow,
} from './lead-aggregation';
import type {
  DashboardMetric,
  LeadDashboardQuery,
  MetricDirection,
} from './dashboard.types';

const DAY_MS = 86_400_000;
const KH0I_34_COURSE_ID = 2;

@Injectable()
export class DashboardsService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeadDashboard(query: LeadDashboardQuery, user: AuthUser) {
    if (user.role === 'teacher') {
      throw new ForbiddenException(
        'Teacher accounts cannot access the Lead Dashboard',
      );
    }

    const range = this.parseLeadRange(query.from, query.to);
    const requestedCourseId = this.parseOptionalInteger(
      query.courseId,
      KH0I_34_COURSE_ID,
      'courseId',
    );
    if (requestedCourseId !== KH0I_34_COURSE_ID) {
      throw new BadRequestException(
        'Lead Dashboard hiện chỉ hỗ trợ courseId=2',
      );
    }
    const requestedKhoiId = this.parseOptionalInteger(
      query.khoiId,
      user.khoiId ?? 34,
      'khoiId',
    );
    const khoiId = user.role === 'lead' ? user.khoiId : requestedKhoiId;
    if (!khoiId) throw new ForbiddenException('User is not assigned to a khoi');

    const classStatus = query.classStatus ?? 'on_going';
    const teacherId = this.parseNullableInteger(query.teacherId, 'teacherId');
    const classId = this.parseNullableInteger(query.classId, 'classId');

    const snapshotRows = await this.prisma.$queryRaw<any[]>`
      SELECT
        s.class_id,
        c.class_name,
        c.status AS class_status,
        c.teacher_id,
        t.teacher_name,
        TO_CHAR(s.snapshot_date, 'YYYY-MM-DD') AS snapshot_date,
        s.active_students,
        s.on_hold_students,
        s.dropped_students,
        s.transferred_students,
        s.attendance_avg,
        s.homework_avg,
        s.pass_chuan_rate,
        s.pass_mem_rate,
        s.label_yellow,
        s.label_red,
        s.label_grey,
        s.label_no_data,
        s.completed_sessions,
        s.total_sessions,
        s.progress_pct,
        s.health_status,
        s.is_alarm_triggered,
        s.scraped_at,
        EXISTS (
          SELECT 1
          FROM izone.student_daily_records sr
          WHERE sr.class_id = s.class_id
            AND sr.record_date <= s.snapshot_date
            AND COALESCE(sr.tests_taken, 0) > 0
        ) AS has_test_sample
      FROM izone.class_daily_snapshots s
      JOIN izone.classes c ON c.class_id = s.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${KH0I_34_COURSE_ID}
        AND t.khoi_id = ${khoiId}
        AND c.status = ${classStatus}
        AND s.snapshot_date BETWEEN ${range.fromDate} AND ${range.toDate}
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
      ORDER BY s.snapshot_date ASC, s.class_id ASC
    `;

    const transitionRows = await this.prisma.$queryRaw<any[]>`
      SELECT
        TO_CHAR(r.record_date, 'YYYY-MM-DD') AS record_date,
        r.student_id,
        r.class_id,
        r.label_change_direction
      FROM izone.student_daily_records r
      JOIN izone.classes c ON c.class_id = r.class_id
      JOIN izone.teachers t ON t.teacher_id = c.teacher_id
      WHERE c.course_id = ${KH0I_34_COURSE_ID}
        AND t.khoi_id = ${khoiId}
        AND c.status = ${classStatus}
        AND r.record_date BETWEEN ${range.fromDate} AND ${range.toDate}
        AND r.has_label_changed = TRUE
        AND r.label_change_direction IN ('up', 'down')
        AND (${teacherId}::integer IS NULL OR c.teacher_id = ${teacherId})
        AND (${classId}::integer IS NULL OR c.class_id = ${classId})
      ORDER BY r.record_date ASC
    `;

    const normalizedSnapshots = snapshotRows.map((row) =>
      this.normalizeLeadSnapshot(row),
    );
    const transitions: LabelTransitionRow[] = transitionRows.map((row) => ({
      date: this.isoDate(row.record_date),
      studentId: Number(row.student_id),
      classId: Number(row.class_id),
      direction: row.label_change_direction,
    }));
    const startRows = this.boundaryRows(normalizedSnapshots, 'start');
    const endRows = this.boundaryRows(normalizedSnapshots, 'end');
    const baseline = aggregateSnapshots(startRows);
    const current = aggregateSnapshots(endRows);
    const attrition = calculateAttrition(startRows, endRows);
    const momentum = calculateNetMomentum(transitions);
    const latestRawByClass = this.latestRawRows(snapshotRows);
    const dataFreshnessAt =
      latestRawByClass
        .map((row) => this.isoTimestamp(row.scraped_at))
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;

    return this.serializeBigInt({
      meta: {
        apiVersion: 'v1',
        courseId: KH0I_34_COURSE_ID,
        khoiId,
        from: range.from,
        to: range.to,
        timezone: 'Asia/Ho_Chi_Minh',
        generatedAt: new Date().toISOString(),
        dataFreshnessAt,
      },
      kpis: {
        activeStudents: this.metric(
          current.activeStudents,
          baseline.activeStudents,
        ),
        attendanceAvg: this.metric(
          current.attendanceAvg,
          baseline.attendanceAvg,
          false,
          current.activeStudents,
        ),
        homeworkAvg: this.metric(
          current.homeworkAvg,
          baseline.homeworkAvg,
          false,
          current.activeStudents,
        ),
        passStandardRate: this.metric(
          current.passStandardRate,
          baseline.passStandardRate,
          false,
          current.testedActiveStudents,
          current.classesWithTests,
        ),
        softPassRate: this.metric(
          current.softPassRate,
          baseline.softPassRate,
          false,
          current.testedActiveStudents,
          current.classesWithTests,
        ),
        riskRate: this.metric(
          current.riskRate,
          baseline.riskRate,
          true,
          current.activeStudents,
        ),
        periodAttritionRate: {
          ...this.metric(attrition.periodAttritionRate, 0, true),
          newDroppedStudents: attrition.newDroppedStudents,
        },
        netMomentum: {
          ...momentum,
          direction: this.direction(momentum.value, false),
        },
      },
      trend: buildTrend(normalizedSnapshots, transitions, range.from, range.to),
      labelDistribution: this.labelDistribution(latestRawByClass),
      classes: latestRawByClass.map((row) => this.mapLeadClass(row)),
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

    const classRows =
      user.role === 'admin'
        ? await this.queryTeacherClass(classId, asOf.date)
        : await this.queryTeacherClass(classId, asOf.date, user.khoiId ?? -1);
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
      SELECT st.*, r.*
      FROM izone.students st
      LEFT JOIN LATERAL (
        SELECT sr.*
        FROM izone.student_daily_records sr
        WHERE sr.student_id = st.student_id
          AND sr.class_id = ${classId}
          AND sr.record_date <= ${asOf.date}
        ORDER BY sr.record_date DESC, sr.scraped_at DESC
        LIMIT 1
      ) r ON TRUE
      WHERE st.class_id = ${classId}
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
      const testAverage =
        computedTestAverage ?? this.nullableNumber(row.test_average);
      const classification = classifyStudent(
        {
          registrationStatus,
          attendancePct: this.nullableNumber(row.attendance_pct),
          homeworkPct: this.nullableNumber(row.homework_pct),
          testAverage,
          flagAttendanceDrop: Boolean(row.flag_attendance_drop),
          flagHomeworkDrop: Boolean(row.flag_homework_drop),
        },
        thresholds,
      );
      const review = reviewsByStudent.get(Number(row.student_id));
      const checkpoint =
        row.last_checkpoint ?? scores.at(-1)?.testName ?? 'Chưa có test';
      const trigger = classification.recommendedAction.messageTemplateKey;
      const contact = (
        contactsByStudent.get(Number(row.student_id)) ?? []
      ).find(
        (item) =>
          item.trigger_type === trigger && item.checkpoint === checkpoint,
      );
      const warnings: string[] = [];
      const snapshotAverage = this.nullableNumber(row.test_average);
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
          percentage: this.nullableNumber(row.attendance_pct),
          present: this.nullableNumber(row.attendance_present),
          total: this.nullableNumber(row.attendance_total),
          isDropping: Boolean(row.flag_attendance_drop),
        },
        homework: {
          percentage: this.nullableNumber(row.homework_pct),
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
          checkpoint,
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
      classHeader: this.mapClassHeader(classRow, students.length),
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
    khoiId?: number,
  ) {
    return this.prisma.$queryRaw<any[]>`
      SELECT
        c.class_id, c.class_name, c.course_id, c.status, c.schedule, c.location,
        c.portal_url, c.total_sessions AS class_total_sessions,
        t.teacher_id, t.teacher_name, t.teacher_email,
        s.completed_sessions, s.total_sessions, s.progress_pct,
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
      WHERE c.class_id = ${classId}
        AND c.course_id = ${KH0I_34_COURSE_ID}
        AND (${khoiId ?? null}::integer IS NULL OR t.khoi_id = ${khoiId ?? null})
    `;
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

  private mapLeadClass(row: any) {
    const activeStudents = Number(row.active_students ?? 0);
    const yellow = Number(row.label_yellow ?? 0);
    const red = Number(row.label_red ?? 0);
    const grey = Number(row.label_grey ?? 0);
    const noData = Number(row.label_no_data ?? 0);
    return {
      classId: Number(row.class_id),
      className: row.class_name,
      teacher: {
        teacherId: Number(row.teacher_id),
        fullName: row.teacher_name,
      },
      activeStudents,
      droppedStudents: Number(row.dropped_students ?? 0),
      attendanceAvg: this.nullableNumber(row.attendance_avg),
      homeworkAvg: this.nullableNumber(row.homework_avg),
      passStandardRate: this.nullableNumber(row.pass_chuan_rate),
      softPassRate: this.nullableNumber(row.pass_mem_rate),
      riskRate:
        this.nullableNumber(row.risk_pct) ?? this.riskRateFromCounts(row),
      progressPct: this.nullableNumber(row.progress_pct),
      healthStatus: row.health_status,
      isAlarmTriggered: Boolean(row.is_alarm_triggered),
      labelDistribution: {
        green: Math.max(0, activeStudents - yellow - red - grey - noData),
        yellow,
        red,
        grey,
        noData,
      },
      lastSnapshotDate: this.isoDate(row.snapshot_date),
    };
  }

  private riskRateFromCounts(row: any) {
    const active = Number(row.active_students ?? 0);
    if (active === 0) return null;
    return (
      Math.round(
        ((Number(row.label_red ?? 0) + Number(row.label_grey ?? 0)) / active) *
          100 *
          10,
      ) / 10
    );
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

  private mapClassHeader(row: any, totalStudents: number) {
    return {
      classId: Number(row.class_id),
      className: row.class_name,
      courseId: Number(row.course_id),
      courseName: 'Khối 34',
      status: row.status,
      schedule: row.schedule,
      location: row.location,
      portalUrl: row.portal_url,
      teacher: {
        teacherId: Number(row.teacher_id),
        fullName: row.teacher_name,
        email: row.teacher_email,
      },
      progress: {
        completedSessions: Number(row.completed_sessions ?? 0),
        totalSessions: Number(
          row.total_sessions ?? row.class_total_sessions ?? 0,
        ),
        percentage: this.nullableNumber(row.progress_pct),
      },
      studentCounts: {
        total: totalStudents,
        active: Number(row.active_students ?? 0),
        onHold: Number(row.on_hold_students ?? 0),
        dropped: Number(row.dropped_students ?? 0),
        transferred: Number(row.transferred_students ?? 0),
      },
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
