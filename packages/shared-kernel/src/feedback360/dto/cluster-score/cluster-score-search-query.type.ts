import { ClusterScoreSortField } from "../../enums/cluster-score-sort-field.enum";
import { SortDirection } from "../../../common/enums/sort-direction.enum";

export type ClusterScoreSearchQuery = {
    cycleId?: number;
    clusterId?: number;
    rateeId?: number;
    reviewId?: number;
    score?: number;
    answerCount?: number;
    sortBy?: ClusterScoreSortField;
    sortDirection?: SortDirection;
};
