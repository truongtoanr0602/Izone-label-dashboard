import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async getStudentsByClass(classId: number) {
    // Only return 'active' students as requested by the architectural decision
    const students = await this.prisma.$queryRaw`
      SELECT * FROM izone.v_student_latest 
      WHERE class_id = ${classId} 
        AND registration_status = 'active' 
      ORDER BY full_name ASC;
    `;
    return this.serializeBigInt(students);
  }

  async getStudentTimeline(studentId: number) {
    const timeline = await this.prisma.student_daily_records.findMany({
      where: { student_id: studentId },
      orderBy: { record_date: 'asc' },
    });
    return this.serializeBigInt(timeline);
  }

  private serializeBigInt(data: any) {
    return JSON.parse(
      JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }
}
