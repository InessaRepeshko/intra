import { SortDirection } from "../../../common/enums/sort-direction.enum";
import { ClusterSortField } from "../../enums/cluster-sort-field.enum";

export type ClusterSearchQuery = {
    competenceId?: number;
    lowerBound?: number;
    upperBound?: number;
    title?: string;
    description?: string;
    search?: string;
    sortBy?: ClusterSortField;
    sortDirection?: SortDirection;
};
