import { ConflictException } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.service';
import { ContactLogsService } from './contact-logs.service';

const teacher: AuthUser = {
  sub: 'teacher-1002',
  role: 'teacher',
  email: 'teacher@izone.edu.vn',
  teacherId: 1002,
  classIds: [1237],
};

describe('ContactLogsService', () => {
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
