import { ReviewStage } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReviewStageChangedEvent } from '../../../feedback360/application/events/review-stage-changed.event';
import { ReportingService } from '../services/reporting.service';

/**
 * Event listener for review stage changes
 * Automatically triggers report generation when review reaches PREPARING_REPORT stage
 */
@Injectable()
export class ReviewStageListener {
    private readonly logger = new Logger(ReviewStageListener.name);

    constructor(private readonly reportService: ReportingService) {}

    /**
     * Handles review.stage.changed events
     * Triggers report generation when review transitions to PREPARING_REPORT
     */
    @OnEvent('review.stage.changed')
    async handleReviewStageChanged(
        event: ReviewStageChangedEvent,
    ): Promise<void> {
        this.logger.log(
            `Review ${event.reviewId} transitioned from ${event.fromStage} to ${event.toStage}`,
        );

        if (event.toStage !== ReviewStage.PREPARING_REPORT) {
            return;
        }

        this.logger.log(
            `Initiating report generation for review ${event.reviewId}`,
        );

        try {
            const report = await this.reportService.generateReportForReview(
                event.reviewId,
            );

            this.logger.log(
                `Successfully generated report ${report.id} for review ${event.reviewId}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to generate report for review ${event.reviewId}: ${error.message}`,
                error.stack,
            );
        }
    }
}
