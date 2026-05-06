import type {
    CreateReviewPayload,
    ReviewFilterQuery,
    ReviewResponseDto,
    ReviewStage,
    UpdateReviewPayload,
} from '@entities/feedback360/review/model/types';
import { apiClient } from '@shared/api/api-client';

const REVIEWS_BASE = '/feedback360/reviews';

export async function fetchReviews(
    params?: ReviewFilterQuery,
): Promise<ReviewResponseDto[]> {
    const { data } = await apiClient.get<ReviewResponseDto[]>(REVIEWS_BASE, {
        params,
    });
    return data;
}

export async function fetchReviewById(id: number): Promise<ReviewResponseDto> {
    const { data } = await apiClient.get<ReviewResponseDto>(
        `${REVIEWS_BASE}/${id}`,
    );
    return data;
}

export async function createReview(
    payload: CreateReviewPayload,
): Promise<ReviewResponseDto> {
    const { data } = await apiClient.post<ReviewResponseDto>(
        REVIEWS_BASE,
        payload,
    );
    return data;
}

export async function updateReview(
    id: number,
    payload: UpdateReviewPayload,
): Promise<ReviewResponseDto> {
    const { data } = await apiClient.patch<ReviewResponseDto>(
        `${REVIEWS_BASE}/${id}`,
        payload,
    );
    return data;
}

export async function deleteReview(id: number): Promise<void> {
    await apiClient.delete(`${REVIEWS_BASE}/${id}`);
}

export async function forceCompleteReview(
    id: number,
): Promise<ReviewResponseDto> {
    const { data } = await apiClient.post<ReviewResponseDto>(
        `${REVIEWS_BASE}/${id}/force-finish`,
    );
    return data;
}

export async function fetchRateeFullNameByReviewId(
    reviewId: number,
): Promise<string> {
    const response = await apiClient.get<ReviewResponseDto>(
        `${REVIEWS_BASE}/${reviewId}`,
    );
    return response.data?.rateeFullName;
}

export async function fetchRateePositionTitleByReviewId(
    reviewId: number,
): Promise<string> {
    const response = await apiClient.get<ReviewResponseDto>(
        `${REVIEWS_BASE}/${reviewId}`,
    );
    return response.data?.rateePositionTitle;
}

export async function fetchRateeTeamTitleByReviewId(
    reviewId: number,
): Promise<string | null> {
    const response = await apiClient.get<ReviewResponseDto>(
        `${REVIEWS_BASE}/${reviewId}`,
    );
    return response.data?.teamTitle ?? null;
}

export async function fetchReviewStageByReviewId(
    reviewId: number,
): Promise<ReviewStage> {
    const response = await apiClient.get<ReviewResponseDto>(
        `${REVIEWS_BASE}/${reviewId}`,
    );
    return response.data?.stage;
}

export async function fetchReviewByReportId(
    reportId: number,
): Promise<ReviewResponseDto | null> {
    const { data } = await apiClient.get<ReviewResponseDto[]>(REVIEWS_BASE, {
        params: {
            reportId,
        },
    });
    return data.length > 0 ? data.sort((a, b) => a.id - b.id)[0] : null;
}
