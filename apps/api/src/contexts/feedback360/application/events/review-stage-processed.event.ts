import { ReviewStage } from '@intra/shared-kernel';
import { ReviewStageChangedEvent } from './review-stage-changed.event';

export class ReviewStageProcessedEvent {
    constructor(
        public readonly reviewId: number,
        public readonly currentStage: ReviewStage,
        public readonly changedById?: number | null,
        public readonly changedByName?: string | null,
        public readonly reason?: string | null,
    ) {}

    static fromReviewStageChangedEvent(
        event: ReviewStageChangedEvent,
    ): ReviewStageProcessedEvent {
        return new ReviewStageProcessedEvent(
            event.reviewId,
            event.toStage,
            event.changedById,
            event.changedByName,
            event.reason,
        );
    }
}
