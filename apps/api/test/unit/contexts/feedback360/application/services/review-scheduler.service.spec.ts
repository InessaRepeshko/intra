import { CycleStage, ReviewStage, SYSTEM_ACTOR } from '@intra/shared-kernel';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TRANSITION_REASONS } from 'src/contexts/feedback360/application/constants/review-stage-transitions';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { ReviewSchedulerService } from 'src/contexts/feedback360/application/services/review-scheduler.service';
import { ReviewService } from 'src/contexts/feedback360/application/services/review.service';
import { CycleDomain } from 'src/contexts/feedback360/domain/cycle.domain';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';

beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
});

afterEach(() => {
    jest.restoreAllMocks();
});

function buildCycle(
    overrides: Partial<Parameters<typeof CycleDomain.create>[0]> = {},
): CycleDomain {
    return CycleDomain.create({
        id: 1,
        title: 'Q1',
        hrId: 1,
        startDate: new Date('2025-01-01T00:00:00.000Z'),
        endDate: new Date('2025-12-31T00:00:00.000Z'),
        ...overrides,
    });
}

function buildReview(
    overrides: Partial<Parameters<typeof ReviewDomain.create>[0]> = {},
): ReviewDomain {
    return ReviewDomain.create({
        id: 100,
        rateeId: 1,
        rateeFullName: 'R',
        rateePositionId: 1,
        rateePositionTitle: 'Eng',
        hrId: 2,
        hrFullName: 'HR',
        cycleId: 1,
        ...overrides,
    });
}

describe('ReviewSchedulerService', () => {
    let service: ReviewSchedulerService;
    let cycleService: any;
    let reviewService: any;

    beforeEach(async () => {
        cycleService = {
            search: jest.fn(),
            forceFinish: jest.fn(),
        };
        reviewService = {
            search: jest.fn(),
            changeReviewStage: jest.fn(),
        };

        const module = await Test.createTestingModule({
            providers: [
                ReviewSchedulerService,
                { provide: ReviewService, useValue: reviewService },
                { provide: CycleService, useValue: cycleService },
            ],
        }).compile();

        service = module.get(ReviewSchedulerService);
    });

    describe('checkReviewDeadlines', () => {
        it('transitions IN_PROGRESS reviews to FINISHED when the cycle deadline has passed', async () => {
            const cycle = buildCycle({
                responseDeadline: new Date('2024-01-01T00:00:00.000Z'),
            });
            cycleService.search.mockResolvedValue([cycle]);
            reviewService.search.mockResolvedValue([
                buildReview({ id: 11 }),
                buildReview({ id: 22 }),
            ]);

            await service.checkReviewDeadlines();

            expect(cycleService.search).toHaveBeenCalledWith({
                isActive: true,
            });
            expect(reviewService.search).toHaveBeenCalledWith(
                {
                    cycleId: cycle.id,
                    stage: ReviewStage.IN_PROGRESS,
                },
                expect.anything(),
            );
            expect(reviewService.changeReviewStage).toHaveBeenCalledTimes(2);
            expect(reviewService.changeReviewStage).toHaveBeenNthCalledWith(
                1,
                11,
                ReviewStage.FINISHED,
                SYSTEM_ACTOR.ID,
                SYSTEM_ACTOR.NAME,
                TRANSITION_REASONS.DEADLINE_REACHED,
            );
        });

        it('skips cycles without a responseDeadline', async () => {
            cycleService.search.mockResolvedValue([
                buildCycle({ responseDeadline: null }),
            ]);
            await service.checkReviewDeadlines();
            expect(reviewService.search).not.toHaveBeenCalled();
        });

        it('does nothing when the deadline is in the future', async () => {
            cycleService.search.mockResolvedValue([
                buildCycle({
                    responseDeadline: new Date(
                        Date.now() + 24 * 60 * 60 * 1000,
                    ),
                }),
            ]);
            await service.checkReviewDeadlines();
            expect(reviewService.search).not.toHaveBeenCalled();
        });

        it('continues processing remaining reviews when one transition fails', async () => {
            cycleService.search.mockResolvedValue([
                buildCycle({
                    responseDeadline: new Date('2024-01-01T00:00:00.000Z'),
                }),
            ]);
            reviewService.search.mockResolvedValue([
                buildReview({ id: 11 }),
                buildReview({ id: 22 }),
            ]);
            reviewService.changeReviewStage
                .mockRejectedValueOnce(new Error('boom'))
                .mockResolvedValueOnce(undefined);

            await expect(
                service.checkReviewDeadlines(),
            ).resolves.toBeUndefined();
            expect(reviewService.changeReviewStage).toHaveBeenCalledTimes(2);
        });

        it('swallows errors from the cycle search and does not throw', async () => {
            cycleService.search.mockRejectedValue(new Error('boom'));
            await expect(
                service.checkReviewDeadlines(),
            ).resolves.toBeUndefined();
        });
    });

    describe('checkCycleDeadlines', () => {
        it('force-finishes cycles whose endDate has passed', async () => {
            const cycle = buildCycle({
                stage: CycleStage.ACTIVE,
                endDate: new Date('2024-01-01T00:00:00.000Z'),
            });
            cycleService.search.mockResolvedValue([cycle]);

            await service.checkCycleDeadlines();

            expect(cycleService.search).toHaveBeenCalledWith({
                stage: CycleStage.ACTIVE,
                isActive: true,
            });
            expect(cycleService.forceFinish).toHaveBeenCalledWith(cycle.id);
        });

        it('force-finishes cycles whose responseDeadline has passed even when endDate is in the future', async () => {
            const cycle = buildCycle({
                stage: CycleStage.ACTIVE,
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                responseDeadline: new Date('2024-01-01T00:00:00.000Z'),
            });
            cycleService.search.mockResolvedValue([cycle]);

            await service.checkCycleDeadlines();

            expect(cycleService.forceFinish).toHaveBeenCalledWith(cycle.id);
        });

        it('skips cycles where no deadline has passed yet', async () => {
            const cycle = buildCycle({
                stage: CycleStage.ACTIVE,
                endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
                responseDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
            });
            cycleService.search.mockResolvedValue([cycle]);

            await service.checkCycleDeadlines();

            expect(cycleService.forceFinish).not.toHaveBeenCalled();
        });

        it('continues processing remaining cycles when one fails to finish', async () => {
            const a = buildCycle({
                id: 1,
                endDate: new Date('2024-01-01T00:00:00.000Z'),
            });
            const b = buildCycle({
                id: 2,
                endDate: new Date('2024-01-01T00:00:00.000Z'),
            });
            cycleService.search.mockResolvedValue([a, b]);
            cycleService.forceFinish
                .mockRejectedValueOnce(new Error('boom'))
                .mockResolvedValueOnce(undefined);

            await expect(
                service.checkCycleDeadlines(),
            ).resolves.toBeUndefined();
            expect(cycleService.forceFinish).toHaveBeenCalledTimes(2);
        });

        it('swallows errors from the cycle search and does not throw', async () => {
            cycleService.search.mockRejectedValue(new Error('boom'));
            await expect(
                service.checkCycleDeadlines(),
            ).resolves.toBeUndefined();
        });
    });
});
