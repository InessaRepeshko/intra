import { apiClient } from '@shared/api/api-client';

const POSITION_QUESTION_TEMPLATE_RELATION_BASE = (questionTemplateId: number) =>
    `/library/question-templates/${questionTemplateId}/positions`;

export async function fetchQuestionTemplatePositions(
    questionTemplateId: number,
): Promise<number[]> {
    const { data } = await apiClient.get<number[]>(
        `${POSITION_QUESTION_TEMPLATE_RELATION_BASE(questionTemplateId)}`,
    );
    return data;
}

export async function fetchQuestionTemplatePositionCount(
    questionTemplateId: number,
): Promise<number> {
    const data = await fetchQuestionTemplatePositions(questionTemplateId);
    return data.length;
}

export async function linkPositionToQuestionTemplate(
    questionTemplateId: number,
    positionId: number,
): Promise<number[]> {
    const { data } = await apiClient.post<number[]>(
        `${POSITION_QUESTION_TEMPLATE_RELATION_BASE(questionTemplateId)}`,
        { positionId },
    );
    return data;
}

export async function unlinkPositionFromQuestionTemplate(
    questionTemplateId: number,
    positionId: number,
): Promise<void> {
    await apiClient.delete(
        `${POSITION_QUESTION_TEMPLATE_RELATION_BASE(questionTemplateId)}/${positionId}`,
    );
}
