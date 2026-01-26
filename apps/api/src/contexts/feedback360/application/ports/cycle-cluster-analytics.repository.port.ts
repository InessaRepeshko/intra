import { SortDirection } from '@intra/shared-kernel';
import { CycleClusterAnalyticsDomain } from '../../domain/cycle-cluster-analytics.domain';

export const CYCLE_CLUSTER_ANALYTICS_REPOSITORY = Symbol('FEEDBACK360.CYCLE_CLUSTER_ANALYTICS_REPOSITORY');

export enum CycleClusterAnalyticsSortField {
    ID = 'id',
    CYCLE_ID = 'cycleId',
    CLUSTER_ID = 'clusterId',
    EMPLOYEES_COUNT = 'employeesCount',
    MIN_SCORE = 'minScore',
    MAX_SCORE = 'maxScore',
    AVERAGE_SCORE = 'averageScore',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

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

export type CycleClusterAnalyticsUpdatePayload = Partial<{
    employeesCount: number;
    minScore: number;
    maxScore: number;
    averageScore: number;
}>;

export interface CycleClusterAnalyticsRepositoryPort {
    upsert(analytics: CycleClusterAnalyticsDomain): Promise<CycleClusterAnalyticsDomain>;
    findById(id: number): Promise<CycleClusterAnalyticsDomain | null>;
    search(query: CycleClusterAnalyticsSearchQuery): Promise<CycleClusterAnalyticsDomain[]>;
    updateById(id: number, patch: CycleClusterAnalyticsUpdatePayload): Promise<CycleClusterAnalyticsDomain>;
    deleteById(id: number): Promise<void>;
}
