import { Test, TestingModule } from '@nestjs/testing';
import { LabelChangesController } from './label-changes.controller';

describe('LabelChangesController', () => {
  let controller: LabelChangesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabelChangesController],
    }).compile();

    controller = module.get<LabelChangesController>(LabelChangesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
