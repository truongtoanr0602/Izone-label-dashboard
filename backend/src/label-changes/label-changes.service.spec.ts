import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { LabelChangesService } from './label-changes.service';
import type { AuthUser } from '../auth/auth.service';

describe('LabelChangesService', () => {
  let service: LabelChangesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LabelChangesService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<LabelChangesService>(LabelChangesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('limits a lead class lookup to assigned khoi scopes', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const scopedService = new LabelChangesService({
      label_change_logs: { findMany },
    } as never);
    const lead: AuthUser = {
      userId: 'lead_1',
      email: 'lead@example.com',
      displayName: 'Lead',
      role: 'lead',
      teacherId: 1,
      khoiId: 2,
      khoiIds: [2, 3],
      defaultKhoiId: 2,
      khoiScopes: [],
      classIds: [],
    };

    await scopedService.getRecentLabelChanges(lead, 1237);

    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        class_id: 1237,
        classes: { course_id: { in: [2, 3] } },
      },
    }));
  });
});
