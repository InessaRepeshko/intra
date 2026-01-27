import { ReviewStage } from '@intra/shared-kernel';

export type ReviewProps = {
    id?: number;
    rateeId: number;
    rateeFullName: string;
    rateePositionId: number;
    rateePositionTitle: string;
    hrId: number;
    hrFullName: string;
    hrNote?: string | null;
    teamId?: number | null;
    teamTitle?: string | null;
    managerId?: number | null;
    managerFullName?: string | null;
    managerPositionId?: number | null;
    managerPositionTitle?: string | null;
    cycleId?: number | null;
    stage?: ReviewStage;
    reportId?: number | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export class ReviewDomain {
    readonly id?: number;
    readonly rateeId: number;
    readonly rateeFullName: string;
    readonly rateePositionId: number;
    readonly rateePositionTitle: string;
    readonly hrId: number;
    readonly hrFullName: string;
    readonly hrNote?: string | null;
    readonly teamId?: number | null;
    readonly teamTitle?: string | null;
    readonly managerId?: number | null;
    readonly managerFullName?: string | null;
    readonly managerPositionId?: number | null;
    readonly managerPositionTitle?: string | null;
    readonly cycleId?: number | null;
    readonly stage: ReviewStage;
    readonly reportId?: number | null;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    private constructor(props: ReviewProps) {
        this.id = props.id;
        this.rateeId = props.rateeId;
        this.rateeFullName = props.rateeFullName;
        this.rateePositionId = props.rateePositionId;
        this.rateePositionTitle = props.rateePositionTitle;
        this.hrId = props.hrId;
        this.hrFullName = props.hrFullName;
        this.hrNote = props.hrNote ?? null;
        this.teamId = props.teamId ?? null;
        this.teamTitle = props.teamTitle ?? null;
        this.managerId = props.managerId ?? null;
        this.managerFullName = props.managerFullName ?? null;
        this.managerPositionId = props.managerPositionId ?? null;
        this.managerPositionTitle = props.managerPositionTitle ?? null;
        this.cycleId = props.cycleId ?? null;
        this.stage = props.stage ?? ReviewStage.VERIFICATION_BY_HR;
        this.reportId = props.reportId ?? null;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(props: ReviewProps): ReviewDomain {
        return new ReviewDomain(props);
    }
}
