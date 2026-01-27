import {
    CycleClusterAnalyticsSearchQuery,
    UpdateCycleClusterAnalyticsPayload,
} from '@intra/shared-kernel';
import { CycleClusterAnalyticsDomain } from '../../domain/cycle-cluster-analytics.domain';

export const CYCLE_CLUSTER_ANALYTICS_REPOSITORY = Symbol(
    'FEEDBACK360.CYCLE_CLUSTER_ANALYTICS_REPOSITORY',
);

export interface CycleClusterAnalyticsRepositoryPort {
    upsert(
        analytics: CycleClusterAnalyticsDomain,
    ): Promise<CycleClusterAnalyticsDomain>;
    findById(id: number): Promise<CycleClusterAnalyticsDomain | null>;
    search(
        query: CycleClusterAnalyticsSearchQuery,
    ): Promise<CycleClusterAnalyticsDomain[]>;
    updateById(
        id: number,
        patch: UpdateCycleClusterAnalyticsPayload,
    ): Promise<CycleClusterAnalyticsDomain>;
    deleteById(id: number): Promise<void>;
}
