import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/auth.service';
import { resolveLeadKhoiId } from '../auth/lead-scope';

@Injectable()
export class LabelChangesService {
  constructor(private prisma: PrismaService) {}

  async getRecentLabelChanges(user: AuthUser, classId?: number, khoiId?: number) {
    if (classId) {
      if (user.role === 'teacher' && !user.classIds.includes(classId)) {
        throw new ForbiddenException(`You do not have access to class ${classId}`);
      }
      const changes = await this.prisma.label_change_logs.findMany({
        where: {
          class_id: classId,
          ...(user.role === 'lead'
            ? { classes: { course_id: { in: user.khoiIds } } }
            : {}),
        },
        include: {
          students: { select: { full_name: true } },
          classes: { select: { class_name: true } },
        },
        orderBy: { created_at: 'desc' },
      });
      return this.serializeBigInt(changes);
    } 
    
    if (khoiId) {
      const queryKhoiId = user.role === 'lead'
        ? resolveLeadKhoiId(user, khoiId)
        : khoiId;
      const changes = await this.prisma.label_change_logs.findMany({
        where: {
          classes: { course_id: queryKhoiId }
        },
        include: {
          students: { select: { full_name: true } },
          classes: { select: { class_name: true } },
        },
        orderBy: { created_at: 'desc' },
      });
      return this.serializeBigInt(changes);
    }

    return [];
  }

  private serializeBigInt(data: any) {
    return JSON.parse(
      JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }
}
