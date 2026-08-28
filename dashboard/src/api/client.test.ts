import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, apiClient } from './client';

describe('api.getClasses', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('maps the class-specific Portal URL from the selector response', async () => {
    const portalUrl = 'https://portal.izone.edu.vn/academic-affairs/course-classes/1159';
    vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: [{
        class_id: 1159,
        class_name: 'IC2174',
        course_id: 2,
        teacher_id: 305,
        teacher_name: 'GV A',
        teacher_phone: '0900000000',
        status: 'on_going',
        schedule: '3,6',
        total_sessions: 27,
        completed_sessions: 12,
        progress_pct: 44.4,
        active_students: 10,
        on_hold_students: 1,
        dropped_students: 0,
        attendance_avg: 90,
        homework_avg: 88,
        pass_chuan_rate: 70,
        pass_mem_rate: 10,
        label_yellow: 6,
        label_red: 3,
        label_grey: 1,
        label_no_data: 1,
        health_score: 88,
        portal_url: portalUrl,
      }],
    } as never);

    const [classSummary] = await api.getClasses('2026-08', 2);

    expect(classSummary.portalUrl).toBe(portalUrl);
  });
});
