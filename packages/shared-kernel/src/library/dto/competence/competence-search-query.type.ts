import { SortDirection } from "../../../common/enums/sort-direction.enum";
import { CompetenceSortField } from "../../enums/competence-sort-field.enum";

export type CompetenceSearchQuery = {
    code?: string;
    title?: string;
    description?: string;
    search?: string;
    sortBy?: CompetenceSortField;
    sortDirection?: SortDirection;
};
