import type {
    AnswerFilterQuery,
    AnswerResponseDto,
    CreateAnswerToReviewPayload,
} from '@entities/feedback360/answer/model/types';
import { apiClient } from '@shared/api/api-client';

const ANSWERS_BASE = (reviewId: number) =>
    `/feedback360/reviews/${reviewId}/answers`;

export async function fetchReviewAnswers(
    reviewId: number,
    params?: AnswerFilterQuery,
): Promise<AnswerResponseDto[]> {
    const { data } = await apiClient.get<AnswerResponseDto[]>(
        `${ANSWERS_BASE(reviewId)}`,
        {
            params,
        },
    );
    return data;
}

export async function fetchReviewAnswerCount(
    reviewId: number,
): Promise<number> {
    const { data } = await apiClient.get<number>(
        `${ANSWERS_BASE(reviewId)}/count`,
    );

    return data;
}

export async function createAnswerToReview(
    reviewId: number,
    payload: CreateAnswerToReviewPayload,
): Promise<AnswerResponseDto> {
    const { data } = await apiClient.post<AnswerResponseDto>(
        `${ANSWERS_BASE(reviewId)}`,
        payload,
    );
    return data;
}
