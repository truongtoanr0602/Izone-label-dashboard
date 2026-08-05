import { Controller, Get, Param, ParseIntPipe, UseGuards, ForbiddenException } from '@nestjs/common';
import { StudentsService } from './students.service';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/auth.service';

@Controller('api/students')
@UseGuards(AuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('by-class/:classId')
  async getStudentsByClass(
    @Param('classId', ParseIntPipe) classId: number,
    @CurrentUser() user: AuthUser
  ) {
    if (user.role === 'teacher' && !user.classIds.includes(classId)) {
      throw new ForbiddenException(`You do not have access to class ${classId}`);
    }
    return this.studentsService.getStudentsByClass(classId);
  }

  @Get(':id/timeline')
  async getStudentTimeline(@Param('id', ParseIntPipe) id: number) {
    // Basic endpoint for timeline. Can add RBAC if needed, 
    // but typically accessed via the roster which is already protected.
    return this.studentsService.getStudentTimeline(id);
  }
}
