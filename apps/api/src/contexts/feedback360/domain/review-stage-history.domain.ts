import { ReviewStage } from '@intra/shared-kernel';

export type ReviewStageHistoryProps = {
    id?: number;
    reviewId: number;
    fromStage: ReviewStage;
    toStage: ReviewStage;
    changedById?: number | null;
    changedByName?: string | null;
    reason?: string | null;
    createdAt?: Date;
};

export class ReviewStageHistoryDomain {
    readonly id?: number;
    readonly reviewId: number;
    readonly fromStage: ReviewStage;
    readonly toStage: ReviewStage;
    readonly changedById?: number | null;
    readonly changedByName?: string | null;
    readonly reason?: string | null;
    readonly createdAt?: Date;

    private constructor(props: ReviewStageHistoryProps) {
        this.id = props.id;
        this.reviewId = props.reviewId;
        this.fromStage = props.fromStage;
        this.toStage = props.toStage;
        this.changedById = props.changedById ?? null;
        this.changedByName = props.changedByName ?? null;
        this.reason = props.reason ?? null;
        this.createdAt = props.createdAt;
    }

    static create(props: ReviewStageHistoryProps): ReviewStageHistoryDomain {
        return new ReviewStageHistoryDomain(props);
    }
}
