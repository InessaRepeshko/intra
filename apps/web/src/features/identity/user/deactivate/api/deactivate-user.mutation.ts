import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { updateUser } from '@entities/identity/user/api/user.api';
import { userKeys } from '@entities/identity/user/api/user.queries';
import { IdentityStatus } from '@entities/identity/user/model/types';

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

export function useDeactivateUserMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            updateUser(id, { status: IdentityStatus.INACTIVE }),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
            toast.success('User deactivated successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to deactivate user'),
            );
        },
    });
}
