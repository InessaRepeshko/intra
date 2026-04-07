import { CycleStage } from '@intra/shared-kernel';

export type CycleStageHistoryProps = {
    id?: number;
    cycleId: number;
    fromStage: CycleStage;
    toStage: CycleStage;
    changedById?: number | null;
    changedByName?: string | null;
    reason?: string | null;
    createdAt?: Date;
};

export class CycleStageHistoryDomain {
    readonly id?: number;
    readonly cycleId: number;
    readonly fromStage: CycleStage;
    readonly toStage: CycleStage;
    readonly changedById?: number | null;
    readonly changedByName?: string | null;
    readonly reason?: string | null;
    readonly createdAt?: Date;

    private constructor(props: CycleStageHistoryProps) {
        this.id = props.id;
        this.cycleId = props.cycleId;
        this.fromStage = props.fromStage;
        this.toStage = props.toStage;
        this.changedById = props.changedById ?? null;
        this.changedByName = props.changedByName ?? null;
        this.reason = props.reason ?? null;
        this.createdAt = props.createdAt;
    }

    static create(props: CycleStageHistoryProps): CycleStageHistoryDomain {
        return new CycleStageHistoryDomain(props);
    }
}
