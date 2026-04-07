import { ReviewStage } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ReviewStageChangedEvent } from '../../../feedback360/application/events/review-stage-changed.event';
import { CycleService } from '../../../feedback360/application/services/cycle.service';
import { ReviewService } from '../../../feedback360/application/services/review.service';
import { ReviewStageProcessedEvent } from '../events/review-stage-processed.event';

/**
 * Event listener for review stage changes
 * Automatically triggers cycle completion when all reviews are finished
 */
@Injectable()
export class ReviewStageListener {
    private readonly logger = new Logger(ReviewStageListener.name);

    constructor(
        private readonly cycles: CycleService,
        private readonly reviews: ReviewService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    /**
     * Handles review.stage.changed events
     * Changes cycle status to finished
     * if all reviews for the cycle are finished
     */
    @OnEvent('review.stage.changed')
    async handleReviewStageChanged(
        event: ReviewStageChangedEvent,
    ): Promise<void> {
        this.logger.debug(
            `Review ${event.reviewId} transitioned from ${event.fromStage} to ${event.toStage}`,
        );

        if (event.toStage !== ReviewStage.FINISHED) {
            // Emit event for listeners to react
            this.eventEmitter.emit(
                'review.stage.processed',
                ReviewStageProcessedEvent.fromReviewStageChangedEvent(event),
            );
            return;
        }

        const review = await this.reviews.getById(event.reviewId);

        if (!review.cycleId) {
            return;
        }

        this.logger.debug(
            `Check if all reviews for cycle ${review.cycleId} are finished`,
        );

        try {
            const reviews = await this.reviews.search({
                cycleId: review.cycleId,
            });
            const allCompleted = reviews.every(
                (review) =>
                    review.stage === ReviewStage.FINISHED ||
                    review.stage === ReviewStage.CANCELED,
            );

            if (allCompleted) {
                await this.cycles.completeCycle(review.cycleId);
                this.logger.debug(
                    `Successfully completed cycle ${review.cycleId} due to all reviews being completed`,
                );
            } else {
                this.logger.debug(
                    `Cycle ${review.cycleId} is not completed yet. Remaining reviews: ${
                        reviews.filter(
                            (review) =>
                                review.stage === ReviewStage.SELF_ASSESSMENT ||
                                review.stage === ReviewStage.WAITING_TO_START ||
                                review.stage === ReviewStage.IN_PROGRESS,
                        ).length
                    }`,
                );
            }
        } catch (error) {
            this.logger.error(
                `Failed to check review collecting completion for cycle ${review.cycleId}: ${error.message}`,
                error.stack,
            );
        } finally {
            // Emit event for listeners to react
            this.eventEmitter.emit(
                'review.stage.processed',
                ReviewStageProcessedEvent.fromReviewStageChangedEvent(event),
            );
        }
    }
}
