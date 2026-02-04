import { CommentSentiment, RespondentCategory } from '@intra/shared-kernel';

export type ReportCommentProps = {
    id?: number;
    reportId: number;
    questionId: number;
    questionTitle: string;
    comment: string;
    respondentCategories: RespondentCategory[];
    commentSentiment?: CommentSentiment | null;
    numberOfMentions: number;
    createdAt?: Date;
};

export class ReportCommentDomain {
    readonly id?: number;
    readonly reportId: number;
    readonly questionId: number;
    readonly questionTitle: string;
    readonly comment: string;
    readonly respondentCategories: RespondentCategory[];
    readonly commentSentiment?: CommentSentiment | null;
    readonly numberOfMentions: number;
    readonly createdAt?: Date;

    private constructor(props: ReportCommentProps) {
        this.id = props.id;
        this.reportId = props.reportId;
        this.questionId = props.questionId;
        this.questionTitle = props.questionTitle;
        this.comment = props.comment;
        this.respondentCategories = props.respondentCategories ?? [];
        this.commentSentiment = props.commentSentiment ?? null;
        this.numberOfMentions = props.numberOfMentions;
        this.createdAt = props.createdAt;
    }

    static create(props: ReportCommentProps): ReportCommentDomain {
        return new ReportCommentDomain(props);
    }
}
