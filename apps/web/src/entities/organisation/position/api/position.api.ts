import { apiClient } from '@shared/api/api-client';
import { PositionDto } from '../model/types';

const POSITIONS_BASE = 'organization/positions';

export async function fetchPositionTitleByPositionId(
    positionId: number,
): Promise<string> {
    const response = await apiClient.get<PositionDto>(
        `${POSITIONS_BASE}/${positionId}`,
    );
    return response.data?.title;
}
