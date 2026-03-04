import type {
    CompetenceFilterQuery,
    CompetenceResponseDto,
    CreateCompetencePayload,
    UpdateCompetencePayload,
} from '@entities/library/competence/model/types';
import { apiClient } from '@shared/api/api-client';

const COMPETENCES_BASE = '/library/competences';

export async function fetchCompetences(
    params?: CompetenceFilterQuery,
): Promise<CompetenceResponseDto[]> {
    const { data } = await apiClient.get<CompetenceResponseDto[]>(
        COMPETENCES_BASE,
        {
            params,
        },
    );
    return data;
}

export async function fetchCompetenceById(
    id: number,
): Promise<CompetenceResponseDto> {
    const { data } = await apiClient.get<CompetenceResponseDto>(
        `${COMPETENCES_BASE}/${id}`,
    );
    return data;
}

export async function createCompetence(
    payload: CreateCompetencePayload,
): Promise<CompetenceResponseDto> {
    const { data } = await apiClient.post<CompetenceResponseDto>(
        COMPETENCES_BASE,
        payload,
    );
    return data;
}

export async function updateCompetence(
    id: number,
    payload: UpdateCompetencePayload,
): Promise<CompetenceResponseDto> {
    const { data } = await apiClient.patch<CompetenceResponseDto>(
        `${COMPETENCES_BASE}/${id}`,
        payload,
    );
    return data;
}

export async function deleteCompetence(id: number): Promise<void> {
    await apiClient.delete(`${COMPETENCES_BASE}/${id}`);
}

export async function fetchCompetenceTitleById(
    competenceId: number,
): Promise<string> {
    const response = await apiClient.get<CompetenceResponseDto>(
        `${COMPETENCES_BASE}/${competenceId}`,
    );
    return response.data?.title;
}

export async function fetchCompetenceTitlesByIds(
    competenceIds: number[],
): Promise<{ id: number; title: string }[]> {
    const uniqueIds = Array.from(new Set(competenceIds));

    const data = await Promise.all(
        uniqueIds.map(async (competenceId) => {
            const title = await fetchCompetenceTitleById(competenceId);
            return { id: competenceId, title };
        }),
    );

    const competences: { id: number; title: string }[] = data.sort((a, b) =>
        a.title.localeCompare(b.title),
    );
    return competences;
}
