import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { userKeys } from '@entities/identity/user/api/user.queries';
import {
    addTeamMember,
    deleteTeamMember,
} from '@entities/organisation/team-member/api/team-member.api';
import { teamMemberKeys } from '@entities/organisation/team-member/api/team-member.queries';
import {
    createTeam,
    updateTeam,
} from '@entities/organisation/team/api/team.api';
import { teamKeys } from '@entities/organisation/team/api/team.queries';
import type {
    CreateTeamPayload,
    UpdateTeamPayload,
} from '@entities/organisation/team/model/types';

import type { TeamFormValues } from '../model/team-form.schema';

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

function toHeadIdValue(headId: number | undefined): number | null {
    if (headId === undefined || headId === null) return null;
    if (headId <= 0) return null;
    return headId;
}

export function useCreateTeamFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: TeamFormValues) => {
            const payload: CreateTeamPayload = {
                title: values.title,
                description: values.description ? values.description : null,
                headId: toHeadIdValue(values.headId),
            };
            const team = await createTeam(payload);

            const memberIds = values.memberIds ?? [];
            if (memberIds.length > 0) {
                await Promise.all(
                    memberIds.map((memberId) =>
                        addTeamMember(team.id, { memberId }),
                    ),
                );
            }

            return team;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: teamKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: teamKeys.users(data.id),
            });
            queryClient.invalidateQueries({
                queryKey: teamMemberKeys.users(data.id),
            });
            queryClient.invalidateQueries({
                queryKey: userKeys.lists(),
            });
            toast.success('Team created successfully');
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error, 'Failed to create team'));
        },
    });
}

export function useUpdateTeamFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            values,
            originalMemberIds,
        }: {
            id: number;
            values: TeamFormValues;
            originalMemberIds: number[];
        }) => {
            const payload: UpdateTeamPayload = {
                title: values.title,
                description: values.description ? values.description : null,
                headId: toHeadIdValue(values.headId),
            };
            const updated = await updateTeam(id, payload);

            const nextMemberIds = values.memberIds ?? [];
            const original = new Set(originalMemberIds);
            const next = new Set(nextMemberIds);
            const toAdd = nextMemberIds.filter((mid) => !original.has(mid));
            const toRemove = originalMemberIds.filter((mid) => !next.has(mid));

            await Promise.all([
                ...toAdd.map((memberId) => addTeamMember(id, { memberId })),
                ...toRemove.map((memberId) => deleteTeamMember(id, memberId)),
            ]);

            return updated;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: teamKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: teamKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: teamKeys.users(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: teamMemberKeys.users(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: userKeys.lists(),
            });
            toast.success('Team updated successfully');
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error, 'Failed to update team'));
        },
    });
}
