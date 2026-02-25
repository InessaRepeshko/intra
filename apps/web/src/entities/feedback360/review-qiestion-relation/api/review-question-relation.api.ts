import type {
    ReviewQuestionRelationDto,
    ReviewQuestionRelationFilterQuery,
} from '@entities/feedback360/review-qiestion-relation/model/types';
import { apiClient } from '@shared/api/api-client';

const QUESTIONS_BASE = (reviewId: number) =>
    `/feedback360/reviews/${reviewId}/questions`;

export async function fetchReviewQuestions(
    reviewId: number,
    params?: ReviewQuestionRelationFilterQuery,
): Promise<ReviewQuestionRelationDto[]> {
    const { data } = await apiClient.get<ReviewQuestionRelationDto[]>(
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
