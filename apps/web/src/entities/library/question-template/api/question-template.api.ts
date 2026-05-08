import type {
    CreateQuestionTemplatePayload,
    QuestionTemplateFilterQuery,
    QuestionTemplateResponseDto,
    UpdateQuestionTemplatePayload,
} from '@entities/library/question-template/model/types';
import { apiClient } from '@shared/api/api-client';

const QUESTION_TEMPLATE_BASE = '/library/question-templates';
const POSITION_QUESTION_TEMPLATE_RELATION_BASE = (questionTemplateId: number) =>
    `/library/question-templates/${questionTemplateId}/positions`;

export async function fetchQuestionTemplates(
    params?: QuestionTemplateFilterQuery,
): Promise<QuestionTemplateResponseDto[]> {
    const { data } = await apiClient.get<QuestionTemplateResponseDto[]>(
        QUESTION_TEMPLATE_BASE,
        {
            params,
        },
    );
    return data;
}

export async function fetchQuestionTemplateById(
    id: number,
): Promise<QuestionTemplateResponseDto> {
    const { data } = await apiClient.get<QuestionTemplateResponseDto>(
        `${QUESTION_TEMPLATE_BASE}/${id}`,
    );
    return data;
}

export async function createQuestionTemplate(
    payload: CreateQuestionTemplatePayload,
): Promise<QuestionTemplateResponseDto> {
    const { data } = await apiClient.post<QuestionTemplateResponseDto>(
        QUESTION_TEMPLATE_BASE,
        payload,
    );
    return data;
}

export async function updateQuestionTemplate(
    id: number,
    payload: UpdateQuestionTemplatePayload,
): Promise<QuestionTemplateResponseDto> {
    const { data } = await apiClient.patch<QuestionTemplateResponseDto>(
        `${QUESTION_TEMPLATE_BASE}/${id}`,
        payload,
    );
    return data;
}

export async function deleteQuestionTemplate(id: number): Promise<void> {
    await apiClient.delete(`${QUESTION_TEMPLATE_BASE}/${id}`);
}
