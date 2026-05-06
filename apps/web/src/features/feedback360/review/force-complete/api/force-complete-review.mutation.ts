import { forceCompleteReview } from '@entities/feedback360/review/api/review.api';
import { reviewKeys } from '@entities/feedback360/review/api/review.queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

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

export function useForceCompleteReviewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => forceCompleteReview(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: reviewKeys.detail(id),
            });
            toast.success('Review force-completed successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(
                    error,
                    'Failed to force-complete review',
                ),
            );
        },
    });
}
