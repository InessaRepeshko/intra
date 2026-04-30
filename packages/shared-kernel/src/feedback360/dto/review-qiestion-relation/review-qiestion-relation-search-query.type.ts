import { SortDirection } from '../../../common/enums/sort-direction.enum';
import { AnswerType } from '../../../library/enums/answer-type.enum';
import { ReviewQuestionRelationSortField } from '../../enums/review-qiestion-relation-sort-field.enum';

export type ReviewQuestionRelationSearchQuery = {
    reviewId?: number;
    questionId?: number;
    questionTitle?: string;
    answerType?: AnswerType;
    competenceId?: number;
    competenceTitle?: string;
    competenceCode?: string;
    competenceDescription?: string;
    isForSelfassessment?: boolean;
    sortBy?: ReviewQuestionRelationSortField;
    sortDirection?: SortDirection;
};
