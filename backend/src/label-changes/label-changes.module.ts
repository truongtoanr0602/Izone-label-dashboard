import { Module } from '@nestjs/common';
import { LabelChangesController } from './label-changes.controller';
import { LabelChangesService } from './label-changes.service';

@Module({
  controllers: [LabelChangesController],
  providers: [LabelChangesService]
})
export class LabelChangesModule {}
