import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../auth/auth.service';

const TRIGGERS = ['habit_reminder', 'red_followup', 'relearn_advice'] as const;
const SUPPORTED_PLACEHOLDERS = new Set([
  '{{ten}}',
  '{{lop}}',
  '{{giao_vien}}',
  '{{di_hoc}}',
  '{{btvn}}',
  '{{diem_tb}}',
]);
const PLACEHOLDER_PATTERN = /{{\s*[^{}]+\s*}}/g;

type TemplateTrigger = (typeof TRIGGERS)[number];

interface CreateTemplateInput {
  name: unknown;
  triggerType: unknown;
  body: unknown;
}

interface UpdateTemplateInput {
  name?: unknown;
  body?: unknown;
}

@Injectable()
export class MessageTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(user: AuthUser, triggerType?: string) {
    const teacherId = this.teacherId(user);
    const trigger = triggerType === undefined ? undefined : this.parseTrigger(triggerType);
    const templates = await this.prisma.message_templates.findMany({
      where: { teacher_id: teacherId, ...(trigger ? { trigger_type: trigger } : {}) },
      orderBy: [{ updated_at: 'desc' }, { template_id: 'desc' }],
    });
    return this.serializeBigInt(templates);
  }

  async create(user: AuthUser, input: CreateTemplateInput) {
    const teacherId = this.teacherId(user);
    const name = this.parseName(input.name);
    const trigger = this.parseTrigger(input.triggerType);
    const body = this.parseBody(input.body);
    const template = await this.prisma.message_templates.create({
      data: { teacher_id: teacherId, name, trigger_type: trigger, body },
    });
    return this.serializeBigInt(template);
  }

  async update(user: AuthUser, templateId: number, input: UpdateTemplateInput) {
    const teacherId = this.teacherId(user);
    await this.findOwned(templateId, teacherId);
    const data: { name?: string; body?: string } = {};
    if (input.name !== undefined) data.name = this.parseName(input.name);
    if (input.body !== undefined) data.body = this.parseBody(input.body);
    if (Object.keys(data).length === 0) throw new BadRequestException('Không có nội dung cần cập nhật');

    const template = await this.prisma.message_templates.update({
      where: { template_id: BigInt(templateId) },
      data,
    });
    return this.serializeBigInt(template);
  }

  async remove(user: AuthUser, templateId: number) {
    await this.findOwned(templateId, this.teacherId(user));
    await this.prisma.message_templates.delete({ where: { template_id: BigInt(templateId) } });
    return { success: true };
  }

  private async findOwned(templateId: number, teacherId: number) {
    const template = await this.prisma.message_templates.findFirst({
      where: { template_id: BigInt(templateId), teacher_id: teacherId },
      select: { template_id: true },
    });
    if (!template) throw new NotFoundException('Không tìm thấy template');
  }

  private teacherId(user: AuthUser): number {
    if (!user.teacherId) throw new NotFoundException('Không tìm thấy giáo viên');
    return user.teacherId;
  }

  private parseTrigger(value: unknown): TemplateTrigger {
    if (typeof value !== 'string' || !TRIGGERS.includes(value as TemplateTrigger)) {
      throw new BadRequestException('Nhóm template không hợp lệ');
    }
    return value as TemplateTrigger;
  }

  private parseName(value: unknown): string {
    if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > 100) {
      throw new BadRequestException('Tên template phải từ 1 đến 100 ký tự');
    }
    return value.trim();
  }

  private parseBody(value: unknown): string {
    if (typeof value !== 'string' || value.trim().length === 0 || value.length > 5000) {
      throw new BadRequestException('Nội dung template phải từ 1 đến 5000 ký tự');
    }
    const unsupported = [...new Set(value.match(PLACEHOLDER_PATTERN) ?? [])].filter(
      (token) => !SUPPORTED_PLACEHOLDERS.has(token),
    );
    if (unsupported.length > 0) {
      throw new BadRequestException(`Biến không được hỗ trợ: ${unsupported.join(', ')}`);
    }
    return value;
  }

  private serializeBigInt<T>(data: T): T {
    return JSON.parse(JSON.stringify(data, (_, value) => (typeof value === 'bigint' ? Number(value) : value)));
  }
}
