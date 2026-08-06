import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/auth.service';

@Injectable()
export class ContactLogsService {
  constructor(private prisma: PrismaService) {}

  async getContactLogs(user: AuthUser, classId?: number, khoiId?: number) {
    if (user.role === 'teacher') {
      if (!classId || !user.classIds.includes(classId)) return [];
      
      const logs = await this.prisma.contact_logs.findMany({
        where: { class_id: classId },
        orderBy: { created_at: 'desc' },
      });
      return this.serializeBigInt(logs);
    }

    if (user.role === 'lead') {
      const qKhoiId = khoiId || user.khoiId;
      if (!qKhoiId) return [];
      const logs = await this.prisma.contact_logs.findMany({
        where: { classes: { teachers: { khoi_id: qKhoiId } } },
        orderBy: { created_at: 'desc' },
      });
      return this.serializeBigInt(logs);
    }

    return [];
  }

  async createContactLog(user: AuthUser, data: { studentId: number, classId: number, triggerType: string, checkpoint: string }) {
    if (user.role === 'teacher' && !user.classIds.includes(data.classId)) {
      throw new ConflictException('You do not have permission for this class');
    }

    try {
      const newLog = await this.prisma.contact_logs.create({
        data: {
          student_id: data.studentId,
          class_id: data.classId,
          teacher_id: user.teacherId || 1,
          channel: 'zalo',
          trigger_type: data.triggerType,
          checkpoint: data.checkpoint,
        }
      });
      return this.serializeBigInt(newLog);
    } catch (error: any) {
      // Prisma Unique Constraint violation
      if (error.code === 'P2002') {
        throw new ConflictException('Checkpoint already exists for this trigger');
      }
      throw error;
    }
  }

  async undoContactLog(user: AuthUser, data: { studentId: number, triggerType: string, checkpoint: string }) {
    const log = await this.prisma.contact_logs.findFirst({
      where: {
        student_id: data.studentId,
        trigger_type: data.triggerType,
        checkpoint: data.checkpoint,
      }
    });

    if (!log) {
      throw new NotFoundException('Log not found');
    }

    if (user.role === 'teacher' && log.teacher_id !== user.teacherId) {
      throw new ConflictException('Permission denied');
    }

    await this.prisma.contact_logs.delete({
      where: { contact_id: log.contact_id }
    });

    return { success: true };
  }

  private serializeBigInt(data: any) {
    return JSON.parse(
      JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }
}
