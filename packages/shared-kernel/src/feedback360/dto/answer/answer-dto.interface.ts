import { AnswerType } from '../../../library/enums/answer-type.enum';
import { RespondentCategory } from '../../enums/respondent-category.enum';

export interface AnswerDto {
    id: number;
    reviewId: number;
    questionId: number;
    respondentCategory: RespondentCategory;
    answerType: AnswerType;
    numericalValue?: number | null;
    textValue?: string | null;
    createdAt: Date;
}
