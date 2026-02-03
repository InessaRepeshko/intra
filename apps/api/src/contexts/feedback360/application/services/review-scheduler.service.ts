import { ReviewStage } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
    SYSTEM_ACTOR_ID,
    TRANSITION_REASONS,
} from '../constants/review-stage-transitions';
import { CycleService } from './cycle.service';
import { ReviewService } from './review.service';

/**
 * Scheduled service for checking review deadlines
 * Runs periodically to transition reviews to PREPARING_REPORT when deadline passes
 */
@Injectable()
export class ReviewSchedulerService {
    private readonly logger = new Logger(ReviewSchedulerService.name);

    constructor(
        private readonly reviewService: ReviewService,
        private readonly cycleService: CycleService,
    ) {}

    /**
     * SCHEDULED TRIGGER: Check for reviews past their deadline
     * Runs every hour to find reviews that should be completed
     */
    @Cron(CronExpression.EVERY_HOUR)
    async checkReviewDeadlines(): Promise<void> {
        this.logger.log('Checking for reviews past deadline...');

        try {
            // Get all active cycles
            const cycles = await this.cycleService.search({ isActive: true });

            for (const cycle of cycles) {
                if (!cycle.responseDeadline) {
                    continue;
                }

                const now = new Date();
                const deadline = new Date(cycle.responseDeadline);

                // If deadline has passed
                if (now > deadline) {
                    // Find all reviews in this cycle that are still IN_PROGRESS
                    const reviews = await this.reviewService.search({
                        cycleId: cycle.id!,
                        stage: ReviewStage.IN_PROGRESS,
                    });

                    this.logger.log(
                        `Found ${reviews.length} reviews past deadline in cycle ${cycle.id}`,
                    );

                    // Transition each review to PREPARING_REPORT
                    for (const review of reviews) {
                        try {
                            await this.reviewService.changeStage(
                                review.id!,
                                ReviewStage.PREPARING_REPORT,
                                SYSTEM_ACTOR_ID,
                                'System',
                                TRANSITION_REASONS.DEADLINE_REACHED,
                            );
                            this.logger.log(
                                `Transitioned review ${review.id} to PREPARING_REPORT (deadline)`,
                            );
                        } catch (error) {
                            this.logger.error(
                                `Failed to transition review ${review.id}: ${error.message}`,
                            );
                        }
                    }
                }
            }
        } catch (error) {
            this.logger.error(
                `Error checking review deadlines: ${error.message}`,
            );
        }
    }
}
