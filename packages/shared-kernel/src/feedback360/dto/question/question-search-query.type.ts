import { AnswerType } from "../../../library/enums/answer-type.enum";
import { SortDirection } from "../../../common/enums/sort-direction.enum";
import { QuestionSortField } from "../../enums/question-sort-field.enum";

export type QuestionSearchQuery = {
    cycleId?: number;
    questionTemplateId?: number;
    competenceId?: number;
    title?: string;
    answerType?: AnswerType;
    isForSelfassessment?: boolean;
    sortBy?: QuestionSortField;
    sortDirection?: SortDirection;
};
