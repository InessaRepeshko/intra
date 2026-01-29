import {
    CommentSentiment,
    RespondentCategory,
} from '@intra/shared-kernel';

export type ReportCommentProps = {
    id?: number;
    reportId: number;
    comment?: string | null;
    commentSentiment?: CommentSentiment;
    numberOfMentions?: number | null;
    respondentCategory: RespondentCategory;
    createdAt?: Date;
};

export class ReportCommentDomain {
    readonly id?: number;
    readonly reportId: number;
    readonly comment?: string | null;
    readonly commentSentiment: CommentSentiment;
    readonly numberOfMentions?: number | null;
    readonly respondentCategory: RespondentCategory;
    readonly createdAt?: Date;

    private constructor(props: ReportCommentProps) {
        this.id = props.id;
        this.reportId = props.reportId;
        this.comment = props.comment ?? null;
        this.commentSentiment = props.commentSentiment ?? CommentSentiment.POSITIVE;
        this.numberOfMentions = props.numberOfMentions ?? null;
        this.respondentCategory = props.respondentCategory;
        this.createdAt = props.createdAt;
    }

    static create(props: ReportCommentProps): ReportCommentDomain {
        return new ReportCommentDomain(props);
    }
}
