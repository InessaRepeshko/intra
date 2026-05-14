import { ReviewStage } from '@intra/shared-kernel';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { ReviewStageChangedEvent } from 'src/contexts/feedback360/application/events/review-stage-changed.event';
import { ReviewStageListener } from 'src/contexts/feedback360/application/listeners/review-stage.listener';
import { REVIEW_REPOSITORY } from 'src/contexts/feedback360/application/ports/review.repository.port';
import { CycleService } from 'src/contexts/feedback360/application/services/cycle.service';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';

beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'warn').mockImplementation();
});

afterEach(() => {
    jest.restoreAllMocks();
});

function buildReview(
    overrides: Partial<Parameters<typeof ReviewDomain.create>[0]> = {},
): ReviewDomain {
    return ReviewDomain.create({
        id: 1,
        rateeId: 1,
        rateeFullName: 'R',
        rateePositionId: 1,
        rateePositionTitle: 'Eng',
        hrId: 2,
        hrFullName: 'HR',
        cycleId: 50,
        ...overrides,
    });
}

describe('ReviewStageListener', () => {
    let listener: ReviewStageListener;
    let cycles: any;
    let reviews: any;
    let eventEmitter: any;

    beforeEach(async () => {
        cycles = { completeCycle: jest.fn() };
        reviews = { findById: jest.fn(), listByCycleId: jest.fn() };
        eventEmitter = { emit: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                ReviewStageListener,
                { provide: CycleService, useValue: cycles },
                { provide: REVIEW_REPOSITORY, useValue: reviews },
                { provide: EventEmitter2, useValue: eventEmitter },
            ],
        }).compile();

        listener = module.get(ReviewStageListener);
    });

    it('still emits review.stage.processed when the new stage is not FINISHED', async () => {
        const event = new ReviewStageChangedEvent(
            1,
            ReviewStage.NEW,
            ReviewStage.SELF_ASSESSMENT,
        );

        await listener.handleReviewStageChanged(event);

        expect(reviews.findById).not.toHaveBeenCalled();
        expect(eventEmitter.emit).toHaveBeenCalledWith(
            'review.stage.processed',
            expect.objectContaining({
                currentStage: ReviewStage.SELF_ASSESSMENT,
            }),
        );
    });

    it('warns and emits processed when the review is missing', async () => {
        reviews.findById.mockResolvedValue(null);

        const event = new ReviewStageChangedEvent(
            1,
            ReviewStage.IN_PROGRESS,
            ReviewStage.FINISHED,
        );

        await listener.handleReviewStageChanged(event);

        expect(cycles.completeCycle).not.toHaveBeenCalled();
        expect(eventEmitter.emit).toHaveBeenCalledWith(
            'review.stage.processed',
            expect.objectContaining({ currentStage: ReviewStage.FINISHED }),
        );
    });

    it('skips cycle completion when the review has no cycle attached', async () => {
        reviews.findById.mockResolvedValue(buildReview({ cycleId: null }));

        const event = new ReviewStageChangedEvent(
            1,
            ReviewStage.IN_PROGRESS,
            ReviewStage.FINISHED,
        );

        await listener.handleReviewStageChanged(event);

        expect(cycles.completeCycle).not.toHaveBeenCalled();
        expect(eventEmitter.emit).toHaveBeenCalledWith(
            'review.stage.processed',
            expect.any(Object),
        );
    });

    it('completes the cycle when all remaining reviews are past response collection', async () => {
        reviews.findById.mockResolvedValue(buildReview());
        reviews.listByCycleId.mockResolvedValue([
            buildReview({ id: 1, stage: ReviewStage.FINISHED }),
            buildReview({ id: 2, stage: ReviewStage.PUBLISHED }),
            buildReview({ id: 3, stage: ReviewStage.CANCELED }),
        ]);

        const event = new ReviewStageChangedEvent(
            1,
            ReviewStage.IN_PROGRESS,
            ReviewStage.FINISHED,
        );

        await listener.handleReviewStageChanged(event);

        expect(cycles.completeCycle).toHaveBeenCalledWith(50);
        expect(eventEmitter.emit).toHaveBeenCalledWith(
            'review.stage.processed',
            expect.any(Object),
        );
    });

    it('does not complete the cycle while another review is still active', async () => {
        reviews.findById.mockResolvedValue(buildReview());
        reviews.listByCycleId.mockResolvedValue([
            buildReview({ id: 1, stage: ReviewStage.FINISHED }),
            buildReview({ id: 2, stage: ReviewStage.IN_PROGRESS }),
        ]);

        const event = new ReviewStageChangedEvent(
            1,
            ReviewStage.IN_PROGRESS,
            ReviewStage.FINISHED,
        );

        await listener.handleReviewStageChanged(event);

        expect(cycles.completeCycle).not.toHaveBeenCalled();
    });

    it('still emits review.stage.processed when completeCycle fails', async () => {
        reviews.findById.mockResolvedValue(buildReview());
        reviews.listByCycleId.mockResolvedValue([
            buildReview({ id: 1, stage: ReviewStage.FINISHED }),
        ]);
        cycles.completeCycle.mockRejectedValue(new Error('boom'));

        const event = new ReviewStageChangedEvent(
            1,
            ReviewStage.IN_PROGRESS,
            ReviewStage.FINISHED,
        );

        await listener.handleReviewStageChanged(event);

        expect(eventEmitter.emit).toHaveBeenCalledWith(
            'review.stage.processed',
            expect.any(Object),
        );
    });
});
