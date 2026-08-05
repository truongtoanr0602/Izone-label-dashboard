import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/auth.service';

@Injectable()
export class SnapshotsService {
  constructor(private prisma: PrismaService) {}

  async getSnapshots(khoiId: number, user: AuthUser) {
    // Only leads can fetch by khoiId, and they can only fetch their own khoi (or admins can fetch any).
    // For now, if role is lead, force their khoiId if they requested something else.
    const queryKhoiId = user.role === 'lead' ? user.khoiId : khoiId;
    
    if (!queryKhoiId) return [];

    const snapshots = await this.prisma.$queryRaw<any[]>`
      SELECT s.*, c.class_name
      FROM izone.class_daily_snapshots s
      JOIN izone.classes c ON s.class_id = c.class_id
      JOIN izone.teachers t ON c.teacher_id = t.teacher_id
      WHERE t.khoi_id = ${queryKhoiId}
      ORDER BY s.snapshot_date ASC;
    `;

    // Theo Rule thiết kế API: Nếu không có HV active, không được trả 0 mà phải trả null cho các chỉ số
    const processed = snapshots.map(snap => {
      if (Number(snap.active_students) === 0) {
        snap.attendance_avg = null;
        snap.homework_avg = null;
        snap.pass_chuan_rate = null;
        snap.pass_mem_rate = null;
      }
      return snap;
    });

    return this.serializeBigInt(processed);
  }

  private serializeBigInt(data: any) {
    return JSON.parse(
      JSON.stringify(data, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value,
      ),
    );
  }
}
