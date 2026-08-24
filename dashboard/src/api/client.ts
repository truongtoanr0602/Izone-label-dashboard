import axios from 'axios';
import type { ClassSummary, StudentDetail, ClassSnapshot, LabelChangeLog, ContactLog } from '../data/types';
import type { MessageTemplate, MessageTemplateInput } from '../data/messageTemplates';
import { courseName } from './courseScope';

// Constants for backend URL
const API_BASE_URL = '/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Mock Auth logic for the frontend: We will allow the user to select their role/id 
// in the UI and store it in localStorage or state, then attach it to the header.
export function setAuthHeader(token: string) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Clear header
export function clearAuthHeader() {
  delete apiClient.defaults.headers.common['Authorization'];
}

// API Methods
export const api = {
  getMe: async () => {
    const response = await apiClient.get('/me');
    return response.data;
  },

  getClasses: async (period?: string): Promise<ClassSummary[]> => {
    const response = await apiClient.get('/classes', {
      params: period ? { period } : undefined,
    });
    // Map backend snake_case to frontend camelCase if needed,
    // though our backend serialized them. Wait, backend returns what DB has:
    // class_id, class_name, etc.
    // The frontend mockData expects camelCase. We must map it.
    return response.data.map(mapClassSummary);
  },

  // Auth endpoints
  login: async (credentials: { email: string; phone: string }) => {
    const res = await apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.phone
    });
    return res.data;
  },

  getClassTrend: async (classId: number) => {
    const response = await apiClient.get(`/classes/${classId}/trend`);
    return response.data;
  },

  getStudentsByClass: async (classId: number): Promise<StudentDetail[]> => {
    const response = await apiClient.get(`/students/by-class/${classId}`);
    return response.data.map(mapStudentDetail);
  },

  getSnapshots: async (khoiId: number): Promise<ClassSnapshot[]> => {
    const response = await apiClient.get('/snapshots', { params: { khoiId } });
    return response.data.map(mapSnapshot);
  },

  getLabelEvents: async (params?: { classId?: number; khoiId?: number }): Promise<LabelChangeLog[]> => {
    const response = await apiClient.get('/label-events', { params });
    return response.data.map(mapLabelChangeLog);
  },

  getContactLogs: async (params?: { classId?: number; khoiId?: number }): Promise<ContactLog[]> => {
    const response = await apiClient.get('/contact-logs', { params });
    return response.data.map(mapContactLog);
  },

  createContactLog: async (payload: { studentId: number; classId: number; trigger: string; checkpoint: string }) => {
    // Map frontend 'trigger' to backend 'triggerType' (DB column is 'trigger_type')
    const backendPayload = { ...payload, triggerType: payload.trigger, trigger: undefined };
    const response = await apiClient.post('/contact-logs', backendPayload);
    return mapContactLog(response.data);
  },

  undoContactLog: async (payload: { studentId: number; trigger: string; checkpoint: string }) => {
    const backendPayload = { ...payload, triggerType: payload.trigger, trigger: undefined };
    const response = await apiClient.post('/contact-logs/undo', backendPayload);
    return response.data;
  },

  getMessageTemplates: async (): Promise<MessageTemplate[]> => {
    const response = await apiClient.get('/message-templates');
    return response.data.map(mapMessageTemplate);
  },

  createMessageTemplate: async (input: MessageTemplateInput): Promise<MessageTemplate> => {
    const response = await apiClient.post('/message-templates', {
      name: input.name,
      triggerType: input.trigger,
      body: input.body,
    });
    return mapMessageTemplate(response.data);
  },

  updateMessageTemplate: async (templateId: number, input: Pick<MessageTemplateInput, 'name' | 'body'>): Promise<MessageTemplate> => {
    const response = await apiClient.patch(`/message-templates/${templateId}`, input);
    return mapMessageTemplate(response.data);
  },

  deleteMessageTemplate: async (templateId: number): Promise<void> => {
    await apiClient.delete(`/message-templates/${templateId}`);
  }
};

// ==========================================
// MAPPERS: Backend Snake_Case to Frontend CamelCase
// ==========================================

