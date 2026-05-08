import { AnswerType } from '../../../library/enums/answer-type.enum';

export interface ReviewQuestionRelationBaseDto<TDate = Date> {
    id: number;
    reviewId: number;
    questionId: number;
    questionTitle: string;
    answerType: AnswerType;
    competenceId: number;
    competenceTitle: string;
    isForSelfassessment: boolean;
    createdAt: TDate;
}

export type ReviewQuestionRelationDto = ReviewQuestionRelationBaseDto<Date>;

export type ReviewQuestionRelationResponseDto =
    ReviewQuestionRelationBaseDto<string>;
