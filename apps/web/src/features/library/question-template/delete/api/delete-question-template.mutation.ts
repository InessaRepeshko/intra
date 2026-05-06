import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { competenceKeys } from '@entities/library/competence/api/competence.queries';
import { deleteQuestionTemplate } from '@entities/library/question-template/api/question-template.api';
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

export function useDeleteQuestionTemplateMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteQuestionTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: questionTemplateKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: questionTemplateKeys.positionCounts(),
            });
            queryClient.invalidateQueries({
                queryKey: competenceKeys.questionTemplates(),
            });
            queryClient.invalidateQueries({
                queryKey: competenceKeys.questionTemplateCounts(),
            });
            toast.success('Question template deleted successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(
                    error,
                    'Failed to delete question template',
                ),
            );
        },
    });
}
