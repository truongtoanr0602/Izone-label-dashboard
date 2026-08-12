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
        metricRow(1, '2026-08-10', 10, 80, 80, 4, 5),
        metricRow(2, '2026-07-31', 30, 90, 80, 18, 21),
        metricRow(2, '2026-08-10', 30, 100, 90, 18, 21),
      ])
      .mockResolvedValueOnce([
        {
          record_date: '2026-08-01',
          student_id: 100,
          class_id: 1,
          label_change_direction: 'up',
        },
      ]);
    const service = new DashboardsService({ $queryRaw: queryRaw } as never);

    const result = await service.getLeadDashboard(
      { courseId: '2', khoiId: '34', period: '2026-08' },
      leadUser,
    );

    expect(result.meta.previousAsOf).toBe('2026-07-31');
    expect(result.kpis.attendanceAvg.value).toBe(95);
    expect(result.kpis.attendanceAvg.delta).toBe(10);
    expect(result.kpis.attendanceAvg.comparableClasses).toBe(2);
    expect(result.kpis.netMomentum.value).toBe(1);
    expect(result.trend).toHaveLength(14);
    expect(result.classes).toHaveLength(2);
    expect(result.classes[0].progress.completedSessions).toBe(10);
    expect(result.classes[0].attendanceAvg).toBe(80);
    expect(result.classes[0].dataQuality.status).toBe('fallback');
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
          attendance_pct: 80,
          attendance_present: 8,
          attendance_total: 10,
          homework_pct: 80,
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
      ])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    const service = new DashboardsService({ $queryRaw: queryRaw } as never);

    const result = await service.getTeacherDashboard(1159, '2026-08-12', {
      ...leadUser,
      role: 'teacher',
      classIds: [1159],
    });

    expect(result.students).toHaveLength(2);
    expect(result.students[0]).toMatchObject({
      label: 'grey',
      interventionLevel: 'level_3',
    });
    expect(result.students[0].tests.average).toBe(40);
    expect(result.students[0].issues).toHaveLength(3);
    expect(result.students[1]).toMatchObject({
      label: 'no_data',
      interventionLevel: 'none',
    });
    expect(result.actionSummary.level3.count).toBe(1);
    expect(result.tabs.all).toBe(2);
    expect(result.tabs.level1 + result.tabs.level2 + result.tabs.level3).toBe(
      1,
    );
  });
});
