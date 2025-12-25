import { Test, TestingModule } from '@nestjs/testing';
import { Feedback360Controller } from './feedback360.controller';
import { Feedback360Service } from './feedback360.service';

describe('Feedback360Controller', () => {
  let controller: Feedback360Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Feedback360Controller],
      providers: [Feedback360Service],
    }).compile();

    controller = module.get<Feedback360Controller>(Feedback360Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
