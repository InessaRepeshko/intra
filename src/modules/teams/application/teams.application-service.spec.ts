import { Test, TestingModule } from '@nestjs/testing';
import { TeamsApplicationService } from './teams.application-service';
import { TeamsRepository } from '../domain/repositories/teams.repository';
import { TEAMS_REPOSITORY } from '../domain/repositories/teams.repository.token';
import { CreateTeamUseCase } from './use-cases/create-team.usecase';
import { UpdateTeamUseCase } from './use-cases/update-team.usecase';

describe('TeamsApplicationService', () => {
  let service: TeamsApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsApplicationService,
        {
          provide: TEAMS_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByHeadId: jest.fn(),
            findByMemberId: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
          } satisfies Partial<TeamsRepository>,
        },
        {
          provide: CreateTeamUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateTeamUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<TeamsApplicationService>(TeamsApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


