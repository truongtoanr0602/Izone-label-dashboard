import type { AuthUser } from '../auth/auth.service';
import { ClassesService } from './classes.service';
import { ForbiddenException } from '@nestjs/common';

describe('ClassesService', () => {
  const lead: AuthUser = {
    userId: 'lead_1',
    email: 'lead@example.com',
    displayName: 'Lead',
    role: 'lead',
    khoiId: 2,
    khoiIds: [2, 3],
    defaultKhoiId: 2,
    khoiScopes: [
      { khoiId: 2, name: 'Khối 3-4' },
      { khoiId: 3, name: 'Khối 4-5' },
    ],
    classIds: [],
  };

  it('limits the lead class selector to the course matching its khoi', async () => {
    const queryRaw = jest.fn().mockResolvedValue([]);
    const service = new ClassesService({ $queryRaw: queryRaw } as never);

    await service.getLatestClasses(lead, '2026-08', 2);

    const [segments, ...values] = queryRaw.mock.calls[0];
    const sql = Array.from(segments as TemplateStringsArray).join('?');
    expect(sql).toContain('c.course_id = ?');
    expect(sql).not.toContain('t.khoi_id = ?');
    expect(sql).toContain('period_snapshot.snapshot_date BETWEEN');
    expect(values).toEqual([
      2,
      new Date('2026-08-01T00:00:00.000Z'),
      new Date('2026-08-31T23:59:59.999Z'),
    ]);
  });

  it('selects course 3 for the Khối 4_5 lead', async () => {
    const queryRaw = jest.fn().mockResolvedValue([]);
    const service = new ClassesService({ $queryRaw: queryRaw } as never);

    await service.getLatestClasses(lead, '2026-08', 3);

    const [, ...values] = queryRaw.mock.calls[0];
    expect(values[0]).toBe(3);
  });

  it('rejects a course outside the lead assignments', async () => {
    const service = new ClassesService({ $queryRaw: jest.fn() } as never);

    await expect(service.getLatestClasses(lead, '2026-08', 1)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
