import { AnswerType } from '../../../library/enums/answer-type.enum';
import { RespondentCategory } from '../../enums/respondent-category.enum';

export interface AnswerBaseDto<TDate = Date> {
    id: number;
    reviewId: number;
    questionId: number;
    respondentCategory: RespondentCategory;
    answerType: AnswerType;
    numericalValue?: number | null;
    textValue?: string | null;
    createdAt: TDate;
}

export type AnswerDto = AnswerBaseDto<Date>;

export type AnswerResponseDto = AnswerBaseDto<string>;
