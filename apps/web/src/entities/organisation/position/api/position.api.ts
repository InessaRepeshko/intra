import {
    CreatePositionPayload,
    PositionFilterQuery,
    PositionResponseDto,
    UpdatePositionPayload,
} from '@entities/organisation/position/model/types';
import { apiClient } from '@shared/api/api-client';

const POSITIONS_BASE = '/organisation/positions';

export async function fetchPositions(
    params?: PositionFilterQuery,
): Promise<PositionResponseDto[]> {
    const { data } = await apiClient.get<PositionResponseDto[]>(
        POSITIONS_BASE,
        {
            params,
        },
    );
    return data;
}

export async function fetchPositionById(
    id: number,
): Promise<PositionResponseDto> {
    const { data } = await apiClient.get<PositionResponseDto>(
        `${POSITIONS_BASE}/${id}`,
    );
    return data;
}

export async function createPosition(
    payload: CreatePositionPayload,
): Promise<PositionResponseDto> {
    const { data } = await apiClient.post<PositionResponseDto>(
        POSITIONS_BASE,
        payload,
    );
    return data;
}

export async function updatePosition(
    id: number,
    payload: UpdatePositionPayload,
): Promise<PositionResponseDto> {
    const { data } = await apiClient.patch<PositionResponseDto>(
        `${POSITIONS_BASE}/${id}`,
        payload,
    );
    return data;
}

export async function deletePosition(id: number): Promise<void> {
    await apiClient.delete<void>(`${POSITIONS_BASE}/${id}`);
}

export async function fetchPositionTitleById(
    positionId: number,
): Promise<string> {
    const response = await apiClient.get<PositionResponseDto>(
        `${POSITIONS_BASE}/${positionId}`,
    );
    return response.data?.title;
}

export async function fetchPositionTitlesByIds(
    positionIds: number[],
): Promise<{ id: number; title: string }[]> {
    const uniqueIds = Array.from(new Set(positionIds));

    const data = await Promise.all(
        uniqueIds.map(async (positionId) => {
            const title = await fetchPositionTitleById(positionId);
            return { id: positionId, title };
        }),
    );

    const positions: { id: number; title: string }[] = data.sort((a, b) =>
        a.title.localeCompare(b.title),
    );
    return positions;
}
