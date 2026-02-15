import { AnswerType } from '../../../library/enums/answer-type.enum';
import { RespondentCategory } from '../../enums/respondent-category.enum';

export type CreateAnswerPayload = {
    reviewId: number;
    questionId: number;
    respondentCategory: RespondentCategory;
    answerType: AnswerType;
    numericalValue?: number | null;
    textValue?: string | null;
};
