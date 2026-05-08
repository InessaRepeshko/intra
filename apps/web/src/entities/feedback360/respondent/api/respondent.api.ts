import {
    type AddRespondentToReviewPayload,
<<<<<<< HEAD
=======
    type RespondentCategory,
>>>>>>> main
    type RespondentDto,
    type RespondentFilterQuery,
    type ResponseStatus,
    type UpdateRespondentPayload,
<<<<<<< HEAD
=======
    RESPONDENT_CATEGORIES_ENUM_VALUES,
>>>>>>> main
} from '@entities/feedback360/respondent/model/types';
import { apiClient } from '@shared/api/api-client';

const RESPONDENTS_BASE = (reviewId: number) =>
    `/feedback360/reviews/${reviewId}/respondents`;
const RESPONDENT_RELATION_BASE = (relationId: number) =>
    `/feedback360/reviews/respondents/${relationId}`;

export async function fetchReviewRespondents(
    reviewId: number,
    params?: RespondentFilterQuery,
): Promise<RespondentDto[]> {
    const { data } = await apiClient.get<RespondentDto[]>(
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
    const { data } = await apiClient.get<RespondentDto[]>(
        `${RESPONDENTS_BASE(reviewId)}`,
    );
    return data.length;
}

export async function addRespondentToReview(
    reviewId: number,
    payload: AddRespondentToReviewPayload,
): Promise<RespondentDto> {
    const { data } = await apiClient.post<RespondentDto>(
        `${RESPONDENTS_BASE(reviewId)}`,
        payload,
    );
    return data;
}

export async function updateReviewRespondent(
    relationId: number,
    payload: UpdateRespondentPayload,
): Promise<RespondentDto> {
    const { data } = await apiClient.patch<RespondentDto>(
        `${RESPONDENT_RELATION_BASE(relationId)}`,
        payload,
    );
    return data;
}

export async function updateReviewResponseStatus(
    relationId: number,
    status: ResponseStatus,
): Promise<RespondentDto> {
    const { data } = await apiClient.patch<RespondentDto>(
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
<<<<<<< HEAD
=======

export async function fetchRespondentCategoriesByReviewId(
    reviewId: number,
): Promise<RespondentCategory[]> {
    const { data } = await apiClient.get<RespondentDto[]>(
        `${RESPONDENTS_BASE(reviewId)}`,
    );

    const categories: RespondentCategory[] = data
        .map((respondent) => respondent.category)
        .sort(
            (a, b) =>
                RESPONDENT_CATEGORIES_ENUM_VALUES.indexOf(a) -
                RESPONDENT_CATEGORIES_ENUM_VALUES.indexOf(b),
        );
    return [...new Set(categories)];
}
>>>>>>> main
