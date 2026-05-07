import {
    RespondentCategory,
    ResponseStatus,
    ReviewStage,
} from '@intra/shared-kernel';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TRANSITION_REASONS } from '../constants/review-stage-transitions';
import { RespondentStatusChangedEvent } from '../events/respondent-status-changed.event';
import {
    RESPONDENT_REPOSITORY,
    RespondentRepositoryPort,
} from '../ports/respondent.repository.port';
import {
    REVIEW_REPOSITORY,
    ReviewRepositoryPort,
} from '../ports/review.repository.port';
import { ReviewService } from '../services/review.service';

/**
 * Event listener for respondent status changes
 * Automatically triggers review completion when all responses are collected
 */
@Injectable()
export class RespondentStatusListener {
    private readonly logger = new Logger(RespondentStatusListener.name);

    constructor(
        @Inject(RESPONDENT_REPOSITORY)
        private readonly respondents: RespondentRepositoryPort,
        private readonly reviews: ReviewService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    /*
     * Handles the respondent.status.changed event
     * Changes review status to finished
     * if all responses for the review are collected
     */
    @OnEvent('respondent.status.changed')
    async handleRespondentStatusChanged(
        event: RespondentStatusChangedEvent,
    ): Promise<void> {
        this.logger.debug(
            `Review response ${event.respondentRelationId} transitioned from ${event.fromStatus} to ${event.toStatus}`,
        );

        if (
            event.toStatus !== ResponseStatus.COMPLETED &&
            event.toStatus !== ResponseStatus.CANCELED
        ) {
            return;
        }

        this.logger.debug(
            `Checking if all responses for review ${event.reviewId} are collected`,
        );

        try {
            const respondents = await this.respondents.listByReview(
                event.reviewId,
                {},
            );
            const allCompleted = respondents.every(
                (respondent) =>
                    respondent.responseStatus === ResponseStatus.COMPLETED ||
                    respondent.responseStatus === ResponseStatus.CANCELED,
            );

            if (allCompleted) {
                await this.reviews.completeReview(event.reviewId);
                this.logger.debug(
                    `Successfully completed review ${event.reviewId} due to all responses being collected`,
                );
            } else {
                this.logger.debug(
                    `Review ${event.reviewId} is not completed yet. Remaining responses: ${
                        respondents.filter(
                            (respondent) =>
                                respondent.responseStatus ===
                                    ResponseStatus.PENDING ||
                                respondent.responseStatus ===
                                    ResponseStatus.IN_PROGRESS,
                        ).length
                    }`,
                );
            }
        } catch (error) {
            this.logger.error(
                `Failed to check response collecting completion for review ${event.reviewId}: ${error.message}`,
                error.stack,
            );
        }
    }
}

/**
 * Event listener that auto-transitions a review from SELF_ASSESSMENT to
 * IN_PROGRESS once the ratee has submitted their self-assessment response.
 *
 * Trigger: respondent.status.changed → toStatus = COMPLETED
 *          AND respondent.category = SELF_ASSESSMENT
 *          AND review.stage = SELF_ASSESSMENT.
 */
@Injectable()
export class SelfAssessmentCompletedListener {
    private readonly logger = new Logger(SelfAssessmentCompletedListener.name);

    constructor(
        @Inject(RESPONDENT_REPOSITORY)
        private readonly respondents: RespondentRepositoryPort,
        @Inject(REVIEW_REPOSITORY)
        private readonly reviews: ReviewRepositoryPort,
        private readonly reviewService: ReviewService,
    ) {}

    @OnEvent('respondent.status.changed')
    async handleRespondentCompleted(
        event: RespondentStatusChangedEvent,
    ): Promise<void> {
        if (event.toStatus !== ResponseStatus.COMPLETED) {
            return;
        }

        try {
            const respondent = await this.respondents.getById(
                event.respondentRelationId,
            );

            if (respondent.category !== RespondentCategory.SELF_ASSESSMENT) {
                return;
            }

            const review = await this.reviews.findById(event.reviewId);
            if (!review) {
                this.logger.warn(
                    `Review ${event.reviewId} not found while handling self-assessment completion`,
                );
                return;
            }

            if (review.stage !== ReviewStage.SELF_ASSESSMENT) {
                return;
            }

            this.logger.debug(
                `Ratee submitted self-assessment for review ${event.reviewId}; advancing stage SELF_ASSESSMENT → IN_PROGRESS`,
            );

            await this.reviewService.changeReviewStage(
                event.reviewId,
                ReviewStage.IN_PROGRESS,
                event.changedById ?? undefined,
                event.changedByName ?? undefined,
                TRANSITION_REASONS.SYSTEM_AUTOMATED,
            );
        } catch (error) {
            this.logger.error(
                `Failed to auto-advance review ${event.reviewId} to IN_PROGRESS after self-assessment completion: ${
                    (error as Error).message
                }`,
                (error as Error).stack,
            );
        }
    }
}
