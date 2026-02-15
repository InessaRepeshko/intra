import {
    ClusterScoreAnalyticsSearchQuery,
    UpdateClusterScoreAnalyticsPayload,
} from '@intra/shared-kernel';
import { ClusterScoreAnalyticsDomain } from '../../domain/cluster-score-analytics.domain';

export const CLUSTER_SCORE_ANALYTICS_REPOSITORY = Symbol(
    'FEEDBACK360.CLUSTER_SCORE_ANALYTICS_REPOSITORY',
);

export interface ClusterScoreAnalyticsRepositoryPort {
    upsert(
        analytics: ClusterScoreAnalyticsDomain,
    ): Promise<ClusterScoreAnalyticsDomain>;
    findById(id: number): Promise<ClusterScoreAnalyticsDomain | null>;
    search(
        query: ClusterScoreAnalyticsSearchQuery,
    ): Promise<ClusterScoreAnalyticsDomain[]>;
    updateById(
        id: number,
        patch: UpdateClusterScoreAnalyticsPayload,
    ): Promise<ClusterScoreAnalyticsDomain>;
    deleteById(id: number): Promise<void>;
    getByCycleId(cycleId: number): Promise<ClusterScoreAnalyticsDomain[]>;
}
