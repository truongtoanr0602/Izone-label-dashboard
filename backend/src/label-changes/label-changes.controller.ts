import { Controller, Get, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LabelChangesService } from './label-changes.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.service';

@Controller('api/label-events')
@UseGuards(AuthGuard)
export class LabelChangesController {
  constructor(private readonly labelChangesService: LabelChangesService) {}

  @Get()
  async getLabelEvents(
    @CurrentUser() user: AuthUser,
    @Query('classId') classId?: string,
    @Query('khoiId') khoiId?: string,
  ) {
    const cId = classId ? parseInt(classId, 10) : undefined;
    const kId = khoiId ? parseInt(khoiId, 10) : undefined;
    return this.labelChangesService.getRecentLabelChanges(user, cId, kId);
  }
}
