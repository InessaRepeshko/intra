import { apiClient } from '@shared/api/api-client';
import {
    ClusterFilterQuery,
    ClusterResponseDto,
    CreateClusterPayload,
    UpdateClusterPayload,
} from '../model/types';

const CLUSTERS_BASE = '/library/clusters';

export async function fetchClusters(
    params?: ClusterFilterQuery,
): Promise<ClusterResponseDto[]> {
    const { data } = await apiClient.get<ClusterResponseDto[]>(CLUSTERS_BASE, {
        params,
    });
    return data;
}

export async function fetchClusterById(
    id: number,
): Promise<ClusterResponseDto> {
    const { data } = await apiClient.get<ClusterResponseDto>(
        `${CLUSTERS_BASE}/${id}`,
    );
    return data;
}

export async function createCluster(
    payload: CreateClusterPayload,
): Promise<ClusterResponseDto> {
    const { data } = await apiClient.post<ClusterResponseDto>(
        CLUSTERS_BASE,
        payload,
    );
    return data;
}

export async function updateCluster(
    id: number,
    payload: UpdateClusterPayload,
): Promise<ClusterResponseDto> {
    const { data } = await apiClient.patch<ClusterResponseDto>(
        `${CLUSTERS_BASE}/${id}`,
        payload,
    );
    return data;
}

export async function deleteCluster(id: number): Promise<void> {
    await apiClient.delete(`${CLUSTERS_BASE}/${id}`);
}
