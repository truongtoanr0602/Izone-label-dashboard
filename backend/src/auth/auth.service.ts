import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

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
        where: { teacher_id: teacherId }
      });
      
      if (!teacher) throw new UnauthorizedException('Không tìm thấy người dùng');

      // Fetch teacher's classes from DB
      const classes = await this.prisma.classes.findMany({
        where: { teacher_id: teacherId, status: 'on_going' },
        select: { class_id: true }
      });

      return {
        userId: teacher.role === 'lead' ? 'lead_1' : `teacher_${teacherId}`,
        email: teacher.teacher_email,
        displayName: teacher.teacher_name,
        role: teacher.role as any,
        teacherId: teacher.teacher_id,
        khoiId: teacher.khoi_id,
        classIds: classes.map(c => c.class_id)
      };
    } catch (e) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
