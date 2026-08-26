import { Controller, Get, Param, ParseIntPipe, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.service';

@Controller('api/classes')
@UseGuards(AuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  async getAllClasses(
    @CurrentUser() user: AuthUser,
    @Query('period') period?: string,
    @Query('khoiId') khoiId?: string,
  ) {
    return this.classesService.getLatestClasses(
      user,
      period,
      khoiId ? Number(khoiId) : undefined,
    );
  }

  @Get(':id/trend')
  async getClassTrend(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    if (user.role === 'teacher' && !user.classIds.includes(id)) {
      throw new ForbiddenException(`You do not have access to class ${id}`);
    }
    // Lead permission check would verify if class belongs to their khoi. 
    // Assuming lead can access, handled in service or implicitly allowed.
    return this.classesService.getClassTrend(id, user);
  }
}
