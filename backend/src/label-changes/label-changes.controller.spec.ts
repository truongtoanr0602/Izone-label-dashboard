import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/auth.guard';
import { LabelChangesController } from './label-changes.controller';
import { LabelChangesService } from './label-changes.service';

describe('LabelChangesController', () => {
  let controller: LabelChangesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabelChangesController],
      providers: [{ provide: LabelChangesService, useValue: {} }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<LabelChangesController>(LabelChangesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
