import { ReviewStage } from '@intra/shared-kernel';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ReviewStageChangedEvent } from '../../../feedback360/application/events/review-stage-changed.event';
import { CycleService } from '../../../feedback360/application/services/cycle.service';
import { ReviewStageProcessedEvent } from '../events/review-stage-processed.event';
import {
    REVIEW_REPOSITORY,
    ReviewRepositoryPort,
} from '../ports/review.repository.port';

/**
 * Stages where a review is still actively collecting responses.
 * A cycle is considered ready to complete when no review is in any of
 * these stages — i.e. every review has moved past response collection,
 * regardless of whether it is currently FINISHED, in the report
 * generation pipeline (PREPARING_REPORT / PROCESSING_BY_HR), already
 * PUBLISHED / ANALYSIS / ARCHIVED, or CANCELED.
 */
const ACTIVE_REVIEW_STAGES: readonly ReviewStage[] = [
    ReviewStage.NEW,
    ReviewStage.SELF_ASSESSMENT,
    ReviewStage.WAITING_TO_START,
    ReviewStage.IN_PROGRESS,
];

/**
 * Event listener for review stage changes
 * Automatically triggers cycle completion when all reviews are finished
 */
@Injectable()
export class ReviewStageListener {
    private readonly logger = new Logger(ReviewStageListener.name);

    constructor(
        private readonly cycles: CycleService,
        @Inject(REVIEW_REPOSITORY)
        private readonly reviews: ReviewRepositoryPort,
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

        try {
            if (event.toStage !== ReviewStage.FINISHED) {
                return;
            }

            const review = await this.reviews.findById(event.reviewId);

            if (!review) {
                this.logger.warn(`Review ${event.reviewId} not found`);
                return;
            }

            if (!review.cycleId) {
                this.logger.debug(
                    `Review ${event.reviewId} has no cycle attached; skipping cycle completion check`,
                );
                return;
            }

            this.logger.debug(
                `Check if all reviews for cycle ${review.cycleId} are finished`,
            );

            try {
                const cycleReviews = await this.reviews.listByCycleId(
                    review.cycleId,
                );
                // A cycle is "completable" once no review is still in an
                // active (response-collection) stage. We treat anything
                // past IN_PROGRESS — including PREPARING_REPORT,
                // PROCESSING_BY_HR, PUBLISHED, ANALYSIS, ARCHIVED, and
                // CANCELED — as already done from the cycle's POV. This
                // matters because individual reviews are auto-progressed
                // through the report pipeline as soon as they reach
                // FINISHED, so by the time the LAST review in the cycle
                // hits FINISHED, all earlier ones are already in
                // PROCESSING_BY_HR or further.
                const remainingActive = cycleReviews.filter((cycleReview) =>
                    ACTIVE_REVIEW_STAGES.includes(cycleReview.stage),
                );
                const allCompleted = remainingActive.length === 0;

                if (allCompleted) {
                    await this.cycles.completeCycle(review.cycleId);
                    this.logger.debug(
                        `Successfully completed cycle ${review.cycleId} due to all reviews being completed`,
                    );
                } else {
                    this.logger.debug(
                        `Cycle ${review.cycleId} is not completed yet. Remaining reviews: ${remainingActive.length}`,
                    );
                }
            } catch (error) {
                this.logger.error(
                    `Failed to check review collecting completion for cycle ${review.cycleId}: ${error.message}`,
                    error.stack,
                );
            }
        } finally {
            // Always notify downstream listeners (e.g. report generation)
            // regardless of whether the review had a cycle attached or
            // whether the cycle completion check succeeded. Skipping this
            // emit would prevent individual report generation for reviews
            // that aren't part of a cycle.
            this.eventEmitter.emit(
                'review.stage.processed',
                ReviewStageProcessedEvent.fromReviewStageChangedEvent(event),
            );
        }
    }
}
