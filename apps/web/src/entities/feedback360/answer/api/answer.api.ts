import type {
    AnswerDto,
    AnswerFilterQuery,
    CreateAnswerToReviewPayload,
} from '@entities/feedback360/answer/model/types';
import { apiClient } from '@shared/api/api-client';

const ANSWERS_BASE = (reviewId: number) =>
    `/feedback360/reviews/${reviewId}/answers`;

export async function fetchReviewAnswers(
    reviewId: number,
    params?: AnswerFilterQuery,
): Promise<AnswerDto[]> {
    const { data } = await apiClient.get<AnswerDto[]>(
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
    const { data } = await apiClient.get<AnswerDto[]>(
        `${ANSWERS_BASE(reviewId)}`,
    );

    const questionCounts = data.reduce(
        (acc, item) => {
            acc[item.questionId] = (acc[item.questionId] || 0) + 1;
            return acc;
        },
        {} as Record<number, number>,
    );

    const mostFrequentId = Object.values(questionCounts).reduce((a, b) =>
        questionCounts[a] > questionCounts[b] ? a : b,
    );

    return Number(mostFrequentId);
}

export async function createAnswerToReview(
    reviewId: number,
    payload: CreateAnswerToReviewPayload,
): Promise<AnswerDto> {
    const { data } = await apiClient.post<AnswerDto>(
        `${ANSWERS_BASE(reviewId)}`,
        payload,
    );
    return data;
}
