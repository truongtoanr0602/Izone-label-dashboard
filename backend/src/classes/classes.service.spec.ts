import type { AuthUser } from '../auth/auth.service';
import { ClassesService } from './classes.service';

describe('ClassesService', () => {
  const lead: AuthUser = {
    userId: 'lead_1',
    email: 'lead@example.com',
    displayName: 'Lead',
    role: 'lead',
    khoiId: 2,
    classIds: [],
  };

  it('limits the lead class selector to the course matching its khoi', async () => {
    const queryRaw = jest.fn().mockResolvedValue([]);
    const service = new ClassesService({ $queryRaw: queryRaw } as never);

    await service.getLatestClasses(lead, '2026-08');

    const [segments, ...values] = queryRaw.mock.calls[0];
    const sql = Array.from(segments as TemplateStringsArray).join('?');
    expect(sql).toContain('c.course_id = ?');
    expect(sql).toContain('period_snapshot.snapshot_date BETWEEN');
    expect(values).toEqual([
      2,
      2,
      new Date('2026-08-01T00:00:00.000Z'),
      new Date('2026-08-31T23:59:59.999Z'),
    ]);
  });

  it('selects course 3 for the Khối 4_5 lead', async () => {
    const queryRaw = jest.fn().mockResolvedValue([]);
    const service = new ClassesService({ $queryRaw: queryRaw } as never);

    await service.getLatestClasses({ ...lead, khoiId: 3 }, '2026-08');

    const [, ...values] = queryRaw.mock.calls[0];
    expect(values.slice(0, 2)).toEqual([3, 3]);
  });
});
