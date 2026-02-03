<<<<<<< HEAD
import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from '../../src/modules/identity/application/teams.service';
import { TeamsRepository } from '../../src/modules/identity/infrastructure/prisma-repositories/teams.repository';

describe('TeamsService', () => {
    let service: TeamsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<TeamsService>(TeamsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
=======
import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from '../../src/modules/identity/application/teams.service';
import { TeamsRepository } from '../../src/modules/identity/infrastructure/prisma-repositories/teams.repository';

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
>>>>>>> origin/main
