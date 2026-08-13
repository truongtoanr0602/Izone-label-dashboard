import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ContactLogsService } from './contact-logs.service';

describe('ContactLogsService', () => {
  let service: ContactLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactLogsService,
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    service = module.get<ContactLogsService>(ContactLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
