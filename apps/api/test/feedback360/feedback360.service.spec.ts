import { Test, TestingModule } from '@nestjs/testing';
import { Feedback360Service } from '../../src/modules/feedback360/application/feedback360.service';
import { Feedback360Repository } from '../../src/modules/feedback360/infrastructure/prisma-repositories/feedback360.repository';

describe('Feedback360Service', () => {
    let service: Feedback360Service;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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

        service = module.get<Feedback360Service>(Feedback360Service);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
