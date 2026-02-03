import { AnswerType } from '@intra/shared-kernel';

export type ReviewQuestionRelationProps = {
    id?: number;
    reviewId: number;
    questionId: number;
    questionTitle: string;
    answerType: AnswerType;
    competenceId: number;
    competenceTitle: string;
    isForSelfassessment?: boolean | null;
    createdAt?: Date;
};

export class ReviewQuestionRelationDomain {
    readonly id?: number;
    readonly reviewId: number;
    readonly questionId: number;
    readonly questionTitle: string;
    readonly answerType: AnswerType;
    readonly competenceId: number;
    readonly competenceTitle: string;
    readonly isForSelfassessment: boolean;
    readonly createdAt?: Date;

    private constructor(props: ReviewQuestionRelationProps) {
        this.id = props.id;
        this.reviewId = props.reviewId;
        this.questionId = props.questionId;
        this.questionTitle = props.questionTitle;
        this.answerType = props.answerType;
        this.competenceId = props.competenceId;
        this.competenceTitle = props.competenceTitle;
        this.isForSelfassessment = props.isForSelfassessment ?? false;
        this.createdAt = props.createdAt;
    }

    static create(
        props: ReviewQuestionRelationProps,
    ): ReviewQuestionRelationDomain {
        return new ReviewQuestionRelationDomain(props);
    }
}
