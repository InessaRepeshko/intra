import { ResponseStatus } from '@intra/shared-kernel';

export class RespondentStatusChangedEvent {
    constructor(
        public readonly reviewId: number,
        public readonly respondentRelationId: number,
        public readonly fromStatus: ResponseStatus,
        public readonly toStatus: ResponseStatus,
        public readonly changedById?: number | null,
        public readonly changedByName?: string | null,
        public readonly reason?: string | null,
    ) {}
}
