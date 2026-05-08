import { apiClient } from '@/shared/api/api-client';
import type {
    ClusterScoreFilterQuery,
    ClusterScoreResponseDto,
    ClusterScoreWithRelationsResponseDto,
    UpsertClusterScorePayload,
} from '@entities/feedback360/cluster-score/model/types';

const CLUSTER_SCORE_BASE = '/feedback360/cluster-score';

export async function fetchClusterScores(
    params?: ClusterScoreFilterQuery,
): Promise<ClusterScoreResponseDto[]> {
    const { data } = await apiClient.get<ClusterScoreResponseDto[]>(
        CLUSTER_SCORE_BASE,
        { params },
    );
    return data;
}

export async function fetchClusterScoreById(
    id: number,
): Promise<ClusterScoreWithRelationsResponseDto> {
    const { data } = await apiClient.get<ClusterScoreWithRelationsResponseDto>(
        `${CLUSTER_SCORE_BASE}/${id}`,
    );
    return data;
}

export async function createClusterScore(
    payload: UpsertClusterScorePayload,
): Promise<ClusterScoreResponseDto> {
    const { data } = await apiClient.post<ClusterScoreResponseDto>(
        CLUSTER_SCORE_BASE,
        payload,
    );
    return data;
}

export async function deleteClusterScore(id: number): Promise<void> {
    await apiClient.delete(`${CLUSTER_SCORE_BASE}/${id}`);
}

export async function fetchClusterScoreByCycleId(
    cycleId: number,
): Promise<ClusterScoreResponseDto[]> {
    const { data } = await apiClient.get<ClusterScoreResponseDto[]>(
        `${CLUSTER_SCORE_BASE}/cycles/${cycleId}`,
    );
    return data;
}

export async function fetchClusterScoreTitleById(
    clusterScoreId: number,
): Promise<string> {
    const { data } = await apiClient.get<ClusterScoreWithRelationsResponseDto>(
        `${CLUSTER_SCORE_BASE}/${clusterScoreId}`,
    );
    return data?.cluster?.title;
}
