import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
  role: 'teacher' | 'lead' | 'admin';
  teacherId?: number;
  khoiId?: number;
  classIds: number[];
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateToken(token: string): Promise<AuthUser> {
    // Mock token verification for local dev
    if (token === 'lead-token') {
      return {
        userId: 'lead_1',
        email: 'lead@izone.edu.vn',
        displayName: 'Trưởng Khối 34',
        role: 'lead',
        khoiId: 34,
        classIds: [], // Lead uses khoiId
      };
    }

    if (token.startsWith('teacher-')) {
      const teacherId = parseInt(token.replace('teacher-', ''), 10);
      if (isNaN(teacherId)) throw new UnauthorizedException('Invalid teacher token');
      
      // Fetch teacher's classes from DB
      const classes = await this.prisma.classes.findMany({
        where: { teacher_id: teacherId, status: 'on_going' },
        select: { class_id: true }
      });

      return {
        userId: `teacher_${teacherId}`,
        email: `teacher${teacherId}@izone.edu.vn`,
        displayName: `Giáo viên ${teacherId}`,
        role: 'teacher',
        teacherId: teacherId,
        classIds: classes.map(c => c.class_id)
      };
    }

    throw new UnauthorizedException('Invalid or expired token');
  }
}
