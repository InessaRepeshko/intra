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

import { useForceCompleteReviewMutation } from '../api/force-complete-review.mutation';

interface ForceCompleteReviewDialogProps {
    review: Review | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ForceCompleteReviewDialog({
    review,
    onClose,
    onSuccess,
}: ForceCompleteReviewDialogProps) {
    const mutation = useForceCompleteReviewMutation();

    const handleForceComplete = () => {
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
                    <AlertDialogTitle>Force Complete Review</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to force complete review{' '}
                        <span className="font-semibold text-foreground">
                            #{review?.id} for &ldquo;{review?.rateeFullName}
                            &rdquo;
                        </span>
                        ? This will immediately end the review and pending
                        responses will be closed. This action cannot be undone.
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
                        onClick={handleForceComplete}
                        disabled={mutation.isPending}
                        className="bg-amber-600 text-white hover:bg-amber-700"
                        variant={undefined}
                        size={undefined}
                    >
                        {mutation.isPending
                            ? 'Completing...'
                            : 'Force Complete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
