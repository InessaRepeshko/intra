import { apiClient } from '@shared/api/api-client';

const COMPETENCE_QUESTION_TEMPLATE_RELATION_BASE = (
    questionTemplateId: number,
) => `/library/question-templates/${questionTemplateId}/competences`;

export async function fetchQuestionTemplateCompetences(
    questionTemplateId: number,
): Promise<number[]> {
    const { data } = await apiClient.get<number[]>(
        `${COMPETENCE_QUESTION_TEMPLATE_RELATION_BASE(questionTemplateId)}`,
    );
    return data;
}

export async function linkCompetenceToQuestionTemplate(
    questionTemplateId: number,
    competenceId: number,
): Promise<number[]> {
    const { data } = await apiClient.post<number[]>(
        `${COMPETENCE_QUESTION_TEMPLATE_RELATION_BASE(questionTemplateId)}`,
        { competenceId },
    );
    return data;
}

export async function unlinkCompetenceFromQuestionTemplate(
    questionTemplateId: number,
    competenceId: number,
): Promise<void> {
    await apiClient.delete(
        `${COMPETENCE_QUESTION_TEMPLATE_RELATION_BASE(questionTemplateId)}/${competenceId}`,
    );
}
