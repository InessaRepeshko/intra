import { fetchCompetenceTitleById } from '@entities/library/competence/api/competence.api';
import { fetchQuestionTemplatePositionCount } from '@entities/library/position-question-template-relation/api/position-question-template-relation.api';
import {
    mapQuestionTemplateDtoToModel,
    QuestionTemplate,
} from '@entities/library/question-template/model/mappers';
import type { QuestionTemplateFilterQuery } from '@entities/library/question-template/model/types';
import { fetchPositionTitlesByIds } from '@entities/organisation/position/api/position.api';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
    fetchQuestionTemplateById,
    fetchQuestionTemplates,
} from './question-template.api';

export type QuestionTemplatePositionTitles = {
    questionTemplateId: number;
    positions: { id: number; title: string }[];
};

export const questionTemplateKeys = {
    all: ['questionTemplates'] as const,
    lists: () => [...questionTemplateKeys.all, 'list'] as const,
    list: (filters?: QuestionTemplateFilterQuery) =>
        [...questionTemplateKeys.lists(), filters ?? {}] as const,
    details: () => [...questionTemplateKeys.all, 'detail'] as const,
    detail: (id: number) => [...questionTemplateKeys.details(), id] as const,
    positionCounts: () =>
        [...questionTemplateKeys.all, 'positionCounts'] as const,
    positionCount: (questionTemplateId: number) =>
        [...questionTemplateKeys.positionCounts(), questionTemplateId] as const,
    allPositionTitles: () =>
        [...questionTemplateKeys.all, 'allPositionTitles'] as const,
    positionTitles: (positionIds: number[]) =>
        [...questionTemplateKeys.allPositionTitles(), ...positionIds] as const,
    competenceTitles: () =>
        [...questionTemplateKeys.all, 'competenceTitles'] as const,
    competenceTitle: (competenceId: number) =>
        [...questionTemplateKeys.competenceTitles(), competenceId] as const,
};

export function useQuestionTemplatesQuery(
    params?: QuestionTemplateFilterQuery,
) {
    return useQuery<QuestionTemplate[]>({
        queryKey: questionTemplateKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchQuestionTemplates(params);
            return dtos.map(mapQuestionTemplateDtoToModel);
        },
    });
}

export function useQuestionTemplateQuery(id: number) {
    return useQuery<QuestionTemplate>({
        queryKey: questionTemplateKeys.detail(id),
        queryFn: async () => {
            const dto = await fetchQuestionTemplateById(id);
            return mapQuestionTemplateDtoToModel(dto);
        },
        enabled: id > 0,
    });
}

export function useQuestionTemplatePositionCountQuery(
    questionTemplateId: number,
) {
    return useQuery<number>({
        queryKey: questionTemplateKeys.positionCount(questionTemplateId),
        queryFn: () => fetchQuestionTemplatePositionCount(questionTemplateId),
        enabled: questionTemplateId > 0,
    });
}

export function useQuestionTemplatePositionCountsQuery(
    questionTemplateIds: number[],
) {
    const queries = useQueries({
        queries: questionTemplateIds.map((questionTemplateId) => ({
            queryKey: questionTemplateKeys.positionCount(questionTemplateId),
            queryFn: () =>
                fetchQuestionTemplatePositionCount(questionTemplateId),
        })),
    });

    const positionCounts: Record<number, number> = {};
    questionTemplateIds.forEach((questionTemplateId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            positionCounts[questionTemplateId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { positionCounts, isLoading };
}

export function useQuestionTemplatePositionTitlesQuery(positionIds: number[]) {
    return useQuery<{ id: number; title: string }[]>({
        queryKey: questionTemplateKeys.positionTitles(positionIds),
        queryFn: () => fetchPositionTitlesByIds(positionIds),
        enabled: positionIds.length > 0,
    });
}

export function useQuestionTemplateAllPositionTitlesQuery(
    questionTemplatesWithPositionIds: {
        questionTemplateId: number;
        positionIds: number[];
    }[],
) {
    questionTemplatesWithPositionIds.forEach((questionTemplate) => {
        questionTemplate.positionIds = Array.from(
            new Set(questionTemplate.positionIds),
        );
    });

    const queries = useQueries({
        queries: questionTemplatesWithPositionIds.map((questionTemplateId) => ({
            queryKey: questionTemplateKeys.positionTitles(
                questionTemplateId.positionIds,
            ),
            queryFn: () =>
                fetchPositionTitlesByIds(questionTemplateId.positionIds),
        })),
    });

    const positionTitles: Record<number, { id: number; title: string }[]> = {};

    questionTemplatesWithPositionIds.forEach((questionTemplate, index) => {
        const result = queries[index];
        positionTitles[questionTemplate.questionTemplateId] =
            result.isSuccess && result.data ? result.data : [];
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { positionTitles, isLoading };
}

export function useQuestionTemplateCompetenceTitleQuery(competenceId: number) {
    return useQuery<string>({
        queryKey: questionTemplateKeys.competenceTitle(competenceId),
        queryFn: () => fetchCompetenceTitleById(competenceId),
        enabled: competenceId > 0,
    });
}

export function useQuestionTemplateCompetenceTitlesQuery(
    competenceIds: number[],
) {
    const queries = useQueries({
        queries: competenceIds.map((competenceId) => ({
            queryKey: questionTemplateKeys.competenceTitle(competenceId),
            queryFn: () => fetchCompetenceTitleById(competenceId),
        })),
    });

    const competenceTitles: Record<number, string> = {};
    competenceIds.forEach((competenceId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            competenceTitles[competenceId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { competenceTitles, isLoading };
}
