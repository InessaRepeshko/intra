import { ReviewStage } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReviewStageProcessedEvent } from 'src/contexts/feedback360/application/events/review-stage-processed.event';
import { ReviewService } from '../../../feedback360/application/services/review.service';
import { ReportingService } from '../services/reporting.service';

/**
 * Event listener for review stage changes
 * Automatically triggers individual report generation
 * when review reaches FINISHED stage
 */
@Injectable()
export class ReviewStageListener {
    private readonly logger = new Logger(ReviewStageListener.name);

    constructor(
        private readonly reportService: ReportingService,
        private readonly reviewService: ReviewService,
    ) {}

    /**
     * Handles review.stage.processed events
     * Triggers individual report generation for the review
     * when review transitions to FINISHED stage
     * updates review stage to PREPARING_REPORT
     * and then moves it to PROCESSING_BY_HR stage
     */
    @OnEvent('review.stage.processed')
    async handleReviewStageProcessed(
        event: ReviewStageProcessedEvent,
    ): Promise<void> {
        if (event.currentStage !== ReviewStage.FINISHED) {
            return;
        }

        this.logger.debug(
            `Review ${event.reviewId} with stage ${event.currentStage} was processed`,
        );
        this.logger.debug(
            `Initiating individual report generation for review ${event.reviewId}`,
        );

        try {
            await this.reviewService.changeReviewStage(
                event.reviewId,
                ReviewStage.PREPARING_REPORT,
            );

            const report = await this.reportService.generateReportForReview(
                event.reviewId,
            );

            this.logger.debug(
                `Successfully generated individual report ${report.id} for review ${event.reviewId}`,
            );

            await this.reviewService.changeReviewStage(
                event.reviewId,
                ReviewStage.PROCESSING_BY_HR,
            );
        } catch (error) {
            this.logger.error(
                `Failed to generate individual report for review ${event.reviewId}: ${error.message}`,
                error.stack,
            );
        }
    }
}
