import { ResponseStatus } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { RespondentStatusChangedEvent } from '../events/respondent-status-changed.event';
import { ReviewService } from '../services/review.service';

/**
 * Event listener for respondent status changes
 * Automatically triggers review completion when all responses are collected
 */
@Injectable()
export class RespondentStatusListener {
    private readonly logger = new Logger(RespondentStatusListener.name);

    constructor(
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
            const respondents = await this.reviews.listRespondents(
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
