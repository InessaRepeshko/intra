import {
    fetchCompetenceQuestionTemplateCount,
    fetchCompetenceQuestionTemplates,
} from '@entities/library/competence-question-template-relation/api/competence-question-template-relation.api';
import {
    Competence,
    mapCompetenceDtoToModel,
} from '@entities/library/competence/model/mappers';
import { CompetenceFilterQuery } from '@entities/library/competence/model/types';
import {
    fetchCompetencePositionCount,
    fetchCompetencePositions,
} from '@entities/library/position-competence-relation/api/position-competence-relation.api';
import { fetchPositionTitlesByIds } from '@entities/organisation/position/api/position.api';
import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchCompetenceById, fetchCompetences } from './competence.api';

export const competenceKeys = {
    all: ['competences'] as const,
    lists: () => [...competenceKeys.all, 'lists'] as const,
    list: (filters?: CompetenceFilterQuery) =>
        [...competenceKeys.lists(), filters ?? {}] as const,
    details: () => [...competenceKeys.all, 'details'] as const,
    detail: (id: number) => [...competenceKeys.details(), id] as const,
    positionCounts: () => [...competenceKeys.all, 'positionCounts'] as const,
    positionCount: (competenceId: number) =>
        [...competenceKeys.positionCounts(), competenceId] as const,
    allPositionTitles: () =>
        [...competenceKeys.all, 'allPositionTitles'] as const,
    positionTitles: (positionIds: number[]) =>
        [...competenceKeys.allPositionTitles(), ...positionIds] as const,
    allPositionIds: () => [...competenceKeys.all, 'allPositionIds'] as const,
    positionIds: (competenceId: number) =>
        [...competenceKeys.allPositionIds(), competenceId] as const,
    questionTemplates: () =>
        [...competenceKeys.all, 'questionTemplates'] as const,
    questionTemplate: (competenceId: number) =>
        [...competenceKeys.questionTemplates(), competenceId] as const,
    questionTemplateCounts: () =>
        [...competenceKeys.all, 'questionTemplateCounts'] as const,
    questionTemplateCount: (competenceId: number) =>
        [...competenceKeys.questionTemplateCounts(), competenceId] as const,
};

export function useCompetencesQuery(params?: CompetenceFilterQuery) {
    return useQuery<Competence[]>({
        queryKey: competenceKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchCompetences(params);
            return dtos.map(mapCompetenceDtoToModel);
        },
    });
}

export function useCompetenceQuery(id: number) {
    return useQuery<Competence>({
        queryKey: competenceKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchCompetenceById(id);
            return mapCompetenceDtoToModel(dto);
        },
        enabled: id > 0,
    });
}

export function useCompetencePositionCountQuery(competenceId: number) {
    return useQuery<number>({
        queryKey: competenceKeys.positionCount(competenceId),
        queryFn: () => fetchCompetencePositionCount(competenceId),
        enabled: competenceId > 0,
    });
}

export function useCompetencePositionCountsQuery(competenceIds: number[]) {
    const queries = useQueries({
        queries: competenceIds.map((competenceId) => ({
            queryKey: competenceKeys.positionCount(competenceId),
            queryFn: () => fetchCompetencePositionCount(competenceId),
        })),
    });

    const positionCounts: Record<number, number> = {};
    competenceIds.forEach((competenceId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            positionCounts[competenceId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { positionCounts, isLoading };
}

export function useCompetencePositionIdsQuery(competenceId: number) {
    return useQuery<number[]>({
        queryKey: competenceKeys.positionIds(competenceId),
        queryFn: () => fetchCompetencePositions(competenceId),
        enabled: competenceId > 0,
    });
}

export function useCompetenceAllPositionIdsQuery(competenceIds: number[]) {
    const queries = useQueries({
        queries: competenceIds.map((competenceId) => ({
            queryKey: competenceKeys.positionIds(competenceId),
            queryFn: () => fetchCompetencePositions(competenceId),
        })),
    });

    const positionIds: Record<number, number[]> = {};
    competenceIds.forEach((competenceId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            positionIds[competenceId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { positionIds, isLoading };
}

export function useCompetencePositionTitlesQuery(positionIds: number[]) {
    return useQuery<{ id: number; title: string }[]>({
        queryKey: competenceKeys.positionTitles(positionIds),
        queryFn: () => fetchPositionTitlesByIds(positionIds),
        enabled: positionIds.length > 0,
    });
}

export function useCompetenceAllPositionTitlesQuery(
    competencesWithPositionIds: {
        competenceId: number;
        positionIds: number[];
    }[],
) {
    competencesWithPositionIds.forEach((competence) => {
        competence.positionIds = Array.from(new Set(competence.positionIds));
    });

    const queries = useQueries({
        queries: competencesWithPositionIds.map((competenceId) => ({
            queryKey: competenceKeys.positionTitles(competenceId.positionIds),
            queryFn: () => fetchPositionTitlesByIds(competenceId.positionIds),
        })),
    });

    const positionTitles: Record<number, { id: number; title: string }[]> = {};

    competencesWithPositionIds.forEach((competence, index) => {
        const result = queries[index];
        positionTitles[competence.competenceId] =
            result.isSuccess && result.data ? result.data : [];
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { positionTitles, isLoading };
}

export function useCompetenceQuestionTemplateIdsQuery(competenceId: number) {
    return useQuery<number[]>({
        queryKey: competenceKeys.questionTemplate(competenceId),
        queryFn: () => fetchCompetenceQuestionTemplates(competenceId),
        enabled: competenceId > 0,
    });
}

export function useCompetenceAllQuestionTemplateIdsQuery(
    competenceIds: number[],
) {
    const queries = useQueries({
        queries: competenceIds.map((competenceId) => ({
            queryKey: competenceKeys.questionTemplate(competenceId),
            queryFn: () => fetchCompetenceQuestionTemplates(competenceId),
        })),
    });

    const questionTemplateIds: Record<number, number[]> = {};
    competenceIds.forEach((competenceId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            questionTemplateIds[competenceId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { questionTemplateIds, isLoading };
}

export function useCompetenceQuestionTemplatesCountQuery(competenceId: number) {
    return useQuery<number>({
        queryKey: competenceKeys.questionTemplateCount(competenceId),
        queryFn: () => fetchCompetenceQuestionTemplateCount(competenceId),
        enabled: competenceId > 0,
    });
}

export function useCompetenceAllQuestionTemplateCountsQuery(
    competenceIds: number[],
) {
    const queries = useQueries({
        queries: competenceIds.map((competenceId) => ({
            queryKey: competenceKeys.questionTemplateCount(competenceId),
            queryFn: () => fetchCompetenceQuestionTemplateCount(competenceId),
        })),
    });

    const questionTemplateCounts: Record<number, number> = {};
    competenceIds.forEach((competenceId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            questionTemplateCounts[competenceId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { questionTemplateCounts, isLoading };
}
