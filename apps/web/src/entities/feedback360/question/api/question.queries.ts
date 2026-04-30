import {
    mapQuestionDtoToModel,
    Question,
} from '@entities/feedback360/question/model/mappers';
import { fetchReviewById } from '@entities/feedback360/review/api/review.api';
import {
    mapReviewDtoToModel,
    Review,
} from '@entities/feedback360/review/model/mappers';
import { fetchCompetenceById } from '@entities/library/competence/api/competence.api';
import {
    Competence,
    mapCompetenceDtoToModel,
} from '@entities/library/competence/model/mappers';
import { fetchQuestionTemplateById } from '@entities/library/question-template/api/question-template.api';
import {
    mapQuestionTemplateDtoToModel,
    QuestionTemplate,
} from '@entities/library/question-template/model/mappers';
import { useQueries, useQuery } from '@tanstack/react-query';
import { QuestionTemplateFilterQuery } from '../model/types';
import { fetchQuestions } from './question.api';

export const questionKeys = {
    all: ['questions'] as const,
    lists: () => [...questionKeys.all, 'list'] as const,
    list: (filters?: QuestionTemplateFilterQuery) =>
        [...questionKeys.lists(), filters ?? {}] as const,
    details: () => [...questionKeys.all, 'detail'] as const,
    detail: (id: number) => [...questionKeys.details(), id] as const,
    questionTemplates: () =>
        [...questionKeys.all, 'questionTemplates'] as const,
    questionTemplate: (questionTemplateId: number) =>
        [...questionKeys.questionTemplates(), questionTemplateId] as const,
    competences: () => [...questionKeys.all, 'competences'] as const,
    competence: (competenceId: number) =>
        [...questionKeys.competences(), competenceId] as const,
    reviews: () => [...questionKeys.all, 'reviews'] as const,
    review: (reviewId: number) =>
        [...questionKeys.reviews(), reviewId] as const,
};

export function useQuestionsQuery(params?: QuestionTemplateFilterQuery) {
    return useQuery<Question[]>({
        queryKey: questionKeys.list(params),
        queryFn: async () => {
            const dtos = await fetchQuestions(params);
            return dtos.map(mapQuestionDtoToModel);
        },
    });
}

export function useQuestionTemplateQuery(questionTemplateId: number) {
    return useQuery<QuestionTemplate>({
        queryKey: questionKeys.questionTemplate(questionTemplateId),
        queryFn: async () => {
            const dto = await fetchQuestionTemplateById(questionTemplateId);
            return mapQuestionTemplateDtoToModel(dto);
        },
        enabled: questionTemplateId > 0,
    });
}

export function useQuestionTemplatesQuery(questionTemplateIds: number[]) {
    const queries = useQueries({
        queries: questionTemplateIds.map((questionTemplateId) => ({
            queryKey: questionKeys.questionTemplate(questionTemplateId),
            queryFn: async () => {
                const dto = await fetchQuestionTemplateById(questionTemplateId);
                return mapQuestionTemplateDtoToModel(dto);
            },
        })),
    });

    const questionTemplates: Record<number, QuestionTemplate> = {};
    questionTemplateIds.forEach((questionTemplateId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            questionTemplates[questionTemplateId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { questionTemplates, isLoading };
}

export function useCompetenceQuery(competenceId: number) {
    return useQuery<Competence>({
        queryKey: questionKeys.competence(competenceId),
        queryFn: async () => {
            const dto = await fetchCompetenceById(competenceId);
            return mapCompetenceDtoToModel(dto);
        },
        enabled: competenceId > 0,
    });
}

export function useCompetencesQuery(competenceIds: number[]) {
    const queries = useQueries({
        queries: competenceIds.map((competenceId) => ({
            queryKey: questionKeys.competence(competenceId),
            queryFn: async () => {
                const dto = await fetchCompetenceById(competenceId);
                return mapCompetenceDtoToModel(dto);
            },
        })),
    });

    const competences: Record<number, Competence> = {};
    competenceIds.forEach((competenceId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            competences[competenceId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { competences, isLoading };
}

export function useReviewQuery(reviewId: number) {
    return useQuery<Review>({
        queryKey: questionKeys.review(reviewId),
        queryFn: async () => {
            const dto = await fetchReviewById(reviewId);
            return mapReviewDtoToModel(dto);
        },
        enabled: reviewId > 0,
    });
}

export function useReviewsQuery(reviewIds: number[]) {
    const queries = useQueries({
        queries: reviewIds.map((reviewId) => ({
            queryKey: questionKeys.review(reviewId),
            queryFn: async () => {
                const dto = await fetchReviewById(reviewId);
                return mapReviewDtoToModel(dto);
            },
        })),
    });

    const reviews: Record<number, Review> = {};
    reviewIds.forEach((reviewId, index) => {
        const result = queries[index];
        if (result.isSuccess && result.data !== undefined) {
            reviews[reviewId] = result.data;
        }
    });

    const isLoading = queries.some((q) => q.isLoading);

    return { reviews, isLoading };
}
