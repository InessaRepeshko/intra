import { SortDirection } from '../../../common/enums/sort-direction.enum';
import { AnswerType } from '../../enums/answer-type.enum';
import { QuestionTemplateSortField } from '../../enums/question-template-sort-field.enum';
import { QuestionTemplateStatus } from '../../enums/question-template-status.enum';

export type QuestionTemplateSearchQuery = {
    title?: string;
    answerType?: AnswerType;
    competenceId?: number;
    isForSelfassessment?: boolean;
    status?: QuestionTemplateStatus;
    positionIds?: number[];
    sortBy?: QuestionTemplateSortField;
    sortDirection?: SortDirection;
};
