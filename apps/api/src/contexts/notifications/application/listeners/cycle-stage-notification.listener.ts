import { CycleStage } from '@intra/shared-kernel';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CycleStageChangedEvent } from 'src/contexts/feedback360/application/events/cycle-stage-changed.event';
import { ReviewEmailNotificationService } from '../services/review-email-notification.service';

@Injectable()
export class CycleStageNotificationListener {
    private readonly logger = new Logger(CycleStageNotificationListener.name);

    constructor(
        private readonly notifications: ReviewEmailNotificationService,
    ) {}

    @OnEvent('cycle.stage.changed', { async: true })
    async handle(event: CycleStageChangedEvent): Promise<void> {
        const { cycleId, toStage } = event;

        try {
            switch (toStage) {
                case CycleStage.PUBLISHED: {
                    const sent =
                        await this.notifications.notifyCycleStrategicReportReady(
                            cycleId,
                        );
                    this.logger.log(
                        `dispatched ${sent} email(s) for cycle=${cycleId} stage=${toStage}`,
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
                `Failed to handle cycle.stage.changed for cycle=${cycleId} stage=${toStage}: ${message}`,
                error instanceof Error ? error.stack : undefined,
            );
        }
    }
}
