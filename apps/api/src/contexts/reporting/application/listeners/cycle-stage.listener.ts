import { CycleStage } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { StrategicReportingService } from 'src/contexts/reporting/application/services/strategic-reporting.service';
import { CycleStageChangedEvent } from '../../../feedback360/application/events/cycle-stage-changed.event';
import { ClusterScoreAnalyticsService } from '../../../feedback360/application/services/cluster-score-analytics.service';

@Injectable()
export class CycleStageListener {
    private readonly logger = new Logger(CycleStageListener.name);

    constructor(
        private readonly analytics: ClusterScoreAnalyticsService,
        private readonly strategicReportingService: StrategicReportingService,
    ) {}

    /*
     * Handles the cycle.stage.changed event
     * Generates strategic report for the cycle
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
            `Initiating strategic report generation for cycle ${event.cycleId}`,
        );

        try {
            const report =
                await this.strategicReportingService.generateStrategicReportForCycle(
                    event.cycleId,
                );

            this.logger.debug(
                `Successfully generated strategic report ${report.id} for cycle ${event.cycleId}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to generate strategic report for cycle ${event.cycleId}: ${error.message}`,
            );
        }
    }
}
