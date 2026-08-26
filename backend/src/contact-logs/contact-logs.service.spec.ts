import { ConflictException } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.service';
import { ContactLogsService } from './contact-logs.service';

const teacher: AuthUser = {
  userId: 'teacher-1002',
  email: 'teacher@izone.edu.vn',
  displayName: 'Teacher 1002',
  role: 'teacher',
  teacherId: 1002,
  khoiIds: [],
  khoiScopes: [],
  classIds: [1237],
};

const lead: AuthUser = {
  ...teacher,
  userId: 'lead_1',
  role: 'lead',
  khoiId: 2,
  khoiIds: [2, 3],
  defaultKhoiId: 2,
  khoiScopes: [
    { khoiId: 2, name: 'Khối 3-4' },
    { khoiId: 3, name: 'Khối 4-5' },
  ],
  classIds: [],
};

describe('ContactLogsService', () => {
  it('limits a lead class lookup to classes in any assigned khoi', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const service = new ContactLogsService({
      contact_logs: { findMany },
    } as never);

    await service.getContactLogs(lead, 1237);

    expect(findMany).toHaveBeenCalledWith({
      where: {
        class_id: 1237,
        classes: { course_id: { in: [2, 3] } },
      },
      orderBy: { created_at: 'desc' },
    });
  });

  it('rejects a contact log for a student outside the selected class', async () => {
    const prisma = {
      students: { findFirst: jest.fn().mockResolvedValue(null) },
      contact_logs: { create: jest.fn() },
    };
    const service = new ContactLogsService(prisma as never);

    await expect(
      service.createContactLog(teacher, {
        studentId: 18848,
        classId: 1237,
        triggerType: 'habit_reminder',
        checkpoint: 'Test 1',
      }),
    ).rejects.toThrow(ConflictException);
    expect(prisma.contact_logs.create).not.toHaveBeenCalled();
  });

  it('creates the log only after current class membership is confirmed', async () => {
    const prisma = {
      students: {
        findFirst: jest.fn().mockResolvedValue({ student_id: 18848 }),
      },
      contact_logs: {
        create: jest.fn().mockResolvedValue({ contact_id: 1n }),
      },
    };
    const service = new ContactLogsService(prisma as never);

    await expect(
      service.createContactLog(teacher, {
        studentId: 18848,
        classId: 1237,
        triggerType: 'habit_reminder',
        checkpoint: 'Test 1',
      }),
    ).resolves.toEqual({ contact_id: 1 });
    expect(prisma.students.findFirst).toHaveBeenCalledWith({
      where: { student_id: 18848, class_id: 1237 },
      select: { student_id: true },
    });
  });
});
