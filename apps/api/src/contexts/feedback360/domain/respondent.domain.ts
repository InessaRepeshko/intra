import { RespondentCategory, ResponseStatus } from '@intra/shared-kernel';

export type RespondentProps = {
    id?: number;
    reviewId: number;
    respondentId: number;
    fullName: string;
    category: RespondentCategory;
    responseStatus?: ResponseStatus;
    respondentNote?: string | null;
    hrNote?: string | null;
    positionId: number;
    positionTitle: string;
    teamId?: number | null;
    teamTitle?: string | null;
    invitedAt?: Date | null;
    canceledAt?: Date | null;
    respondedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export class RespondentDomain {
    readonly id?: number;
    readonly reviewId: number;
    readonly respondentId: number;
    readonly fullName: string;
    readonly category: RespondentCategory;
    readonly responseStatus: ResponseStatus;
    readonly respondentNote?: string | null;
    readonly hrNote?: string | null;
    readonly positionId: number;
    readonly positionTitle: string;
    readonly teamId?: number | null;
    readonly teamTitle?: string | null;
    readonly invitedAt?: Date | null;
    readonly canceledAt?: Date | null;
    readonly respondedAt?: Date | null;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    private constructor(props: RespondentProps) {
        this.id = props.id;
        this.reviewId = props.reviewId;
        this.respondentId = props.respondentId;
        this.fullName = props.fullName;
        this.category = props.category;
        this.responseStatus = props.responseStatus ?? ResponseStatus.PENDING;
        this.respondentNote = props.respondentNote ?? null;
        this.hrNote = props.hrNote ?? null;
        this.positionId = props.positionId;
        this.positionTitle = props.positionTitle;
        this.teamId = props.teamId ?? null;
        this.teamTitle = props.teamTitle ?? null;
        this.invitedAt = props.invitedAt ?? null;
        this.canceledAt = props.canceledAt ?? null;
        this.respondedAt = props.respondedAt ?? null;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static create(props: RespondentProps): RespondentDomain {
        return new RespondentDomain(props);
    }
}
