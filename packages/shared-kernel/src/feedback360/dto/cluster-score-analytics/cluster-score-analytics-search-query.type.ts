import { SortDirection } from "../../../common/enums/sort-direction.enum";
import { CycleClusterAnalyticsSortField } from "../../enums/cluster-score-analytics-sort-field.enum";

export type CycleClusterAnalyticsSearchQuery = {
    cycleId?: number;
    clusterId?: number;
    employeesCount?: number;
    minScore?: number;
    maxScore?: number;
    averageScore?: number;
    sortBy?: CycleClusterAnalyticsSortField;
    sortDirection?: SortDirection;
};
