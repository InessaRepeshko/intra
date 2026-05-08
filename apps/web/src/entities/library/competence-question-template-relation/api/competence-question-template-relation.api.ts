import { apiClient } from '@shared/api/api-client';

const QUESTION_TEMPLATE_COMPETENCE_RELATION_BASE = (
    questionTemplateId: number,
) => `/library/question-templates/${questionTemplateId}/competences`;

const COMPETENCE_QUESTION_TEMPLATE_RELATION_BASE = (competenceId: number) =>
    `/library/competences/${competenceId}/question-templates`;

export async function fetchQuestionTemplateCompetences(
    questionTemplateId: number,
): Promise<number[]> {
    const { data } = await apiClient.get<number[]>(
        `${QUESTION_TEMPLATE_COMPETENCE_RELATION_BASE(questionTemplateId)}`,
    );
    return data;
}

export async function linkCompetenceToQuestionTemplate(
    questionTemplateId: number,
    competenceId: number,
): Promise<number[]> {
    const { data } = await apiClient.post<number[]>(
        `${QUESTION_TEMPLATE_COMPETENCE_RELATION_BASE(questionTemplateId)}`,
        { competenceId },
    );
    return data;
}

export async function unlinkCompetenceFromQuestionTemplate(
    questionTemplateId: number,
    competenceId: number,
): Promise<void> {
    await apiClient.delete(
        `${QUESTION_TEMPLATE_COMPETENCE_RELATION_BASE(questionTemplateId)}/${competenceId}`,
    );
}

export async function fetchCompetenceQuestionTemplates(
    competenceId: number,
): Promise<number[]> {
    const { data } = await apiClient.get<number[]>(
        `${COMPETENCE_QUESTION_TEMPLATE_RELATION_BASE(competenceId)}`,
    );
    return data;
}

export async function fetchCompetenceQuestionTemplateCount(
    competenceId: number,
): Promise<number> {
    const data = await fetchCompetenceQuestionTemplates(competenceId);
    return data.length;
}

export async function linkQuestionTemplateToCompetence(
    competenceId: number,
    questionTemplateId: number,
): Promise<number[]> {
    const { data } = await apiClient.post<number[]>(
        `${COMPETENCE_QUESTION_TEMPLATE_RELATION_BASE(competenceId)}`,
        { questionTemplateId },
    );
    return data;
}

export async function unlinkQuestionTemplateFromCompetence(
    competenceId: number,
    questionTemplateId: number,
): Promise<void> {
    await apiClient.delete(
        `${COMPETENCE_QUESTION_TEMPLATE_RELATION_BASE(competenceId)}/${questionTemplateId}`,
    );
}