function mapMessageTemplate(data: any): MessageTemplate {
  return {
    templateId: Number(data.template_id),
    name: data.name,
    trigger: data.trigger_type,
    body: data.body,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

function mapClassSummary(data: any): ClassSummary {
  return {
    classId: data.class_id,
    className: data.class_name,
    courseId: data.course_id || 1,
    courseName: courseName(data.course_id || 1),
    teacher: {
      teacherId: data.teacher_id,
      fullName: data.teacher_name || 'GV', 
      email: '',
      phone: data.teacher_phone || 'N/A',
    },
    leadEmail: '',
    status: data.status,
    schedule: data.schedule || 'N/A',
    openingDate: '',
    endingDate: '',
    progress: {
      totalSessions: data.total_sessions || 28,
      completedSessions: data.completed_sessions || 0,
      percentage: data.progress_pct ? Number(data.progress_pct) : 0,
    },
    studentCounts: {
      totalEnrolled: (data.active_students || 0) + (data.on_hold_students || 0) + (data.dropped_students || 0),
      active: data.active_students || 0,
      onHold: data.on_hold_students || 0,
      dropped: data.dropped_students || 0,
      transferred: 0,
    },
    healthMetrics: {
      classRiskLevel: 'low',
      healthScore: data.health_score == null ? null : Number(data.health_score),
      isAlarmTriggered: false,
      attendanceAverage: data.attendance_avg == null ? null : Number(data.attendance_avg),
      homeworkAverage: data.homework_avg == null ? null : Number(data.homework_avg),
      passChuanRate: data.pass_chuan_rate == null ? null : Number(data.pass_chuan_rate),
      passMemRate: data.pass_mem_rate == null ? null : Number(data.pass_mem_rate),
    },
    labelDistribution: {
      yellow: data.label_yellow || 0,
      red: data.label_red || 0,
      grey: data.label_grey || 0,
      noData: data.label_no_data || 0,
      netMomentum: 0,
    },
    actionItems: { urgentCallsNeeded: 0, homeworkRemindersNeeded: 0, pendingPassReviews: 0 },
    portalUrl: '',
    lastSyncedAt: new Date().toISOString(),
  };
}

function mapStudentDetail(data: any): StudentDetail {
  return {
    studentId: data.student_id,
    fullName: data.full_name,
    phone: data.phone || 'N/A',
    email: '',
    classId: data.class_id || 0,
    className: data.class_name || '',
    registrationStatus: data.registration_status,
    recordDate: data.record_date ?? null,
    admittedAt: data.admitted_at,
    targetOutputStatus: 'Chưa đạt',
    attendance: {
      percentage: data.attendance_pct ? Number(data.attendance_pct) : 0,
      presentSessions: data.attendance_present ? Number(data.attendance_present) : 0,
      totalSessions: data.attendance_total ? Number(data.attendance_total) : 0,
      isDroppingRecently: false,
    },
    homework: {
      percentage: data.homework_pct ? Number(data.homework_pct) : 0,
      completedCount: data.homework_done ? Number(data.homework_done) : 0,
      totalCount: data.homework_total ? Number(data.homework_total) : 0,
      isDroppingRecently: false,
    },
    testPerformance: {
      testsTakenCount: data.tests_taken ? Number(data.tests_taken) : 0,
      averageScore: data.test_average ? Number(data.test_average) : null,
      lastScore: null,
      trendDirection: 'stable',
      scores: [
        { testOrder: 1, testName: 'Test 1', rawScore: null, makeupScore: null, finalScore: data.test_1 ? Number(data.test_1) : null, isMakeup: false },
        { testOrder: 2, testName: 'Test 2', rawScore: null, makeupScore: null, finalScore: data.test_2 ? Number(data.test_2) : null, isMakeup: false },
        { testOrder: 3, testName: 'Test 3', rawScore: null, makeupScore: null, finalScore: data.test_3 ? Number(data.test_3) : null, isMakeup: false },
        { testOrder: 4, testName: 'Test 4', rawScore: null, makeupScore: null, finalScore: data.test_4 ? Number(data.test_4) : null, isMakeup: false },
        { testOrder: 5, testName: 'Test 5', rawScore: null, makeupScore: null, finalScore: data.test_5 ? Number(data.test_5) : null, isMakeup: false },
        { testOrder: 6, testName: 'Test 6', rawScore: null, makeupScore: null, finalScore: data.test_6 ? Number(data.test_6) : null, isMakeup: false },
      ],
      isCheatingFlagged: false,
    },
    labeling: {
      currentLabel: data.current_label as any,
      previousLabel: data.current_label as any,
      benchmarkLabel: data.benchmark_label as any,
      hasChangedRecently: false,
      changeDirection: 'same',
      lastCheckpoint: data.last_checkpoint || '',
    },
    dataQuality: { status: 'complete', warnings: [] },
    evaluation: {
      riskScore: 0,
      suggestedAction: 'none',
      passChuanStatus: mapPassChuanStatus(data.pass_chuan_status),
      passChuanReasons: [],
      passMemStatus: data.pass_mem_status || '',
      passMemGroup: '',
      passMemLabel: '',
      isEligibleForReview: false,
      reviewStatus: '',
    },
    portalEvidence: {
      teacherFeedbackBtvn: '',
      teacherFeedbackOrientation: '',
      teacherNote: '',
    },
    updatedAt: new Date().toISOString(),
  };
}

function normalizeDateStr(dateStr: string): string {
  if (!dateStr) return '';
  const clean = String(dateStr).split('T')[0].trim();
  if (clean.includes('/') || (clean.includes('-') && clean.split('-')[0].length === 2)) {
    const parts = clean.split(/[/|-]/);
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  return clean;
}

function mapSnapshot(data: any): ClassSnapshot {
  const completedSessions = data.completed_sessions || 0;
  const testSessions = [4, 8, 12, 16, 20, 24];
  const testsCompleted = testSessions.filter(s => s <= completedSessions).length;

  return {
    snapshotId: String(data.snapshot_id ?? data.id ?? `${data.class_id}:${normalizeDateStr(data.snapshot_date)}`),
    classId: data.class_id,
    className: data.class_name,
    snapshotDate: normalizeDateStr(data.snapshot_date), // yyyy-mm-dd
    weekIndex: 0,
    progressPct: 0,
    completedSessions,
    totalSessions: 0,
    testsCompleted,
    activeStudents: data.active_students || 0,
    droppedStudents: data.dropped_students || 0,
    attendanceAvg: data.attendance_avg ? Number(data.attendance_avg) : 0,
    homeworkAvg: data.homework_avg ? Number(data.homework_avg) : 0,
    passChuanRate: data.pass_chuan_rate ? Number(data.pass_chuan_rate) : 0,
    passMemRate: data.pass_mem_rate ? Number(data.pass_mem_rate) : 0,
    riskPct: 0,
    labelCounts: {
      yellow: data.label_yellow || 0,
      red: data.label_red || 0,
      grey: data.label_grey || 0,
      noData: data.label_no_data || 0,
    },
    testCheckpoint: testsCompleted > 0 ? `Test ${testsCompleted}` : null,
  };
}

function mapLabelChangeLog(data: any): LabelChangeLog {
  return {
    logId: data.log_id,
    studentId: data.student_id,
    studentName: data.students?.full_name || 'N/A',
    classId: data.class_id,
    className: data.classes?.class_name || 'N/A',
    teacherId: 0,
    teacherName: '',
    fromLabel: data.from_label as any,
    toLabel: data.to_label as any,
    direction: data.direction as any,
    severity: data.severity as any,
    stepCount: 1,
    createdAt: data.created_at,
    reason: data.reason || '',
    checkpoint: data.checkpoint || 'N/A',
    testAverageAfter: data.test_average_after ? Number(data.test_average_after) : 0,
    attendancePct: data.attendance_pct ? Number(data.attendance_pct) : 0,
    homeworkPct: data.homework_pct ? Number(data.homework_pct) : 0,
    emailSent: false,
  };
}

function mapContactLog(data: any): ContactLog {
  return {
    contactId: data.contact_id
      ? String(data.contact_id)
      : `${data.student_id}:${data.trigger_type || data.trigger}:${data.checkpoint}:${data.created_at}`,
    studentId: data.student_id,
    classId: data.class_id,
    teacherId: data.teacher_id,
    channel: data.channel as any,
    trigger: (data.trigger_type || data.trigger) as any,
    checkpoint: data.checkpoint,
    note: data.note || '',
    createdAt: data.created_at,
  };
}

// Map DB enum codes to frontend Vietnamese display labels
function mapPassChuanStatus(dbValue: string | null): 'Có khả năng pass' | 'Chưa đạt điều kiện pass' | 'Chưa đủ DL' | 'Đạt tiêu chuẩn' {
  const map: Record<string, 'Có khả năng pass' | 'Chưa đạt điều kiện pass' | 'Chưa đủ DL' | 'Đạt tiêu chuẩn'> = {
    'no_data': 'Chưa đủ DL',
    'passed': 'Đạt tiêu chuẩn',
    'likely_pass': 'Có khả năng pass',
    'not_met': 'Chưa đạt điều kiện pass',
  };
  return map[dbValue || ''] || 'Chưa đạt điều kiện pass';
}
