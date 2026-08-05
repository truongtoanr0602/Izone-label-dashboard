import { Test, TestingModule } from '@nestjs/testing';
import { ContactLogsController } from './contact-logs.controller';

describe('ContactLogsController', () => {
  let controller: ContactLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactLogsController],
    }).compile();

    controller = module.get<ContactLogsController>(ContactLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
