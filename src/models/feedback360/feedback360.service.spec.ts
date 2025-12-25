import { Test, TestingModule } from '@nestjs/testing';
import { Feedback360Service } from './feedback360.service';

describe('Feedback360Service', () => {
  let service: Feedback360Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Feedback360Service],
    }).compile();

    service = module.get<Feedback360Service>(Feedback360Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
