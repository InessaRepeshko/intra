import { SortDirection } from "../../../common/enums/sort-direction.enum";
import { TeamSortField } from "../../enums/team-sort-field.enum";

export type TeamSearchQuery = {
    search?: string;
    headId?: number;
    title?: string;
    description?: string;
    sortBy?: TeamSortField;
    sortDirection?: SortDirection;
};
