import { RespondentCategory } from "../../enums/respondent-category.enum";
import { AnswerType } from "../../../library/enums/answer-type.enum";
import { AnswerSortField } from "../../enums/answer-sort-field.enum";
import { SortDirection } from "../../../common/enums/sort-direction.enum";

export type AnswerSearchQuery = {
    reviewId?: number;
    questionId?: number;
    respondentCategory?: RespondentCategory;
    answerType?: AnswerType;
    numericalValue?: number;
    textValue?: string;
    sortBy?: AnswerSortField;
    sortDirection?: SortDirection;
};
