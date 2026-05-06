import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

import { updateQuestionTemplate } from '@entities/library/question-template/api/question-template.api';
import { questionTemplateKeys } from '@entities/library/question-template/api/question-template.queries';
import { QuestionTemplateStatus } from '@entities/library/question-template/model/types';

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

export function useArchiveQuestionTemplateMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            updateQuestionTemplate(id, {
                status: QuestionTemplateStatus.ARCHIVE,
            }),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({
                queryKey: questionTemplateKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: questionTemplateKeys.detail(id),
            });
            toast.success('Question template archived successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(
                    error,
                    'Failed to archive question template',
                ),
            );
        },
    });
}
