import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { competenceKeys } from '@entities/library/competence/api/competence.queries';
import {
    linkCompetenceToPosition,
    unlinkCompetenceFromPosition,
} from '@entities/library/position-competence-relation/api/position-competence-relation.api';
import {
    createPosition,
    updatePosition,
} from '@entities/organisation/position/api/position.api';
import { positionKeys } from '@entities/organisation/position/api/position.queries';
import type {
    CreatePositionPayload,
    UpdatePositionPayload,
} from '@entities/organisation/position/model/types';

import type { PositionFormValues } from '../model/position-form.schema';

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

function invalidatePositionQueries(
    queryClient: ReturnType<typeof useQueryClient>,
    positionId?: number,
) {
    queryClient.invalidateQueries({ queryKey: positionKeys.lists() });
    if (positionId) {
        queryClient.invalidateQueries({
            queryKey: positionKeys.detail(positionId),
        });
        queryClient.invalidateQueries({
            queryKey: positionKeys.competenceIds(positionId),
        });
    }
    queryClient.invalidateQueries({
        queryKey: positionKeys.allCompetenceIds(),
    });
    queryClient.invalidateQueries({
        queryKey: positionKeys.allCompetenceTitles(),
    });
    queryClient.invalidateQueries({ queryKey: competenceKeys.lists() });
}

export function useCreatePositionFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: PositionFormValues) => {
            const payload: CreatePositionPayload = {
                title: values.title,
                description: values.description ? values.description : null,
            };
            const created = await createPosition(payload);

            const competenceIds = values.competenceIds ?? [];
            if (competenceIds.length > 0) {
                await Promise.all(
                    competenceIds.map((competenceId) =>
                        linkCompetenceToPosition(competenceId, created.id),
                    ),
                );
            }

            return created;
        },
        onSuccess: (data) => {
            invalidatePositionQueries(queryClient, data.id);
            toast.success('Position created successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to create position'),
            );
        },
    });
}

export function useUpdatePositionFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            values,
            originalCompetenceIds,
        }: {
            id: number;
            values: PositionFormValues;
            originalCompetenceIds: number[];
        }) => {
            const payload: UpdatePositionPayload = {
                title: values.title,
                description: values.description ? values.description : null,
            };
            const updated = await updatePosition(id, payload);

            const nextCompetenceIds = values.competenceIds ?? [];
            const original = new Set(originalCompetenceIds);
            const next = new Set(nextCompetenceIds);
            const toLink = nextCompetenceIds.filter(
                (cid) => !original.has(cid),
            );
            const toUnlink = originalCompetenceIds.filter(
                (cid) => !next.has(cid),
            );

            await Promise.all([
                ...toLink.map((competenceId) =>
                    linkCompetenceToPosition(competenceId, id),
                ),
                ...toUnlink.map((competenceId) =>
                    unlinkCompetenceFromPosition(competenceId, id),
                ),
            ]);

            return updated;
        },
        onSuccess: (_data, variables) => {
            invalidatePositionQueries(queryClient, variables.id);
            toast.success('Position updated successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to update position'),
            );
        },
    });
}
