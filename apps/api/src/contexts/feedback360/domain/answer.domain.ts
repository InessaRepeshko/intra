import { AnswerType, RespondentCategory } from '@intra/shared-kernel';

export type AnswerProps = {
    id?: number;
    reviewId: number;
    questionId: number;
    respondentCategory: RespondentCategory;
    answerType: AnswerType;
    numericalValue?: number | null;
    textValue?: string | null;
    createdAt?: Date;
};

export class AnswerDomain {
    readonly id?: number;
    readonly reviewId: number;
    readonly questionId: number;
    readonly respondentCategory: RespondentCategory;
    readonly answerType: AnswerType;
    readonly numericalValue?: number | null;
    readonly textValue?: string | null;
    readonly createdAt?: Date;

    private constructor(props: AnswerProps) {
        this.id = props.id;
        this.reviewId = props.reviewId;
        this.questionId = props.questionId;
        this.respondentCategory = props.respondentCategory;
        this.answerType = props.answerType;
        this.numericalValue = props.numericalValue ?? null;
        this.textValue = props.textValue ?? null;
        this.createdAt = props.createdAt;
    }

    static create(props: AnswerProps): AnswerDomain {
        return new AnswerDomain(props);
    }
}
