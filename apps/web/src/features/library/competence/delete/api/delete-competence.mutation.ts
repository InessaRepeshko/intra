import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { deleteCompetence } from '@entities/library/competence/api/competence.api';
import { competenceKeys } from '@entities/library/competence/api/competence.queries';
import { questionTemplateKeys } from '@entities/library/question-template/api/question-template.queries';

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

export function useDeleteCompetenceMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteCompetence(id),
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
            queryClient.invalidateQueries({
                queryKey: questionTemplateKeys.competenceTitles(),
            });
            toast.success('Competence deleted successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to delete competence'),
            );
        },
    });
}
