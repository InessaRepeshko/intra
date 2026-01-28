import { PositionSortField } from "../../enums/position-sort-field.enum";
import { SortDirection } from "../../../common/enums/sort-direction.enum";

export type PositionSearchQuery = {
    title?: string;
    description?: string;
    search?: string;
    sortBy?: PositionSortField;
    sortDirection?: SortDirection;
};
