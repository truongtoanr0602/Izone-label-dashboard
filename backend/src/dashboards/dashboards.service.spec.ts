import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';

const leadUser = {
  userId: 'lead_1',
  email: 'lead@izone.edu.vn',
  displayName: 'Lead 34',
  role: 'lead' as const,
  teacherId: 1,
  khoiId: 34,
  classIds: [],
};

function snapshotRow(
  classId: number,
  date: string,
  activeStudents: number,
  completedSessions: number,
) {
  return {
    class_id: classId,
    snapshot_date: date,
    active_students: activeStudents,
    on_hold_students: 0,
    dropped_students: 0,
    transferred_students: 0,
    completed_sessions: completedSessions,
    total_sessions: 28,
    scraped_at: `${date}T03:00:00Z`,
  };
}

function metricRow(
  classId: number,
  date: string,
  students: number,
  attendance: number,
  homework: number,
  passStandard: number,
  softPass: number,
) {
  return {
    class_id: classId,
    record_date: date,
    record_count: students,
    attendance_sample_size: students,
    attendance_avg: attendance,
    homework_sample_size: students,
    homework_avg: homework,
    tested_students: students,
    pass_standard_students: passStandard,
    soft_pass_students: softPass,
    label_green: 0,
    label_yellow: students - 2,
    label_red: 1,
    label_grey: 1,
    label_no_data: 0,
    scraped_at: `${date}T03:00:00Z`,
  };
}

