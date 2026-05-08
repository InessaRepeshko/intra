import type {
    AddReviewerToReviewPayload,
    ReviewerDto,
    ReviewerFilterQuery,
} from '@entities/feedback360/reviewer/model/types';
import { apiClient } from '@shared/api/api-client';

const REVIEWERS_BASE = (reviewId: number) =>
    `/feedback360/reviews/${reviewId}/reviewers`;
const REVIEWER_RELATION_BASE = (relationId: number) =>
    `/feedback360/reviews/reviewers/${relationId}`;

export async function fetchReviewReviewers(
    reviewId: number,
    params?: ReviewerFilterQuery,
): Promise<ReviewerDto[]> {
    const { data } = await apiClient.get<ReviewerDto[]>(
        `${REVIEWERS_BASE(reviewId)}`,
        {
            params,
        },
    );
    return data;
}

export async function fetchReviewReviewerCount(
    reviewId: number,
): Promise<number> {
    const { data } = await apiClient.get<ReviewerDto[]>(
        `${REVIEWERS_BASE(reviewId)}`,
    );
    return data.length;
}

export async function addReviewerToReview(
    reviewId: number,
    payload: AddReviewerToReviewPayload,
): Promise<ReviewerDto> {
    const { data } = await apiClient.post<ReviewerDto>(
        `${REVIEWERS_BASE(reviewId)}`,
        payload,
    );
    return data;
}

export async function deleteReviewReviewer(relationId: number): Promise<void> {
    await apiClient.delete<void>(`${REVIEWER_RELATION_BASE(relationId)}`);
}
