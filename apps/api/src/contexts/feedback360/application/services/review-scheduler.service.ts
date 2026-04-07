import { CycleStage, ReviewStage, SYSTEM_ACTOR } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TRANSITION_REASONS } from '../constants/review-stage-transitions';
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
     * Runs every day at 7am to find reviews that should be completed
     */
    @Cron(CronExpression.EVERY_DAY_AT_7AM)
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
                            await this.reviewService.changeReviewStage(
                                review.id!,
                                ReviewStage.PREPARING_REPORT,
                                SYSTEM_ACTOR.ID,
                                SYSTEM_ACTOR.NAME,
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

    /**
     * SCHEDULED TRIGGER: Finish cycles past their deadlines
     * Runs every day at 7am to find cycles that should be finished
     */
    @Cron(CronExpression.EVERY_DAY_AT_7AM)
    async checkCycleDeadlines(): Promise<void> {
        this.logger.log('Checking for cycles past deadline...');

        try {
            const cycles = await this.cycleService.search({
                stage: CycleStage.ACTIVE,
                isActive: true,
            });

            const now = new Date();

            for (const cycle of cycles) {
                const endDatePassed =
                    cycle.endDate && new Date(cycle.endDate) < now;
                const responseDeadlinePassed =
                    cycle.responseDeadline &&
                    new Date(cycle.responseDeadline) < now;

                if (!endDatePassed && !responseDeadlinePassed) {
                    continue;
                }

                try {
                    await this.cycleService.forceFinish(cycle.id!);
                    this.logger.log(
                        `Finished cycle ${cycle.id} (deadline reached)`,
                    );
                } catch (error) {
                    this.logger.error(
                        `Failed to finish cycle ${cycle.id}: ${error.message}`,
                    );
                }
            }
        } catch (error) {
            this.logger.error(
                `Error checking cycle deadlines: ${error.message}`,
            );
        }
    }
}
