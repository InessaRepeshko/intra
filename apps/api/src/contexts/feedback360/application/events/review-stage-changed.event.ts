import { ReviewStage } from '@intra/shared-kernel';

export class ReviewStageChangedEvent {
    constructor(
        public readonly reviewId: number,
        public readonly fromStage: ReviewStage,
        public readonly toStage: ReviewStage,
        public readonly changedById?: number | null,
        public readonly changedByName?: string | null,
        public readonly reason?: string | null,
    ) { }
}
