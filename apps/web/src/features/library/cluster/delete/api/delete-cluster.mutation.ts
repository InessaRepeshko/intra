import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { deleteCluster } from '@entities/library/cluster/api/cluster.api';
import { clusterKeys } from '@entities/library/cluster/api/cluster.queries';

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

export function useDeleteClusterMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteCluster(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: clusterKeys.lists(),
            });
            toast.success('Cluster deleted successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to delete cluster'),
            );
        },
    });
}
