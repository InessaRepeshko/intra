import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import {
    createCompetence,
    updateCompetence,
} from '@entities/library/competence/api/competence.api';
import { competenceKeys } from '@entities/library/competence/api/competence.queries';
import type {
    CreateCompetencePayload,
    UpdateCompetencePayload,
} from '@entities/library/competence/model/types';
import {
    linkCompetenceToPosition,
    unlinkCompetenceFromPosition,
} from '@entities/library/position-competence-relation/api/position-competence-relation.api';
import { questionTemplateKeys } from '@entities/library/question-template/api/question-template.queries';

import type { CompetenceFormValues } from '../model/competence-form.schema';

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

export function useCreateCompetenceFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: CompetenceFormValues) => {
            const payload: CreateCompetencePayload = {
                title: values.title,
                code: values.code ? values.code : null,
                description: values.description ? values.description : null,
            };

            const created = await createCompetence(payload);

            if (values.positionIds.length > 0) {
                await Promise.all(
                    values.positionIds.map((positionId) =>
                        linkCompetenceToPosition(created.id, positionId),
                    ),
                );
            }

            return created;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: competenceKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: competenceKeys.positionCounts(),
            });
            queryClient.invalidateQueries({
                queryKey: competenceKeys.allPositionIds(),
            });
            toast.success('Competence created successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to create competence'),
            );
        },
    });
}

export function useUpdateCompetenceFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            values,
            originalPositionIds,
        }: {
            id: number;
            values: CompetenceFormValues;
            originalPositionIds: number[];
        }) => {
            const payload: UpdateCompetencePayload = {
                title: values.title,
                code: values.code ? values.code : null,
                description: values.description ? values.description : null,
            };

            const updated = await updateCompetence(id, payload);

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
                    linkCompetenceToPosition(id, positionId),
                ),
                ...toUnlink.map((positionId) =>
                    unlinkCompetenceFromPosition(id, positionId),
                ),
            ]);

            return updated;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: competenceKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: competenceKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: competenceKeys.positionCounts(),
            });
            queryClient.invalidateQueries({
                queryKey: competenceKeys.allPositionIds(),
            });
            queryClient.invalidateQueries({
                queryKey: questionTemplateKeys.competenceTitles(),
            });
            toast.success('Competence updated successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to update competence'),
            );
        },
    });
}
