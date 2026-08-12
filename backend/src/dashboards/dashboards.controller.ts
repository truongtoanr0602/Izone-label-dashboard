import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.service';
import type { LeadDashboardQuery } from './dashboard.types';
import { DashboardsService } from './dashboards.service';

@Controller('api/v1')
@UseGuards(AuthGuard)
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('lead-dashboard')
  getLeadDashboard(
    @Query() query: LeadDashboardQuery,
    @CurrentUser() user: AuthUser,
  ) {
    return this.dashboardsService.getLeadDashboard(query, user);
  }

  @Get('classes/:classId/teacher-dashboard')
  getTeacherDashboard(
    @Param('classId', ParseIntPipe) classId: number,
    @Query('asOf') asOf: string | undefined,
    @CurrentUser() user: AuthUser,
  ) {
    return this.dashboardsService.getTeacherDashboard(classId, asOf, user);
  }
}
