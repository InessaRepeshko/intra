import { CycleStage } from '@intra/shared-kernel';
import { CycleStageChangedEvent } from './cycle-stage-changed.event';

export class CycleStageProcessedEvent {
    constructor(
        public readonly cycleId: number,
        public readonly currentStage: CycleStage,
        public readonly changedById?: number | null,
        public readonly changedByName?: string | null,
        public readonly reason?: string | null,
    ) {}

    static fromCycleStageChangedEvent(
        event: CycleStageChangedEvent,
    ): CycleStageProcessedEvent {
        return new CycleStageProcessedEvent(
            event.cycleId,
            event.toStage,
            event.changedById,
            event.changedByName,
            event.reason,
        );
    }
}
