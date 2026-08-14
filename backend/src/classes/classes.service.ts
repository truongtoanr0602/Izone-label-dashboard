import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/auth.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async getLatestClasses(user: AuthUser) {
    let classes = [];
    if (user.role === 'lead' && user.khoiId) {
      classes = await this.prisma.$queryRaw`
        SELECT v.*, t.teacher_phone 
        FROM izone.v_class_latest v
        JOIN izone.classes c ON v.class_id = c.class_id
        JOIN izone.teachers t ON c.teacher_id = t.teacher_id
        WHERE t.khoi_id = ${user.khoiId}
        ORDER BY v.class_id DESC;
      `;
    } else if (user.role === 'teacher') {
      if (user.classIds.length === 0) return [];
      classes = await this.prisma.$queryRaw`
        SELECT v.*, t.teacher_phone
        FROM izone.v_class_latest v
        JOIN izone.classes c ON v.class_id = c.class_id
        JOIN izone.teachers t ON c.teacher_id = t.teacher_id
        WHERE v.class_id IN (${Prisma.join(user.classIds)})
        ORDER BY v.class_id DESC;
      `;
    }
    
    return this.serializeBigInt(classes);
  }

  async getClassTrend(classId: number, user: AuthUser) {
    // Basic RBAC check
    if (user.role === 'teacher' && !user.classIds.includes(classId)) {
      throw new Error('Forbidden'); // Handled by controller
    }

    const weekly = await this.prisma.$queryRaw`SELECT * FROM izone.v_weekly_trend WHERE class_id = ${classId} ORDER BY week_start ASC;`;
    const monthly = await this.prisma.$queryRaw`SELECT * FROM izone.v_monthly_trend WHERE class_id = ${classId} ORDER BY month_start ASC;`;
    
    return {
      weekly: this.serializeBigInt(weekly),
      monthly: this.serializeBigInt(monthly),
    };
  }

  private serializeBigInt(data: any) {
    return JSON.parse(
      JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }
}
