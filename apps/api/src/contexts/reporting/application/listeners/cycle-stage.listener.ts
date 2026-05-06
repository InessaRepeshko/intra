import { CycleStage } from '@intra/shared-kernel';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StrategicReportingService } from 'src/contexts/reporting/application/services/strategic-reports.service';
import { CycleStageProcessedEvent } from '../../../feedback360/application/events/cycle-stage-processed.event';
import {
    REVIEW_REPOSITORY,
    ReviewRepositoryPort,
} from '../../../feedback360/application/ports/review.repository.port';
import { CycleService } from '../../../feedback360/application/services/cycle.service';

/**
 * Event listener for cycle stage changes
 * Automatically triggers strategic report generation
 * when cycle reaches FINISHED stage
 */
@Injectable()
export class CycleStageListener {
    private readonly logger = new Logger(CycleStageListener.name);

    constructor(
        private readonly strategicReportingService: StrategicReportingService,
        private readonly cycleService: CycleService,
        @Inject(REVIEW_REPOSITORY)
        private readonly reviews: ReviewRepositoryPort,
    ) {}

    /*
     * Handles the cycle.stage.processed event
     * Triggers strategic report generation for the cycle
     * when it transitions to the FINISHED stage
     * updates review stage to PREPARING_REPORT
     * and then moves it to PUBLISHED stage
     */
    @OnEvent('cycle.stage.processed')
    async handleCycleStageProcessed(
        event: CycleStageProcessedEvent,
    ): Promise<void> {
        if (event.currentStage !== CycleStage.FINISHED) {
            return;
        }

        this.logger.debug(
            `Cycle ${event.cycleId} with stage ${event.currentStage} was processed`,
        );

        setTimeout(async () => {
            const reviews = await this.reviews.listByCycleId(event.cycleId);
            if (reviews.length === 0) {
                this.logger.debug(
                    `No reviews found for cycle ${event.cycleId}. Skipping strategic report generation.`,
                );
            }
        }, 10000);

        this.logger.debug(
            `Initiating strategic report generation for cycle ${event.cycleId}`,
        );

        try {
            await this.cycleService.changeStage(
                event.cycleId,
                CycleStage.PREPARING_REPORT,
            );

            const report =
                await this.strategicReportingService.generateStrategicReportForCycle(
                    event.cycleId,
                );

            this.logger.debug(
                `Successfully generated strategic report ${report.id} for cycle ${event.cycleId}`,
            );

            await this.cycleService.changeStage(
                event.cycleId,
                CycleStage.PUBLISHED,
            );
        } catch (error) {
            this.logger.error(
                `Failed to generate strategic report for cycle ${event.cycleId}: ${error.message}`,
                error.stack,
            );
        }
    }
}
