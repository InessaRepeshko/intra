import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import {
    changeUserRoles,
    createUser,
    updateUser,
} from '@entities/identity/user/api/user.api';
import { userKeys } from '@entities/identity/user/api/user.queries';
import type {
    CreateUserPayload,
    IdentityRole,
    UpdateUserPayload,
} from '@entities/identity/user/model/types';
import { addTeamMember } from '@entities/organisation/team-member/api/team-member.api';
import { teamMemberKeys } from '@entities/organisation/team-member/api/team-member.queries';
import { teamKeys } from '@entities/organisation/team/api/team.queries';

import type { UserFormValues } from '../model/user-form.schema';

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

function toIdValue(id: number | undefined): number | null {
    if (id === undefined || id === null) return null;
    if (id <= 0) return null;
    return id;
}

function rolesEqual(a: IdentityRole[], b: IdentityRole[]): boolean {
    if (a.length !== b.length) return false;
    const setB = new Set(b);
    return a.every((r) => setB.has(r));
}

export function useCreateUserFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: UserFormValues) => {
            const teamId = toIdValue(values.teamId);
            const payload: CreateUserPayload = {
                firstName: values.firstName,
                lastName: values.lastName,
                secondName: values.secondName ? values.secondName : undefined,
                email: values.email,
                status: values.status,
                roles: values.roles as IdentityRole[],
                positionId: toIdValue(values.positionId),
                teamId,
                managerId: toIdValue(values.managerId),
            };
            const created = await createUser(payload);

            if (teamId) {
                await addTeamMember(teamId, { memberId: created.id });
            }

            return created;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            if (data.teamId) {
                queryClient.invalidateQueries({
                    queryKey: teamKeys.users(data.teamId),
                });
                queryClient.invalidateQueries({
                    queryKey: teamMemberKeys.users(data.teamId),
                });
            }
            toast.success('User created successfully');
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error, 'Failed to create user'));
        },
    });
}

export function useUpdateUserFormMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            values,
            originalRoles,
        }: {
            id: number;
            values: UserFormValues;
            originalRoles: IdentityRole[];
        }) => {
            const payload: UpdateUserPayload = {
                firstName: values.firstName,
                lastName: values.lastName,
                secondName: values.secondName ? values.secondName : null,
                status: values.status,
                positionId: toIdValue(values.positionId),
                teamId: toIdValue(values.teamId),
                managerId: toIdValue(values.managerId),
            };
            const updated = await updateUser(id, payload);

            const nextRoles = values.roles as IdentityRole[];
            if (!rolesEqual(originalRoles, nextRoles)) {
                await changeUserRoles(id, nextRoles);
            }

            return updated;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: userKeys.detail(variables.id),
            });
            toast.success('User updated successfully');
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error, 'Failed to update user'));
        },
    });
}
