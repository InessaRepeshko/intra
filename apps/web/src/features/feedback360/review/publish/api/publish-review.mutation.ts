import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReview } from '@entities/feedback360/review/api/review.api';
import { reviewKeys } from '@entities/feedback360/review/api/review.queries';
import { ReviewStage, type UpdateReviewPayload } from '@entities/feedback360/review/model/types';
import { commentKeys } from '@entities/reporting/individual-report-comment/api/individual-report-comment.queries';
import { toast } from 'sonner';

export function usePublishReviewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reportId }: { id: number; reportId: number }) => updateReview(id, { stage: ReviewStage.PUBLISHED } as UpdateReviewPayload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: reviewKeys.detail(variables.id),
            });
            queryClient.invalidateQueries({
                queryKey: reviewKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: commentKeys.reviews(),
            });
            queryClient.invalidateQueries({
                queryKey: commentKeys.review(variables.id),
            });
            toast.success(`Individual Report #${variables.reportId} successfully published.`);
        },
        onError: (_, variables) => {
            toast.error(`Failed to publish Individual Report #${variables.reportId}. Please try again.`);
        },
    });
}
