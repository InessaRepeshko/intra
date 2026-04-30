import type {
    ReviewQuestionRelationFilterQuery,
    ReviewQuestionRelationResponseDto,
} from '@entities/feedback360/survey/model/types';
import { apiClient } from '@shared/api/api-client';

const QUESTIONS_BASE = (reviewId: number) =>
    `/feedback360/reviews/${reviewId}/questions`;

export async function fetchReviewQuestions(
    reviewId: number,
    params?: ReviewQuestionRelationFilterQuery,
): Promise<ReviewQuestionRelationResponseDto[]> {
    const { data } = await apiClient.get<ReviewQuestionRelationResponseDto[]>(
        `${QUESTIONS_BASE(reviewId)}`,
        { params },
    );
    return data;
}

export async function fetchReviewQuestionCount(
    reviewId: number,
    params?: ReviewQuestionRelationFilterQuery,
): Promise<number> {
    const questions = await fetchReviewQuestions(reviewId, params);
    return questions.length;
}

export async function addQuestionToReview(
    reviewId: number,
    questionTemplateId: number,
): Promise<void> {
    await apiClient.post(`${QUESTIONS_BASE(reviewId)}`, { questionTemplateId });
}

export async function removeQuestionFromReview(
    reviewId: number,
    questionId: number,
): Promise<void> {
    await apiClient.delete(`${QUESTIONS_BASE(reviewId)}/${questionId}`);
}
