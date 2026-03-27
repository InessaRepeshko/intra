import { CycleStage } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CycleStageChangedEvent } from '../../../feedback360/application/events/cycle-stage-changed.event';
import { ClusterScoreAnalyticsService } from '../../../feedback360/application/services/cluster-score-analytics.service';

@Injectable()
export class CycleStageListener {
    private readonly logger = new Logger(CycleStageListener.name);

    constructor(private readonly analytics: ClusterScoreAnalyticsService) {}

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
        }
    }
}
