import {
    AddRespondentToReviewPayload,
    RespondentResponseDto,
    RespondentFilterQuery,
    ResponseStatus,
    UpdateRespondentPayload,
} from '@entities/feedback360/respondent/model/types';
import { apiClient } from '@shared/api/api-client';

const RESPONDENTS_BASE = (reviewId: number) =>
    `/feedback360/reviews/${reviewId}/respondents`;
const RESPONDENT_RELATION_BASE = (relationId: number) =>
    `/feedback360/reviews/respondents/${relationId}`;

export async function fetchReviewRespondents(
    reviewId: number,
    params?: RespondentFilterQuery,
): Promise<RespondentResponseDto[]> {
    const { data } = await apiClient.get<RespondentResponseDto[]>(
        `${RESPONDENTS_BASE(reviewId)}`,
        {
            params,
        },
    );
    return data;
}

export async function fetchReviewRespondentCount(
    reviewId: number,
): Promise<number> {
    const { data } = await apiClient.get<RespondentResponseDto[]>(
        `${RESPONDENTS_BASE(reviewId)}`,
    );
    return data.length;
}

export async function addRespondentToReview(
    reviewId: number,
    payload: AddRespondentToReviewPayload,
): Promise<RespondentResponseDto> {
    const { data } = await apiClient.post<RespondentResponseDto>(
        `${RESPONDENTS_BASE(reviewId)}`,
        payload,
    );
    return data;
}

export async function updateReviewRespondent(
    relationId: number,
    payload: UpdateRespondentPayload,
): Promise<RespondentResponseDto> {
    const { data } = await apiClient.patch<RespondentResponseDto>(
        `${RESPONDENT_RELATION_BASE(relationId)}`,
        payload,
    );
    return data;
}

export async function updateReviewResponseStatus(
    relationId: number,
    status: ResponseStatus,
): Promise<RespondentResponseDto> {
    const { data } = await apiClient.patch<RespondentResponseDto>(
        `${RESPONDENT_RELATION_BASE(relationId)}`,
        { responseStatus: status },
    );
    return data;
}

export async function deleteReviewRespondent(
    relationId: number,
): Promise<void> {
    await apiClient.delete(`${RESPONDENT_RELATION_BASE(relationId)}`);
}
