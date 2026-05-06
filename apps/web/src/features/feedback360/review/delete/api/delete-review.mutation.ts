import { deleteReview } from '@entities/feedback360/review/api/review.api';
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

export function useDeleteReviewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteReview(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewKeys.lists() });
            toast.success('Review deleted successfully');
        },
        onError: (error) => {
            toast.error(
                extractApiErrorMessage(error, 'Failed to delete review'),
            );
        },
    });
}
