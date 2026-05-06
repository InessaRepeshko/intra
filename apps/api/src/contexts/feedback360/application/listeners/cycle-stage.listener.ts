import { CycleStage } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CycleStageChangedEvent } from '../../../feedback360/application/events/cycle-stage-changed.event';
import { ClusterScoreAnalyticsService } from '../../../feedback360/application/services/cluster-score-analytics.service';
import { CycleStageProcessedEvent } from '../events/cycle-stage-processed.event';
import { ReviewService } from '../services/review.service';

/**
 * Event listener for cycle stage changes
 * Automatically triggers cluster score analytics generation for the cycle
 * when it transitions to the FINISHED stage
 */
@Injectable()
export class CycleStageListener {
    private readonly logger = new Logger(CycleStageListener.name);

    constructor(
        private readonly analytics: ClusterScoreAnalyticsService,
        private readonly eventEmitter: EventEmitter2,
        private readonly reviewService: ReviewService,
    ) {}

    /*
     * Handles the cycle.stage.changed event
     * Generates cluster score analytics for the cycle
     * when it transitions to the FINISHED stage
     */
    @OnEvent('cycle.stage.changed')
    async handleCycleStageChanged(
        event: CycleStageChangedEvent,
    ): Promise<void> {
        this.logger.debug(
            `Cycle ${event.cycleId} transitioned from ${event.fromStage} to ${event.toStage}`,
        );

        if (event.toStage !== CycleStage.FINISHED) {
            // Emit event for listeners to react
            this.eventEmitter.emit(
                'cycle.stage.processed',
                CycleStageProcessedEvent.fromCycleStageChangedEvent(event),
            );
            return;
        }

        const reviews = await this.reviewService.search({ cycleId: event.cycleId });

        if (reviews.length === 0) {
            this.logger.debug(
                `No reviews found for cycle ${event.cycleId}. Skipping cluster score analytics generation.`,
            );
            this.eventEmitter.emit(
                'cycle.stage.processed',
                CycleStageProcessedEvent.fromCycleStageChangedEvent(event),
            );
            return;
        }

        this.logger.debug(
            `Initiating cluster score analytics generation for cycle ${event.cycleId}`,
        );

        try {
            await this.analytics.generateAnalyticsForCycle(event.cycleId);

            this.logger.debug(
                `Successfully generated cluster score analytics for cycle ${event.cycleId}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to generate cluster score analytics for cycle ${event.cycleId}: ${error.message}`,
            );
        } finally {
            // Emit event for listeners to react
            this.eventEmitter.emit(
                'cycle.stage.processed',
                CycleStageProcessedEvent.fromCycleStageChangedEvent(event),
            );
        }
    }
}
