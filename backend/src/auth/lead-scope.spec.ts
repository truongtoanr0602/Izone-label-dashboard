import { ForbiddenException } from '@nestjs/common';
import type { AuthUser } from './auth.service';
import { resolveLeadKhoiId } from './lead-scope';

const lead: AuthUser = {
  userId: 'lead_1',
  email: 'lead@example.com',
  displayName: 'Lead',
  role: 'lead',
  teacherId: 1,
  khoiId: 2,
  khoiIds: [2, 3],
  defaultKhoiId: 2,
  khoiScopes: [
    { khoiId: 2, name: 'Khối 3-4' },
    { khoiId: 3, name: 'Khối 4-5' },
  ],
  classIds: [],
};

describe('resolveLeadKhoiId', () => {
  it('accepts a requested khoi assigned to the lead', () => {
    expect(resolveLeadKhoiId(lead, 3)).toBe(3);
  });

  it('uses the lead default when the request omits khoi', () => {
    expect(resolveLeadKhoiId(lead)).toBe(2);
  });

  it('rejects a khoi outside the lead assignments', () => {
    expect(() => resolveLeadKhoiId(lead, 1)).toThrow(ForbiddenException);
  });
});
