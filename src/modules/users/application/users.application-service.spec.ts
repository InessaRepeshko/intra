import { Test, TestingModule } from '@nestjs/testing';
import { UsersApplicationService } from './users.application-service';
import { UsersRepository } from '../domain/repositories/users.repository';
import { USERS_REPOSITORY } from '../domain/repositories/users.repository.token';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';

describe('UsersApplicationService', () => {
  let service: UsersApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersApplicationService,
        {
          provide: USERS_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
          } satisfies Partial<UsersRepository>,
        },
        {
          provide: CreateUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateUserUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UsersApplicationService>(UsersApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


