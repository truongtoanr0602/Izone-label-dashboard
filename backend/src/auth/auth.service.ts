import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

const KHOI_NAMES: Record<number, string> = {
  1: 'Khối 03',
  2: 'Khối 3-4',
  3: 'Khối 4-5',
};

export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
  role: 'teacher' | 'lead' | 'admin';
  teacherId?: number;
  khoiId?: number;
  khoiIds: number[];
  defaultKhoiId?: number;
  khoiScopes: Array<{ khoiId: number; name: string }>;
  classIds: number[];
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async login(email: string, phone: string) {
    const teacher = await this.prisma.teachers.findUnique({
      where: { teacher_email: email }
    });

    if (!teacher || teacher.teacher_phone !== phone) {
      throw new UnauthorizedException('Email hoặc Số điện thoại không chính xác');
    }

    const payload = { 
      sub: teacher.teacher_id, 
      email: teacher.teacher_email,
      role: teacher.role,
      name: teacher.teacher_name
    };

    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  async validateToken(token: string): Promise<AuthUser> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const teacherId = payload.sub;
      
      const teacher = await this.prisma.teachers.findUnique({
        where: { teacher_id: teacherId },
        include: {
          teacher_khoi_assignments: {
            include: { khoi: true },
            orderBy: [{ is_primary: 'desc' }, { khoi_id: 'asc' }],
          },
        },
      });
      
      if (!teacher) throw new UnauthorizedException('Không tìm thấy người dùng');

      // Fetch teacher's classes from DB
      const classes = await this.prisma.classes.findMany({
        where: { teacher_id: teacherId, status: 'on_going' },
        select: { class_id: true }
      });

      const assignments = [...(teacher.teacher_khoi_assignments ?? [])].sort(
        (left, right) =>
          Number(right.is_primary) - Number(left.is_primary) ||
          left.khoi_id - right.khoi_id,
      );
      const khoiScopes = assignments.length > 0
        ? assignments.map((assignment) => ({
            khoiId: assignment.khoi_id,
            name: assignment.khoi.khoi_name,
          }))
        : [{
            khoiId: teacher.khoi_id,
            name: KHOI_NAMES[teacher.khoi_id] ?? `Khối ${teacher.khoi_id}`,
          }];
      const primaryAssignment = assignments.find(
        (assignment) => assignment.is_primary,
      );
      const defaultKhoiId =
        primaryAssignment?.khoi_id ?? teacher.khoi_id ?? khoiScopes[0]?.khoiId;

      return {
        userId: teacher.role === 'lead' ? 'lead_1' : `teacher_${teacherId}`,
        email: teacher.teacher_email,
        displayName: teacher.teacher_name,
        role: teacher.role as any,
        teacherId: teacher.teacher_id,
        khoiId: defaultKhoiId,
        khoiIds: khoiScopes.map((scope) => scope.khoiId),
        defaultKhoiId,
        khoiScopes,
        classIds: classes.map(c => c.class_id)
      };
    } catch (e) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
