import { Test, TestingModule } from '@nestjs/testing';
import { TeamsController } from '../../src/modules/identity/presentation/http/controllers/teams.controller';
import { TeamsService } from '../../src/modules/identity/application/teams.service';
import { TeamsRepository } from '../../src/modules/identity/infrastructure/prisma-repositories/teams.repository';

describe('TeamsController', () => {
  let controller: TeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        TeamsService,
        {
          provide: TeamsRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
