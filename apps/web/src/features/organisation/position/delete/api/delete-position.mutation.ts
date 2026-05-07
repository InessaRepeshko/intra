import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { deletePosition } from '@entities/organisation/position/api/position.api';
import { positionKeys } from '@entities/organisation/position/api/position.queries';

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

export function useDeletePositionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deletePosition(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: positionKeys.lists(),
            });
            toast.success('Position deleted successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to delete position'),
            );
        },
    });
}
