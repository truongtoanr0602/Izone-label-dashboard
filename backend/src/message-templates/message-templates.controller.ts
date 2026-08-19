import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.service';
import { MessageTemplatesService } from './message-templates.service';

@Controller('api/message-templates')
@UseGuards(AuthGuard)
export class MessageTemplatesController {
  constructor(private readonly templates: MessageTemplatesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query('triggerType') triggerType?: string) {
    return this.templates.list(user, triggerType);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() body: unknown) {
    return this.templates.create(user, body as { name: unknown; triggerType: unknown; body: unknown });
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() body: unknown) {
    return this.templates.update(user, this.parseId(id), body as { name?: unknown; body?: unknown });
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.templates.remove(user, this.parseId(id));
  }

  private parseId(id: string): number {
    const value = Number(id);
    if (!Number.isInteger(value) || value < 1) throw new BadRequestException('Template id không hợp lệ');
    return value;
  }
}
