import { Controller, Get, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.service';

@Controller('api/snapshots')
@UseGuards(AuthGuard)
export class SnapshotsController {
  constructor(private readonly snapshotsService: SnapshotsService) {}

  @Get()
  async getSnapshots(
    @Query('khoiId', ParseIntPipe) khoiId: number,
    @CurrentUser() user: AuthUser
  ) {
    return this.snapshotsService.getSnapshots(khoiId, user);
  }
}
