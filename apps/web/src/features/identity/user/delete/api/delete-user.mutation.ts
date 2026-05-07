import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { deleteUser } from '@entities/identity/user/api/user.api';
import { userKeys } from '@entities/identity/user/api/user.queries';

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

export function useDeleteUserMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() });
            toast.success('User deleted successfully');
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error, 'Failed to delete user'));
        },
    });
}
