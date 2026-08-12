import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClassesModule } from './classes/classes.module';
import { StudentsModule } from './students/students.module';
import { LabelChangesModule } from './label-changes/label-changes.module';
import { AuthModule } from './auth/auth.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { ContactLogsModule } from './contact-logs/contact-logs.module';
import { DashboardsModule } from './dashboards/dashboards.module';

@Module({
  imports: [PrismaModule, ClassesModule, StudentsModule, LabelChangesModule, AuthModule, SnapshotsModule, ContactLogsModule, DashboardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
