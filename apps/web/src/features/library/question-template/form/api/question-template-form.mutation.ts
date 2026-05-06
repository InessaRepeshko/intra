import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { competenceKeys } from '@entities/library/competence/api/competence.queries';
import {
    linkPositionToQuestionTemplate,
    unlinkPositionFromQuestionTemplate,
} from '@entities/library/position-question-template-relation/api/position-question-template-relation.api';
import {
    createQuestionTemplate,
    updateQuestionTemplate,
} from '@entities/library/question-template/api/question-template.api';
import { questionTemplateKeys } from '@entities/library/question-template/api/question-template.queries';
import type {
    CreateQuestionTemplatePayload,
    UpdateQuestionTemplatePayload,
} from '@entities/library/question-template/model/types';

import type { QuestionTemplateFormValues } from '../model/question-template-form.schema';

function extractApiErrorMessage(error: unknown, fallback: string): string {
    if (isAxiosError(error)) {
        const data = error.response?.data as
            | { message?: string | string[] }
            | undefined;
        const message = data?.message;
        if (Array.isArray(message) && message.length > 0) {
            return message.join('; ');
        }
        if (typeof message === 'string' && message.trim().length > 0) {
            return message;
        }
    }
    return fallback;
}

export function useCreateQuestionTemplateFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: QuestionTemplateFormValues) => {
            const payload: CreateQuestionTemplatePayload = {
                title: values.title,
                competenceId: values.competenceId,
                answerType: values.answerType,
                isForSelfassessment: values.isForSelfassessment,
                status: values.status,
                positionIds: values.positionIds,
            };
            return createQuestionTemplate(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: questionTemplateKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: questionTemplateKeys.positionCounts(),
            });
            queryClient.invalidateQueries({
                queryKey: competenceKeys.questionTemplates(),
            });
            queryClient.invalidateQueries({
                queryKey: competenceKeys.questionTemplateCounts(),
            });
            toast.success('Question template created successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(
                    error,
                    'Failed to create question template',
                ),
            );
        },
    });
}

export function useUpdateQuestionTemplateFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            values,
            originalPositionIds,
        }: {
            id: number;
            values: QuestionTemplateFormValues;
            originalPositionIds: number[];
        }) => {
            const payload: UpdateQuestionTemplatePayload = {
                title: values.title,
                competenceId: values.competenceId,
                answerType: values.answerType,
                isForSelfassessment: values.isForSelfassessment,
                status: values.status,
            };

            const updated = await updateQuestionTemplate(id, payload);

            const original = new Set(originalPositionIds);
            const next = new Set(values.positionIds);
            const toLink = values.positionIds.filter(
                (pid) => !original.has(pid),
            );
            const toUnlink = originalPositionIds.filter(
                (pid) => !next.has(pid),
            );

            await Promise.all([
                ...toLink.map((positionId) =>
                    linkPositionToQuestionTemplate(id, positionId),
                ),
                ...toUnlink.map((positionId) =>
                    unlinkPositionFromQuestionTemplate(id, positionId),
                ),
            ]);

            return updated;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: questionTemplateKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: questionTemplateKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: questionTemplateKeys.positionCounts(),
            });
            queryClient.invalidateQueries({
                queryKey: competenceKeys.questionTemplates(),
            });
            queryClient.invalidateQueries({
                queryKey: competenceKeys.questionTemplateCounts(),
            });
            toast.success('Question template updated successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(
                    error,
                    'Failed to update question template',
                ),
            );
        },
    });
}
