import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { AuthUser } from '../auth/auth.service';
import { MessageTemplatesService } from './message-templates.service';

const teacher: AuthUser = {
  userId: 'teacher_1002',
  role: 'teacher',
  email: 'teacher@izone.edu.vn',
  displayName: 'Ngọc Anh',
  teacherId: 1002,
  khoiIds: [],
  khoiScopes: [],
  classIds: [1237],
};

describe('MessageTemplatesService', () => {
  it('lists templates scoped to the signed-in teacher and trigger', async () => {
    const prisma = {
      message_templates: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const service = new MessageTemplatesService(prisma as never);

    await expect(service.list(teacher, 'habit_reminder')).resolves.toEqual([]);
    expect(prisma.message_templates.findMany).toHaveBeenCalledWith({
      where: { teacher_id: 1002, trigger_type: 'habit_reminder' },
      orderBy: [{ updated_at: 'desc' }, { template_id: 'desc' }],
    });
  });

  it('creates a template under the signed-in teacher rather than a client-supplied owner', async () => {
    const prisma = {
      message_templates: { create: jest.fn().mockResolvedValue({ template_id: 1n }) },
    };
    const service = new MessageTemplatesService(prisma as never);

    await service.create(teacher, {
      name: 'Nhắc BTVN nhẹ nhàng',
      triggerType: 'habit_reminder',
      body: 'Chào {{ten}}, BTVN của em là {{btvn}}.',
    });

    expect(prisma.message_templates.create).toHaveBeenCalledWith({
      data: {
        teacher_id: 1002,
        name: 'Nhắc BTVN nhẹ nhàng',
        trigger_type: 'habit_reminder',
        body: 'Chào {{ten}}, BTVN của em là {{btvn}}.',
      },
    });
  });

  it('rejects an unsupported placeholder before persisting a template', async () => {
    const prisma = { message_templates: { create: jest.fn() } };
    const service = new MessageTemplatesService(prisma as never);

    await expect(
      service.create(teacher, {
        name: 'Sai biến',
        triggerType: 'habit_reminder',
        body: 'Chào {{ten}}, điểm {{khong_ton_tai}}.',
      }),
    ).rejects.toThrow(BadRequestException);
    expect(prisma.message_templates.create).not.toHaveBeenCalled();
  });

  it('does not update a template owned by another teacher', async () => {
    const prisma = {
      message_templates: {
        findFirst: jest.fn().mockResolvedValue(null),
        update: jest.fn(),
      },
    };
    const service = new MessageTemplatesService(prisma as never);

    await expect(
      service.update(teacher, 9, { name: 'Tên mới' }),
    ).rejects.toThrow(NotFoundException);
    expect(prisma.message_templates.update).not.toHaveBeenCalled();
  });
});
