import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ContactLogsService } from './contact-logs.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.service';

@Controller('api/contact-logs')
@UseGuards(AuthGuard)
export class ContactLogsController {
  constructor(private readonly contactLogsService: ContactLogsService) {}

  @Get()
  async getContactLogs(
    @CurrentUser() user: AuthUser,
    @Query('classId') classId?: string,
    @Query('khoiId') khoiId?: string,
  ) {
    const cId = classId ? parseInt(classId, 10) : undefined;
    const kId = khoiId ? parseInt(khoiId, 10) : undefined;
    return this.contactLogsService.getContactLogs(user, cId, kId);
  }

  @Post()
  async createContactLog(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.contactLogsService.createContactLog(user, body);
  }

  @Post('undo')
  async undoContactLog(@CurrentUser() user: AuthUser, @Body() body: any) {
    return this.contactLogsService.undoContactLog(user, body);
  }
}
