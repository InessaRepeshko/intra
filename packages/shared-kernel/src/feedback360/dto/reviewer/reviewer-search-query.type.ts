import { SortDirection } from "../../../common/enums/sort-direction.enum";
import { ReviewerSortField } from "../../enums/reviewer-sort-field.enum";

export type ReviewerSearchQuery = {
    reviewId?: number;
    reviewerId?: number;
    fullName?: string;
    positionId?: number;
    positionTitle?: string;
    teamId?: number | null;
    teamTitle?: string | null;
    sortBy?: ReviewerSortField;
    sortDirection?: SortDirection;
};
