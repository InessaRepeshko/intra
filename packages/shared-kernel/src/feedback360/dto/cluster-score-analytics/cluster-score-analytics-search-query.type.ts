import { SortDirection } from '../../../common/enums/sort-direction.enum';
import { ClusterScoreAnalyticsSortField } from '../../enums/cluster-score-analytics-sort-field.enum';

export type ClusterScoreAnalyticsSearchQuery = {
    cycleId?: number;
    clusterId?: number;
    employeesCount?: number;
    minScore?: number;
    maxScore?: number;
    averageScore?: number;
    sortBy?: ClusterScoreAnalyticsSortField;
    sortDirection?: SortDirection;
};
