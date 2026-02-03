import { CYCLE_CONSTRAINTS, CycleStage } from '@intra/shared-kernel';

export type CycleProps = {
    id?: number;
    title: string;
    description?: string | null;
    hrId: number;
    minRespondentsThreshold?: number;
    stage?: CycleStage;
    isActive?: boolean | null;
    startDate: Date;
    reviewDeadline?: Date | null;
    approvalDeadline?: Date | null;
    responseDeadline?: Date | null;
    endDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
};

export class CycleDomain {
    readonly id?: number;
    readonly title: string;
    readonly description?: string | null;
    readonly hrId: number;
    readonly minRespondentsThreshold: number;
    readonly stage: CycleStage;
    readonly isActive: boolean;
    readonly startDate: Date;
    readonly reviewDeadline?: Date | null;
    readonly approvalDeadline?: Date | null;
    readonly responseDeadline?: Date | null;
    readonly endDate: Date;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    private constructor(props: CycleProps) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description ?? null;
        this.hrId = props.hrId;
        this.minRespondentsThreshold =
            props.minRespondentsThreshold ??
            CYCLE_CONSTRAINTS.ANONYMITY_THRESHOLD.MIN;
        this.stage = props.stage ?? CycleStage.NEW;
        this.isActive = props.isActive ?? true;
        this.startDate = props.startDate;
        this.reviewDeadline = props.reviewDeadline ?? null;
        this.approvalDeadline = props.approvalDeadline ?? null;
        this.responseDeadline = props.responseDeadline ?? null;
        this.endDate = props.endDate;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(props: CycleProps): CycleDomain {
        return new CycleDomain(props);
    }
}
