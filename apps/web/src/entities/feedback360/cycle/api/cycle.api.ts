import type {
    CreateCyclePayload,
    CycleFilterQuery,
    CycleResponseDto,
    UpdateCyclePayload,
} from '@entities/feedback360/cycle/model/types';
import { ReviewDto } from '@entities/feedback360/review/model/types';
import { apiClient } from '@shared/api/api-client';

const CYCLES_BASE = '/feedback360/cycles';
const REVIEWS_BASE = '/feedback360/reviews';

export async function fetchCycles(
    params?: CycleFilterQuery,
): Promise<CycleResponseDto[]> {
    const { data } = await apiClient.get<CycleResponseDto[]>(CYCLES_BASE, {
        params,
    });
    return data;
}

export async function fetchCycleById(id: number): Promise<CycleResponseDto> {
    const { data } = await apiClient.get<CycleResponseDto>(
        `${CYCLES_BASE}/${id}`,
    );
    return data;
}

export async function createCycle(
    payload: CreateCyclePayload,
): Promise<CycleResponseDto> {
    const { data } = await apiClient.post<CycleResponseDto>(
        CYCLES_BASE,
        payload,
    );
    return data;
}

export async function updateCycle(
    id: number,
    payload: UpdateCyclePayload,
): Promise<CycleResponseDto> {
    const { data } = await apiClient.patch<CycleResponseDto>(
        `${CYCLES_BASE}/${id}`,
        payload,
    );
    return data;
}

export async function deleteCycle(id: number): Promise<void> {
    await apiClient.delete(`${CYCLES_BASE}/${id}`);
}

export async function forceFinishCycle(id: number): Promise<CycleResponseDto> {
    const { data } = await apiClient.post<CycleResponseDto>(
        `${CYCLES_BASE}/${id}/force-finish`,
    );
    return data;
}

export async function fetchReviewCountByCycleId(
    cycleId: number,
): Promise<number> {
    const { data } = await apiClient.get<ReviewDto[]>(REVIEWS_BASE, {
        params: { cycleId },
    });
    return data.length;
}

export async function fetchCycleTitleById(cycleId: number): Promise<string> {
    const { data } = await apiClient.get<CycleResponseDto>(
        `${CYCLES_BASE}/${cycleId}`,
    );
    return data.title;
}
