import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/auth.guard';
import { ContactLogsController } from './contact-logs.controller';
import { ContactLogsService } from './contact-logs.service';

describe('ContactLogsController', () => {
  let controller: ContactLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactLogsController],
      providers: [{ provide: ContactLogsService, useValue: {} }],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<ContactLogsController>(ContactLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
