import { ReviewStage } from '@intra/shared-kernel';
import { ReviewStageChangedEvent } from 'src/contexts/feedback360/application/events/review-stage-changed.event';
import { ReviewStageProcessedEvent } from 'src/contexts/feedback360/application/events/review-stage-processed.event';

describe('ReviewStageProcessedEvent', () => {
    describe('fromReviewStageChangedEvent', () => {
        it('maps the toStage to the processed-event currentStage', () => {
            const source = new ReviewStageChangedEvent(
                17,
                ReviewStage.NEW,
                ReviewStage.SELF_ASSESSMENT,
                8,
                'HR Manager',
                'Review updated',
            );

            const event =
                ReviewStageProcessedEvent.fromReviewStageChangedEvent(source);

            expect(event).toBeInstanceOf(ReviewStageProcessedEvent);
            expect(event.reviewId).toBe(17);
            expect(event.currentStage).toBe(ReviewStage.SELF_ASSESSMENT);
            expect(event.changedById).toBe(8);
            expect(event.changedByName).toBe('HR Manager');
            expect(event.reason).toBe('Review updated');
        });

        it('forwards optional actor/reason fields when undefined', () => {
            const source = new ReviewStageChangedEvent(
                3,
                ReviewStage.NEW,
                ReviewStage.CANCELED,
            );

            const event =
                ReviewStageProcessedEvent.fromReviewStageChangedEvent(source);

            expect(event.reviewId).toBe(3);
            expect(event.currentStage).toBe(ReviewStage.CANCELED);
            expect(event.changedById).toBeUndefined();
            expect(event.changedByName).toBeUndefined();
            expect(event.reason).toBeUndefined();
        });
    });
});
