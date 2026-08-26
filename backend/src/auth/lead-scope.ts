import { ForbiddenException } from '@nestjs/common';
import type { AuthUser } from './auth.service';

export function resolveLeadKhoiId(
  user: AuthUser,
  requestedKhoiId?: number,
): number {
  if (user.role === 'teacher') {
    throw new ForbiddenException('Teacher accounts cannot access lead scope');
  }

  const fallbackKhoiId = user.defaultKhoiId ?? user.khoiId;
  const selectedKhoiId = requestedKhoiId ?? fallbackKhoiId;
  if (!selectedKhoiId) {
    throw new ForbiddenException('User is not assigned to a khoi');
  }

  if (user.role === 'lead' && !user.khoiIds.includes(selectedKhoiId)) {
    throw new ForbiddenException(
      `Lead does not have access to khoi ${selectedKhoiId}`,
    );
  }

  return selectedKhoiId;
}
