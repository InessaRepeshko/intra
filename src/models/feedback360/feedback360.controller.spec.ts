import { Test, TestingModule } from '@nestjs/testing';
import { Feedback360Controller } from './feedback360.controller';
import { Feedback360Service } from './feedback360.service';
import { Feedback360Repository } from './feedback360.repository';

describe('Feedback360Controller', () => {
  let controller: Feedback360Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Feedback360Controller],
      providers: [
        Feedback360Service,
        {
          provide: Feedback360Repository,
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
      ],
    }).compile();

    controller = module.get<Feedback360Controller>(Feedback360Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
