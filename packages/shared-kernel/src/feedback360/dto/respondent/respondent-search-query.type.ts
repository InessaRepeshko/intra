import { SortDirection } from '../../../common/enums/sort-direction.enum';
import { RespondentCategory } from '../../enums/respondent-category.enum';
import { RespondentSortField } from '../../enums/respondent-sort-field.enum';
import { ResponseStatus } from '../../enums/response-status.enum';

export type RespondentSearchQuery = {
    reviewId?: number;
    respondentId?: number;
    fullName?: string;
    category?: RespondentCategory;
    responseStatus?: ResponseStatus;
    respondentNote?: string;
    hrNote?: string;
    positionId?: number;
    positionTitle?: string;
    teamId?: number | null;
    teamTitle?: string | null;
    invitedAt?: Date;
    canceledAt?: Date;
    respondedAt?: Date;
    sortBy?: RespondentSortField;
    sortDirection?: SortDirection;
};
