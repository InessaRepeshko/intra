import { CycleStage } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CycleStageChangedEvent } from '../events/cycle-stage-changed.event';
import { ClusterScoreAnalyticsService } from '../services/cluster-score-analytics.service';

@Injectable()
export class CycleFinishedListener {
    private readonly logger = new Logger(CycleFinishedListener.name);

    constructor(private readonly analytics: ClusterScoreAnalyticsService) {}

    @OnEvent('cycle.stage.changed')
    async handleCycleStageChanged(
        event: CycleStageChangedEvent,
    ): Promise<void> {
        if (event.toStage !== CycleStage.FINISHED) {
            return;
        }

        try {
            await this.analytics.generateAnalyticsForCycle(event.cycleId);
            this.logger.log(`Generated analytics for cycle ${event.cycleId}`);
        } catch (error) {
            this.logger.error(
                `Failed to generate analytics for cycle ${event.cycleId}: ${error.message}`,
            );
        }
    }
}
