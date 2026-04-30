import { AnswerType } from '../../../library/enums/answer-type.enum';

export interface ReviewQuestionRelationBaseDto<TDate = Date> {
    id: number;
    reviewId: number;
    questionId: number;
    questionTitle: string;
    answerType: AnswerType;
    competenceId: number;
    competenceTitle: string;
    competenceCode?: string | null;
    competenceDescription?: string | null;
    isForSelfassessment?: boolean | null;
    createdAt: TDate;
}

export type ReviewQuestionRelationDto = ReviewQuestionRelationBaseDto<Date>;

export type ReviewQuestionRelationResponseDto =
    ReviewQuestionRelationBaseDto<string>;
