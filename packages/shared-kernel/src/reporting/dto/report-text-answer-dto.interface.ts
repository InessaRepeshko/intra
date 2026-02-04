import { RespondentCategory } from '../../feedback360/enums/respondent-category.enum';

export interface ReportTextAnswerDto {
    questionId: number;
    questionTitle?: string | null;
    respondentCategory: RespondentCategory;
    textValue: string;
}
