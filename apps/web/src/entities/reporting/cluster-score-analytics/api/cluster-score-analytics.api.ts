import { apiClient } from '@/shared/api/api-client';
import type {
    ClusterScoreAnalyticsFilterQuery,
    ClusterScoreAnalyticsResponseDto,
    UpdateClusterScoreAnalyticsPayload,
    UpsertClusterScoreAnalyticsPayload,
} from '@entities/reporting/cluster-score-analytics/model/types';

const CLUSTER_SCORE_ANALYTICS_BASE = '/feedback360/cluster-score-analytics';

export async function fetchClusterScoresAnalytics(
    params?: ClusterScoreAnalyticsFilterQuery,
): Promise<ClusterScoreAnalyticsResponseDto[]> {
    const { data } = await apiClient.get<ClusterScoreAnalyticsResponseDto[]>(
        CLUSTER_SCORE_ANALYTICS_BASE,
        { params },
    );
    return data;
}

export async function fetchClusterScoreAnalyticsById(
    id: number,
): Promise<ClusterScoreAnalyticsResponseDto> {
    const { data } = await apiClient.get<ClusterScoreAnalyticsResponseDto>(
        `${CLUSTER_SCORE_ANALYTICS_BASE}/${id}`,
    );
    return data;
}

export async function createClusterScoreAnalytics(
    payload: UpsertClusterScoreAnalyticsPayload,
): Promise<ClusterScoreAnalyticsResponseDto> {
    const { data } = await apiClient.post<ClusterScoreAnalyticsResponseDto>(
        CLUSTER_SCORE_ANALYTICS_BASE,
        payload,
    );
    return data;
}

export async function updateClusterScoreAnalytics(
    id: number,
    payload: UpdateClusterScoreAnalyticsPayload,
): Promise<ClusterScoreAnalyticsResponseDto> {
    const { data } = await apiClient.patch<ClusterScoreAnalyticsResponseDto>(
        `${CLUSTER_SCORE_ANALYTICS_BASE}/${id}`,
        payload,
    );
    return data;
}

export async function deleteClusterScoreAnalytics(id: number): Promise<void> {
    await apiClient.delete(`${CLUSTER_SCORE_ANALYTICS_BASE}/${id}`);
}

export async function fetchClusterScoreAnalyticsByCycleId(
    cycleId: number,
): Promise<ClusterScoreAnalyticsResponseDto[]> {
    const { data } = await apiClient.get<ClusterScoreAnalyticsResponseDto[]>(
        `${CLUSTER_SCORE_ANALYTICS_BASE}/cycles/${cycleId}`,
    );
    return data;
}
