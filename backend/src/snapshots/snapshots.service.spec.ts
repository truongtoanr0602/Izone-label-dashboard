import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SnapshotsService } from './snapshots.service';
import type { AuthUser } from '../auth/auth.service';

describe('SnapshotsService', () => {
  let service: SnapshotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SnapshotsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<SnapshotsService>(SnapshotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('queries an assigned secondary khoi selected by the lead', async () => {
    const queryRaw = jest.fn().mockResolvedValue([]);
    const scopedService = new SnapshotsService({ $queryRaw: queryRaw } as never);
    const lead: AuthUser = {
      userId: 'lead_1',
      email: 'lead@example.com',
      displayName: 'Lead',
      role: 'lead',
      khoiId: 2,
      khoiIds: [2, 3],
      defaultKhoiId: 2,
      khoiScopes: [],
      classIds: [],
    };

    await scopedService.getSnapshots(3, lead);

    const [segments, selectedKhoiId] = queryRaw.mock.calls[0];
    expect(Array.from(segments as TemplateStringsArray).join('?')).toContain(
      'c.course_id = ?',
    );
    expect(selectedKhoiId).toBe(3);
  });
});
