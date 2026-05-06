'use client';

import type { Review } from '@entities/feedback360/review/model/mappers';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@shared/components/ui/alert-dialog';

import { useDeleteReviewMutation } from '../api/delete-review.mutation';

interface DeleteReviewDialogProps {
    review: Review | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function DeleteReviewDialog({
    review,
    onClose,
    onSuccess,
}: DeleteReviewDialogProps) {
    const mutation = useDeleteReviewMutation();

    const handleDelete = () => {
        if (!review) return;
        mutation.mutate(review.id, {
            onSuccess: () => {
                onClose();
                onSuccess?.();
            },
        });
    };

    return (
        <AlertDialog open={!!review} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Review</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete review{' '}
                        <span className="font-semibold text-foreground">
                            #{review?.id} for &ldquo;{review?.rateeFullName}
                            &rdquo;
                        </span>
                        ? This will permanently remove the review and all
                        associated respondents, reviewers and answers. This
                        action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={mutation.isPending}
                        variant={undefined}
                        size={undefined}
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={mutation.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        variant={undefined}
                        size={undefined}
                    >
                        {mutation.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
