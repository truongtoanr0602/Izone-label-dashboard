import { apiClient } from './client';
import type { ClassSummary, StudentDetail } from '../data/types';
import type {
  LeadDashboardFilters,
  LeadDashboardResponse,
  TeacherDashboardResponse,
} from './dashboardContracts';

// ==========================================
// API CONTRACT INTERFACES (Khối 34 Dashboard)
// ==========================================

export interface KpiMetric {
  value: number;
  delta: number; // Chênh lệch so với kỳ/tuần trước (+/-)
  status: 'improving' | 'declining' | 'stable';
}

export interface Khoi34DashboardSummary {
  khoiId: number;
  khoiName: string;
  scrapedAt: string;
  aggregate: {
    totalClasses: number;
    activeStudents: number;
    droppedStudents: number; // Đã bao gồm học viên queuing thuộc lớp on_going/completed
    queuingStudents: number; // Học viên queuing thuộc lớp pending
    attendanceAvg: KpiMetric;
    homeworkAvg: KpiMetric;
    passChuanRate: KpiMetric;
    passMemRate: KpiMetric;
    riskPct: KpiMetric;
    netMomentum: number; // Chỉ số chuyển dịch nhãn (Nhãn tăng - Nhãn giảm)
  };
  trendChart: Array<{
    date: string;
    attendanceAvg: number | null;
    homeworkAvg: number | null;
    passChuanRate: number | null;
    passMemRate: number | null;
    riskPct: number | null;
  }>;
  classes: ClassSummary[];
}

// ==========================================
// DASHBOARD SERVICE LAYER
// ==========================================

export const dashboardService = {
  getLeadDashboard: async (filters: LeadDashboardFilters): Promise<LeadDashboardResponse> => {
    const response = await apiClient.get<LeadDashboardResponse>('/v1/lead-dashboard', {
      params: { courseId: 2, ...filters },
    });
    return response.data;
  },

  getTeacherDashboard: async (
    classId: number,
    asOf?: string,
  ): Promise<TeacherDashboardResponse> => {
    const response = await apiClient.get<TeacherDashboardResponse>(
      `/v1/classes/${classId}/teacher-dashboard`,
      { params: asOf ? { asOf } : undefined },
    );
    return response.data;
  },

  /**
   * Lấy tổng quan Dashboard Khối 34 (course_id = 2)
   */
  getKhoi34Dashboard: async (): Promise<Khoi34DashboardSummary> => {
    const response = await apiClient.get<Khoi34DashboardSummary>('/snapshots/dashboard', {
      params: { courseId: 2, khoiId: 34 },
    });
    return response.data;
  },

  /**
   * Lấy danh sách học viên của lớp (đã áp dụng business rule queuing -> dropped)
   */
  getStudentsByClass: async (classId: number): Promise<StudentDetail[]> => {
    const response = await apiClient.get<StudentDetail[]>(`/students/by-class/${classId}`);
    return response.data;
  },

  /**
   * Lấy dữ liệu xu hướng theo tuần/tháng của 1 lớp
   */
  getClassTrend: async (classId: number) => {
    const response = await apiClient.get(`/classes/${classId}/trend`);
    return response.data;
  },
};
