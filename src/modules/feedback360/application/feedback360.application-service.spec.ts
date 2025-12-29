import { Test, TestingModule } from '@nestjs/testing';
import { Feedback360ApplicationService } from './feedback360.application-service';
import { FEEDBACK360_REPOSITORY } from '../domain/repositories/feedback360.repository.token';
import { CreateFeedback360UseCase } from './use-cases/create-feedback360.usecase';
import { UpdateFeedback360UseCase } from './use-cases/update-feedback360.usecase';

describe('Feedback360ApplicationService', () => {
  let service: Feedback360ApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Feedback360ApplicationService,
        {
          provide: FEEDBACK360_REPOSITORY,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByRateeId: jest.fn(),
            findByHrId: jest.fn(),
            findByPositionId: jest.fn(),
            findByCycleId: jest.fn(),
            findByReportId: jest.fn(),
            findByStage: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
          },
        },
        { provide: CreateFeedback360UseCase, useValue: { execute: jest.fn() } },
        { provide: UpdateFeedback360UseCase, useValue: { execute: jest.fn() } },
      ],
    }).compile();

    service = module.get<Feedback360ApplicationService>(Feedback360ApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});


