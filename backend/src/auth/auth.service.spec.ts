import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const findTeacher = jest.fn();
  const findClasses = jest.fn();
  const verifyAsync = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            teachers: { findUnique: findTeacher },
            classes: { findMany: findClasses },
          },
        },
        { provide: JwtService, useValue: { verifyAsync } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    verifyAsync.mockResolvedValue({ sub: 7 });
    findClasses.mockResolvedValue([]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns all assigned khoi scopes with the primary scope as default', async () => {
    findTeacher.mockResolvedValue({
      teacher_id: 7,
      teacher_email: 'lead@example.com',
      teacher_name: 'Lead',
      role: 'lead',
      khoi_id: 2,
      teacher_khoi_assignments: [
        { khoi_id: 3, is_primary: false, khoi: { khoi_name: 'Khối 4-5' } },
        { khoi_id: 2, is_primary: true, khoi: { khoi_name: 'Khối 3-4' } },
      ],
    });

    await expect(service.validateToken('token')).resolves.toMatchObject({
      khoiId: 2,
      khoiIds: [2, 3],
      defaultKhoiId: 2,
      khoiScopes: [
        { khoiId: 2, name: 'Khối 3-4' },
        { khoiId: 3, name: 'Khối 4-5' },
      ],
    });
  });

  it('falls back to the legacy teacher khoi when assignments are empty', async () => {
    findTeacher.mockResolvedValue({
      teacher_id: 7,
      teacher_email: 'lead@example.com',
      teacher_name: 'Lead',
      role: 'lead',
      khoi_id: 2,
      teacher_khoi_assignments: [],
    });

    await expect(service.validateToken('token')).resolves.toMatchObject({
      khoiIds: [2],
      defaultKhoiId: 2,
      khoiScopes: [{ khoiId: 2, name: 'Khối 3-4' }],
    });
  });
});
