import { CycleStage } from '@intra/shared-kernel';

export class CycleStageChangedEvent {
    constructor(
        public readonly cycleId: number,
        public readonly fromStage: CycleStage,
        public readonly toStage: CycleStage,
        public readonly changedById?: number | null,
        public readonly changedByName?: string | null,
        public readonly reason?: string | null,
    ) {}
}
