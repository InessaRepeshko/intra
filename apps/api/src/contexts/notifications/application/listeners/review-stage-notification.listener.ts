import { ReviewStage } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReviewStageChangedEvent } from 'src/contexts/feedback360/application/events/review-stage-changed.event';
import { ReviewEmailNotificationService } from '../services/review-email-notification.service';

@Injectable()
export class ReviewStageNotificationListener {
    private readonly logger = new Logger(ReviewStageNotificationListener.name);

    constructor(
        private readonly notifications: ReviewEmailNotificationService,
    ) {}

    @OnEvent('review.stage.changed', { async: true })
    async handle(event: ReviewStageChangedEvent): Promise<void> {
        const { reviewId, toStage } = event;

        try {
            switch (toStage) {
                case ReviewStage.SELF_ASSESSMENT: {
                    const sent =
                        await this.notifications.notifyRateeSelfAssessment(
                            reviewId,
                        );
                    this.logger.log(
                        `dispatched ${sent} email(s) for review=${reviewId} stage=${toStage}`,
                    );
                    return;
                }
                case ReviewStage.IN_PROGRESS: {
                    const sent =
                        await this.notifications.notifyRespondents(reviewId);
                    this.logger.log(
                        `dispatched ${sent} email(s) for review=${reviewId} stage=${toStage}`,
                    );
                    return;
                }
                case ReviewStage.PROCESSING_BY_HR: {
                    const sent =
                        await this.notifications.notifyHrReportReady(reviewId);
                    this.logger.log(
                        `dispatched ${sent} email(s) for review=${reviewId} stage=${toStage}`,
                    );
                    return;
                }
                case ReviewStage.PUBLISHED: {
                    const sent =
                        await this.notifications.notifyReviewers(reviewId);
                    this.logger.log(
                        `dispatched ${sent} email(s) for review=${reviewId} stage=${toStage}`,
                    );
                    return;
                }
                default:
                    return;
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            this.logger.error(
                `Failed to handle review.stage.changed for review=${reviewId} stage=${toStage}: ${message}`,
                error instanceof Error ? error.stack : undefined,
            );
        }
    }
}
