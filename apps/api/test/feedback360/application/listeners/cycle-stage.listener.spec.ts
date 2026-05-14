import { CycleStage } from '@intra/shared-kernel';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { CycleStageChangedEvent } from 'src/contexts/feedback360/application/events/cycle-stage-changed.event';
import { CycleStageListener } from 'src/contexts/feedback360/application/listeners/cycle-stage.listener';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { ClusterScoreAnalyticsService } from 'src/contexts/feedback360/application/services/cluster-score-analytics.service';

beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('CycleStageListener', () => {
    let listener: CycleStageListener;
    let analytics: any;
    let reviews: any;
    let eventEmitter: any;

    beforeEach(async () => {
        analytics = { generateAnalyticsForCycle: jest.fn() };
        reviews = { listByCycleId: jest.fn() };
        eventEmitter = { emit: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                CycleStageListener,
                {
                    provide: ClusterScoreAnalyticsService,
                    useValue: analytics,
                },
                { provide: REVIEW_REPOSITORY, useValue: reviews },
                { provide: EventEmitter2, useValue: eventEmitter },
            ],
        }).compile();

        listener = module.get(CycleStageListener);
    });

    describe('handleCycleStageChanged', () => {
        it('emits cycle.stage.processed without analytics when the new stage is not FINISHED', async () => {
            const event = new CycleStageChangedEvent(
                1,
                CycleStage.NEW,
                CycleStage.ACTIVE,
            );

            await listener.handleCycleStageChanged(event);

            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'cycle.stage.processed',
                expect.objectContaining({
                    cycleId: 1,
                    currentStage: CycleStage.ACTIVE,
                }),
            );
            expect(analytics.generateAnalyticsForCycle).not.toHaveBeenCalled();
        });

        it('does not run analytics when the cycle has no reviews', async () => {
            reviews.listByCycleId.mockResolvedValue([]);
            const event = new CycleStageChangedEvent(
                1,
                CycleStage.ACTIVE,
                CycleStage.FINISHED,
            );

            await listener.handleCycleStageChanged(event);

            expect(analytics.generateAnalyticsForCycle).not.toHaveBeenCalled();
            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'cycle.stage.processed',
                expect.objectContaining({ currentStage: CycleStage.FINISHED }),
            );
        });

        it('runs analytics generation and emits the processed event when FINISHED with reviews', async () => {
            reviews.listByCycleId.mockResolvedValue([{ id: 1 }]);
            analytics.generateAnalyticsForCycle.mockResolvedValue(undefined);
            const event = new CycleStageChangedEvent(
                1,
                CycleStage.ACTIVE,
                CycleStage.FINISHED,
            );

            await listener.handleCycleStageChanged(event);

            expect(analytics.generateAnalyticsForCycle).toHaveBeenCalledWith(1);
            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'cycle.stage.processed',
                expect.objectContaining({ currentStage: CycleStage.FINISHED }),
            );
        });

        it('still emits the processed event when analytics generation fails', async () => {
            reviews.listByCycleId.mockResolvedValue([{ id: 1 }]);
            analytics.generateAnalyticsForCycle.mockRejectedValue(
                new Error('boom'),
            );
            const event = new CycleStageChangedEvent(
                1,
                CycleStage.ACTIVE,
                CycleStage.FINISHED,
            );

            await listener.handleCycleStageChanged(event);

            expect(eventEmitter.emit).toHaveBeenCalledWith(
                'cycle.stage.processed',
                expect.objectContaining({ currentStage: CycleStage.FINISHED }),
            );
        });
    });
});
