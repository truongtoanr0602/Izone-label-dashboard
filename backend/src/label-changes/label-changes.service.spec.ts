import { Test, TestingModule } from '@nestjs/testing';
import { LabelChangesService } from './label-changes.service';

describe('LabelChangesService', () => {
  let service: LabelChangesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LabelChangesService],
    }).compile();

    service = module.get<LabelChangesService>(LabelChangesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
