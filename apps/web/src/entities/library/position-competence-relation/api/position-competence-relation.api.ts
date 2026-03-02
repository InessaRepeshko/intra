import { apiClient } from '@shared/api/api-client';

const POSITION_COMPETENCE_RELATION_BASE = (competenceId: number) =>
    `/library/competences/${competenceId}/positions`;

export async function fetchCompetencePositions(
    competenceId: number,
): Promise<number[]> {
    const { data } = await apiClient.get<number[]>(
        `${POSITION_COMPETENCE_RELATION_BASE(competenceId)}`,
    );
    return data;
}

export async function fetchCompetencePositionCount(
    competenceId: number,
): Promise<number> {
    const data = await fetchCompetencePositions(competenceId);
    return data.length;
}

export async function linkCompetenceToPosition(
    competenceId: number,
    positionId: number,
): Promise<number[]> {
    const { data } = await apiClient.post<number[]>(
        `${POSITION_COMPETENCE_RELATION_BASE(competenceId)}`,
        { positionId },
    );
    return data;
}

export async function unlinkCompetenceFromPosition(
    competenceId: number,
    positionId: number,
): Promise<void> {
    await apiClient.delete(
        `${POSITION_COMPETENCE_RELATION_BASE(competenceId)}/${positionId}`,
    );
}