describe('DashboardsService', () => {
  it('uses snapshot-evidenced period classes consistently across Lead queries', async () => {
    const queryRaw = jest.fn().mockResolvedValue([]);
    const service = new DashboardsService({ $queryRaw: queryRaw } as never);

    await service.getLeadDashboard(
      { courseId: '2', khoiId: '34', period: '2026-08' },
      leadUser,
    );

    const statements = queryRaw.mock.calls.map(([query]) =>
      Array.isArray(query?.strings) ? query.strings.join('?') : String(query),
    );
    const classQueries = statements.filter((sql) => sql.includes('izone.classes c'));
    const configQuery = statements.find((sql) => sql.includes('izone.system_configs'));

    expect(classQueries).toHaveLength(7);
    for (const sql of classQueries) {
      expect(sql).toContain("c.status IN ('on_going', 'completed')");
      expect(sql).toContain('EXISTS');
      expect(sql).toContain('FROM izone.class_daily_snapshots period_snapshot');
      expect(sql).toContain('period_snapshot.snapshot_date BETWEEN');
    }
    expect(configQuery).not.toContain('period_snapshot');
  });

  it('rejects a Lead trend window longer than 90 inclusive days', async () => {
    const service = new DashboardsService({ $queryRaw: jest.fn() } as never);

    await expect(
      service.getLeadDashboard(
        { courseId: '2', khoiId: '34', from: '2026-01-01', to: '2026-04-01' },
        leadUser,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('does not allow a teacher to call the lead contract', async () => {
    const service = new DashboardsService({ $queryRaw: jest.fn() } as never);

    await expect(
      service.getLeadDashboard(
        { courseId: '2', khoiId: '34', from: '2026-08-01', to: '2026-08-02' },
        { ...leadUser, role: 'teacher', classIds: [1159] },
      ),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('returns weighted Lead KPI and transition momentum in the screen contract', async () => {
    const queryRaw = jest
      .fn()
      .mockResolvedValueOnce([
        {
          class_id: 1,
          class_name: '34A',
          course_id: 2,
          status: 'on_going',
          total_sessions: 28,
          teacher_id: 10,
          teacher_name: 'GV A',
          teacher_email: 'a@izone.edu.vn',
          roster_active_students: 18,
          roster_on_hold_students: 0,
          roster_dropped_students: 0,
          roster_transferred_students: 0,
        },
        {
          class_id: 2,
          class_name: '34B',
          course_id: 2,
          status: 'on_going',
          total_sessions: 28,
          teacher_id: 11,
          teacher_name: 'GV B',
          teacher_email: 'b@izone.edu.vn',
        },
      ])
      .mockResolvedValueOnce([
        snapshotRow(1, '2026-07-31', 10, 9),
        snapshotRow(1, '2026-08-10', 10, 10),
        snapshotRow(1, '2026-08-12', 10, 0),
        snapshotRow(2, '2026-07-31', 30, 11),
        snapshotRow(2, '2026-08-10', 30, 12),
        snapshotRow(2, '2026-08-12', 30, 0),
      ])
      .mockResolvedValueOnce([
        metricRow(1, '2026-07-31', 10, 70, 70, 4, 5),
        metricRow(1, '2026-08-10', 10, 80, 80, 4, 4),
        metricRow(2, '2026-07-31', 30, 90, 80, 18, 21),
        metricRow(2, '2026-08-10', 30, 100, 90, 18, 5),
      ])
      .mockResolvedValueOnce([
        {
          record_date: '2026-07-15',
          student_id: 200,
          class_id: 2,
          label_change_direction: 'up',
        },
        {
          record_date: '2026-08-01',
          student_id: 100,
          class_id: 1,
          label_change_direction: 'up',
        },
      ])
      .mockResolvedValueOnce([
        {
          config_key: 'nguong_xam_max',
          config_value: '45',
        },
        {
          config_key: 'nguong_do_max',
          config_value: '60',
        },
        {
          config_key: 'pass_dh_min',
          config_value: '90',
        },
        {
          config_key: 'pass_btvn_min',
          config_value: '90',
        },
      ]) // configRows (coverage thresholds)
      .mockResolvedValueOnce([
        {
          student_id: 500,
          class_id: 1,
          attendance_pct: 95,
          attendance_present: 1,
          attendance_total: 2,
          homework_pct: 95,
          homework_done: 19,
          homework_total: 20,
          test_average: 90,
          flag_attendance_drop: false,
          flag_homework_drop: false,
          last_checkpoint: '',
          registration_status: 'on_going',
          latest_test_name: 'Test 5',
        },
        {
          // No confirmed Test row exists for this student. A stale aggregate
          // in student_daily_records must not manufacture a grey episode.
          student_id: 502,
          class_id: 1,
          attendance_pct: 100,
          attendance_present: 10,
          attendance_total: 10,
          homework_pct: 100,
          homework_done: 10,
          homework_total: 10,
          test_average: 40,
          flag_attendance_drop: false,
          flag_homework_drop: false,
          last_checkpoint: 'Test 1',
          registration_status: 'on_going',
        },
      ]) // coverageStudentRows
      .mockResolvedValueOnce([
        {
          student_id: 500,
          class_id: 1,
          test_order: 5,
          test_name: 'Test 5',
          raw_score: 90,
          makeup_score: null,
          final_score: 90,
          is_makeup: false,
        },
        {
          // Historical score from Student 500's former class must not enter
          // the current-class label/intervention calculation.
          student_id: 500,
          class_id: 2,
          test_order: 6,
          test_name: 'Test 6',
          raw_score: 20,
          makeup_score: null,
          final_score: 20,
          is_makeup: false,
        },
        {
          student_id: 501,
          class_id: 1,
          test_order: 6,
          test_name: 'Test 6',
          raw_score: 80,
          makeup_score: null,
          final_score: 80,
          is_makeup: false,
        },
      ]) // coverageTestRows: Test 6 is the checkpoint for the whole class
      .mockResolvedValueOnce([
        {
          student_id: 500,
          class_id: 1,
          trigger_type: 'habit_reminder',
          checkpoint: 'Test 6',
        },
      ]); // contactLogRows
    const service = new DashboardsService({ $queryRaw: queryRaw } as never);

    const result = await service.getLeadDashboard(
      { courseId: '2', khoiId: '34', period: '2026-08' },
      leadUser,
    );

    expect(result.meta.previousAsOf).toBe('2026-07-31');
    expect(result.kpis.attendanceAvg.value).toBe(95);
    expect(result.kpis.attendanceAvg.delta).toBe(10);
    expect(result.kpis.attendanceAvg.comparableClasses).toBe(2);
    expect(result.kpis.passStandardRate).toMatchObject({
      value: 55,
      qualifiedStudents: 22,
      sampleSize: 40,
    });
    expect(result.kpis.softPassRate).toMatchObject({
      value: 22.5,
      qualifiedStudents: 9,
      sampleSize: 40,
    });
    expect(result.kpis.netMomentum.value).toBe(1);
    expect(result.kpis.netMomentum.delta).toBeNull();
    expect(result.kpis.netMomentum.comparableClasses).toBe(0);
    expect(result.kpis.netMomentum.totalClasses).toBe(2);
    expect(result.trend).toHaveLength(14);
    expect(result.classes).toHaveLength(2);
    expect(result.classes[0].activeStudents).toBe(18);
    expect(result.classes[0].progress.completedSessions).toBe(10);
    expect(result.classes[0].attendanceAvg).toBe(80);
    expect(result.classes[0].dataQuality.status).toBe('fallback');
    // Counts (1/2), not the stale 95% source field, open Student 500's habit
    // episode. Student 501's newer Test 6 establishes the checkpoint for the
    // whole class, so the Teacher-written Test 6 contact closes it on Lead.
    expect(result.classes[0].contactCoverage).toEqual({
      done: 1,
      total: 1,
      pct: 100,
    });
    // Class 2 has no coverage students at all -- must be null, not 0, so a
    // "no warnings" class and a "0% covered" class stay visually distinct.
    expect(result.classes[1].contactCoverage).toEqual({
      done: 0,
      total: 0,
      pct: null,
    });
    const queryCalls = queryRaw.mock.calls as unknown as Array<
      [TemplateStringsArray, ...unknown[]]
    >;
    const coverageStudentSql = Array.from(queryCalls[5][0]).join('?');
    expect(coverageStudentSql).toMatch(/s\.class_id\s*=\s*r\.class_id/i);

    const studentMetricSql = (
      queryRaw.mock.calls[2][0] as TemplateStringsArray
    ).join('?');
    expect(studentMetricSql).toMatch(/s\.class_id\s*=\s*r\.class_id/i);
    expect(studentMetricSql).toContain('r.test_average >= 60');
    expect(studentMetricSql).toContain('r.test_average >= 50');
    expect(studentMetricSql).toContain('r.test_average < 55');
    expect(studentMetricSql).toContain('r.test_average < 60');
    expect(studentMetricSql).not.toContain('r.pass_mem_status IN');
  });

  it('returns an empty macro period while preserving current Master Table state', async () => {
    const queryRaw = jest
      .fn()
      .mockResolvedValueOnce([
        {
          class_id: 1,
          class_name: '34A',
          course_id: 2,
          status: 'on_going',
          total_sessions: 28,
          teacher_id: 10,
          teacher_name: 'GV A',
          teacher_email: 'a@izone.edu.vn',
        },
      ])
      .mockResolvedValueOnce([snapshotRow(1, '2026-08-12', 10, 10)])
      .mockResolvedValueOnce([
        metricRow(1, '2026-08-12', 10, 86, 82, 4, 2),
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const service = new DashboardsService({ $queryRaw: queryRaw } as never);

    const result = await service.getLeadDashboard(
      { courseId: '2', khoiId: '34', period: '2026-07' },
      leadUser,
    );

    expect(result.meta.hasDataForPeriod).toBe(false);
    expect(result.kpis.attendanceAvg.value).toBeNull();
    expect(result.kpis.passStandardRate.value).toBeNull();
    expect(result.trend).toEqual([]);
    expect(result.classes[0].attendanceAvg).toBe(86);
  });

  it('returns every student and derives exclusive Teacher action counts', async () => {
    const queryRaw = jest
      .fn()
      .mockResolvedValueOnce([
        {
          class_id: 1159,
          class_name: '34A-1159',
          course_id: 2,
          status: 'on_going',
          schedule: 'T3-T5',
          location: 'Online',
          portal_url: null,
          teacher_id: 1002,
          teacher_name: 'GV A',
          teacher_email: 'gv@izone.edu.vn',
          completed_sessions: 10,
          total_sessions: 28,
          progress_pct: 35.71,
          active_students: 2,
          on_hold_students: 0,
          dropped_students: 0,
          transferred_students: 0,
          snapshot_date: '2026-08-12',
        },
      ])
      .mockResolvedValueOnce([
        {
          config_key: 'nguong_xam_max',
          config_value: '45',
          updated_at: '2026-08-11T00:00:00Z',
        },
        {
          config_key: 'nguong_do_max',
          config_value: '60',
          updated_at: '2026-08-11T00:00:00Z',
        },
        {
          config_key: 'pass_dh_min',
          config_value: '90',
          updated_at: '2026-08-11T00:00:00Z',
        },
        {
          config_key: 'pass_btvn_min',
          config_value: '90',
          updated_at: '2026-08-11T00:00:00Z',
        },
        {
          config_key: 'review_deadline_days',
          config_value: '7',
          updated_at: '2026-08-11T00:00:00Z',
        },
      ])
      .mockResolvedValueOnce([
        {
          student_id: 1,
          full_name: 'Student Grey',
          phone: '0901',
          email: null,
          registration_status: 'on_going',
          admitted_at: '2026-01-01',
          record_date: '2026-08-12',
          attendance_pct: 37.5,
          attendance_present: 8,
          attendance_total: 10,
          homework_pct: 28.57,
          homework_done: 8,
          homework_total: 10,
          test_average: 40,
          flag_attendance_drop: false,
          flag_homework_drop: false,
          last_checkpoint: 'Test 2',
          pass_chuan_status: 'not_met',
          pass_chuan_reasons: 'TB test<60',
          pass_mem_status: '',
          pass_mem_group: '',
          teacher_feedback_btvn: '',
          teacher_feedback_orient: '',
          teacher_note: '',
          scraped_at: '2026-08-12T03:00:00Z',
        },
        {
          student_id: 2,
          full_name: 'Student Without Snapshot',
          phone: null,
          email: null,
          registration_status: 'on_going',
          admitted_at: '2026-01-02',
          record_date: null,
          attendance_pct: null,
          attendance_present: null,
          attendance_total: null,
          homework_pct: null,
          homework_done: null,
          homework_total: null,
          test_average: null,
          flag_attendance_drop: false,
          flag_homework_drop: false,
          last_checkpoint: null,
          pass_chuan_status: null,
          pass_chuan_reasons: null,
          pass_mem_status: null,
          pass_mem_group: null,
          teacher_feedback_btvn: null,
          teacher_feedback_orient: null,
          teacher_note: null,
          scraped_at: null,
        },
        {
          student_id: 3,
          full_name: 'Student With Stale Stored Average',
          phone: null,
          email: null,
          registration_status: 'on_going',
          admitted_at: '2026-01-03',
          record_date: '2026-08-12',
          attendance_pct: 100,
          attendance_present: 10,
          attendance_total: 10,
          homework_pct: 100,
          homework_done: 10,
          homework_total: 10,
          test_average: 90,
          flag_attendance_drop: false,
          flag_homework_drop: false,
          last_checkpoint: 'Test 1',
          pass_chuan_status: null,
          pass_chuan_reasons: null,
          pass_mem_status: null,
          pass_mem_group: null,
          teacher_feedback_btvn: null,
          teacher_feedback_orient: null,
          teacher_note: null,
          scraped_at: '2026-08-12T03:00:00Z',
        },
      ])
      .mockResolvedValueOnce([
        {
          student_id: 1,
          test_order: 1,
          test_name: 'Test 1',
          raw_score: 40,
          makeup_score: null,
          final_score: 40,
          is_makeup: false,
        },
        {
          student_id: 1,
          test_order: 1,
          test_name: 'Test 1',
          raw_score: 40,
          makeup_score: 35,
          final_score: 35,
          is_makeup: true,
        },
        {
          student_id: 2,
          test_order: 1,
          test_name: 'Test 1',
          raw_score: 88.75,
          makeup_score: null,
          final_score: 88.75,
          is_makeup: false,
        },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const service = new DashboardsService({ $queryRaw: queryRaw } as never);

    const result = await service.getTeacherDashboard(1159, '2026-08-12', {
      ...leadUser,
      role: 'teacher',
      classIds: [1159],
    });

    expect(result.students).toHaveLength(3);
    expect(result.students[0]).toMatchObject({
      label: 'grey',
      interventionLevel: 'level_3',
      attendance: { percentage: 80, present: 8, total: 10 },
      homework: { percentage: 80, completed: 8, total: 10 },
      actionState: { checkpoint: 'Test 1' },
      dataQuality: {
        status: 'warning',
        warnings: [
          'ATTENDANCE_SOURCE_PERCENT_MISMATCH',
          'HOMEWORK_SOURCE_PERCENT_MISMATCH',
        ],
      },
    });
    expect(result.classHeader.contactCheckpoint).toBe('Test 1');
    expect(result.students[0].tests.average).toBe(40);
    expect(result.students[0].issues).toHaveLength(3);
    expect(result.students[1]).toMatchObject({
      label: 'yellow',
      interventionLevel: 'none',
      attendance: { percentage: null, present: null, total: null },
      homework: { percentage: null, completed: null, total: null },
      dataQuality: {
        status: 'warning',
        warnings: ['MISSING_ATTENDANCE_DATA', 'MISSING_HOMEWORK_DATA'],
      },
    });
    expect(result.students[2]).toMatchObject({
      label: 'no_data',
      interventionLevel: 'none',
      tests: { average: null, scores: [] },
    });
    expect(result.actionSummary.level3.count).toBe(1);
    expect(result.classHeader.studentCounts).toEqual({
      total: 3,
      active: 3,
      onHold: 0,
      dropped: 0,
      transferred: 0,
    });
    expect(result.tabs.all).toBe(3);
    expect(result.tabs.level1 + result.tabs.level2 + result.tabs.level3).toBe(
      1,
    );
  });

  it('falls back an empty-string last_checkpoint to the latest confirmed test name, not to Chưa có test', async () => {
    // last_checkpoint = '' (not null) is what the DB actually stores for a
    // student without a saved checkpoint. `??` would keep '' as-is because
    // '' is not null/undefined; only `||` falls through past it. This test
    // fails under `??` and passes under `||`, proving the fix stays fixed.
    const queryRaw = jest
      .fn()
      .mockResolvedValueOnce([
        {
          class_id: 5000,
          class_name: '34Z-5000',
          course_id: 2,
          status: 'on_going',
          schedule: 'T2-T4',
          location: 'Online',
          portal_url: null,
          teacher_id: 1002,
          teacher_name: 'GV A',
          teacher_email: 'gv@izone.edu.vn',
          completed_sessions: 10,
          total_sessions: 28,
          progress_pct: 35.71,
          active_students: 1,
          on_hold_students: 0,
          dropped_students: 0,
          transferred_students: 0,
          snapshot_date: '2026-08-12',
        },
      ])
      .mockResolvedValueOnce([
        {
          config_key: 'nguong_xam_max',
          config_value: '45',
          updated_at: '2026-08-11T00:00:00Z',
        },
        {
          config_key: 'nguong_do_max',
          config_value: '60',
          updated_at: '2026-08-11T00:00:00Z',
        },
        {
          config_key: 'pass_dh_min',
          config_value: '90',
          updated_at: '2026-08-11T00:00:00Z',
        },
        {
          config_key: 'pass_btvn_min',
          config_value: '90',
          updated_at: '2026-08-11T00:00:00Z',
        },
        {
          config_key: 'review_deadline_days',
          config_value: '7',
          updated_at: '2026-08-11T00:00:00Z',
        },
      ])
      .mockResolvedValueOnce([
        {
          student_id: 1,
          full_name: 'Student Empty Checkpoint',
          phone: '0901',
          email: null,
          registration_status: 'on_going',
          admitted_at: '2026-01-01',
          record_date: '2026-08-12',
          attendance_pct: 95,
          attendance_present: 19,
          attendance_total: 20,
          homework_pct: 95,
          homework_done: 19,
          homework_total: 20,
          test_average: 80,
          flag_attendance_drop: false,
          flag_homework_drop: false,
          last_checkpoint: '',
          pass_chuan_status: 'not_met',
          pass_chuan_reasons: '',
          pass_mem_status: '',
          pass_mem_group: '',
          teacher_feedback_btvn: '',
          teacher_feedback_orient: '',
          teacher_note: '',
          scraped_at: '2026-08-12T03:00:00Z',
        },
      ])
      .mockResolvedValueOnce([
        {
          student_id: 1,
          test_order: 3,
          test_name: 'Test 3',
          raw_score: 80,
          makeup_score: null,
          final_score: 80,
          is_makeup: false,
        },
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const service = new DashboardsService({ $queryRaw: queryRaw } as never);

    const result = await service.getTeacherDashboard(5000, '2026-08-12', {
      ...leadUser,
      role: 'teacher',
      classIds: [5000],
    });

    expect(result.students[0].actionState.checkpoint).toBe('Test 3');
  });

  it('excludes snapshot_stage backfill rows from the per-student teacher-dashboard row pick', async () => {
    // A stage-snapshot row (migration 007) never sets attendance/homework
    // columns and can still win "ORDER BY record_date DESC, scraped_at DESC
    // LIMIT 1" over the live row for the same student — exactly the bug the
    // Lead Dashboard queries were already patched for (see studentMetricRows).
    // This asserts the per-student LATERAL subquery carries the same filter.
    const queryRaw = jest
      .fn()
      .mockResolvedValueOnce([
        {
          class_id: 5000,
          class_name: '34Z-5000',
          course_id: 2,
          status: 'on_going',
          schedule: 'T2-T4',
          location: 'Online',
          portal_url: null,
          teacher_id: 1002,
          teacher_name: 'GV A',
          teacher_email: 'gv@izone.edu.vn',
          completed_sessions: 10,
          total_sessions: 28,
          progress_pct: 35.71,
          active_students: 1,
          on_hold_students: 0,
          dropped_students: 0,
          transferred_students: 0,
          snapshot_date: '2026-08-12',
        },
      ])
      .mockResolvedValue([]);
    const service = new DashboardsService({ $queryRaw: queryRaw } as never);

    await service.getTeacherDashboard(5000, '2026-08-12', {
      ...leadUser,
      role: 'teacher',
      classIds: [5000],
    });

    const queryCalls = queryRaw.mock.calls as unknown as Array<
      [TemplateStringsArray, ...unknown[]]
    >;
    const studentRowsStrings = queryCalls[2][0];
    const studentRowsSql = Array.from(studentRowsStrings).join('?');
    expect(studentRowsSql).toMatch(/snapshot_stage\s+IS\s+NULL/i);
  });
});
