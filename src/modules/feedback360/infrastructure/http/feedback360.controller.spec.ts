import { Test, TestingModule } from '@nestjs/testing';
import { Feedback360Controller } from './feedback360.controller';
import { Feedback360ApplicationService } from '../../application/feedback360.application-service';

describe('Feedback360Controller', () => {
  let controller: Feedback360Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Feedback360Controller],
      providers: [
        {
          provide: Feedback360ApplicationService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByRateeId: jest.fn(),
            findByHrId: jest.fn(),
            findByPositionId: jest.fn(),
            findByCycleId: jest.fn(),
            findByReportId: jest.fn(),
            findByStage: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<Feedback360Controller>(Feedback360Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});


