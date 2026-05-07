import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { deleteTeam } from '@entities/organisation/team/api/team.api';
import { teamKeys } from '@entities/organisation/team/api/team.queries';

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

export function useDeleteTeamMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteTeam(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: teamKeys.lists(),
            });
            toast.success('Team deleted successfully');
        },
        onError: (error) => {
            toast.error(extractApiErrorMessage(error, 'Failed to delete team'));
        },
    });
}
