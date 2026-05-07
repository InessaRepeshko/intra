'use client';

import type { Cycle } from '@entities/feedback360/cycle/model/mappers';
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

import { useForceFinishCycleMutation } from '../api/force-finish-cycle.mutation';

interface ForceFinishCycleDialogProps {
    cycle: Cycle | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ForceFinishCycleDialog({
    cycle,
    onClose,
    onSuccess,
}: ForceFinishCycleDialogProps) {
    const mutation = useForceFinishCycleMutation();

    const handleForceFinish = () => {
        if (!cycle) return;
        mutation.mutate(cycle.id, {
            onSuccess: () => {
                onClose();
                onSuccess?.();
            },
        });
    };

    return (
        <AlertDialog open={!!cycle} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Force Complete Cycle</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to force complete{' '}
                        <span className="font-semibold text-foreground">
                            &ldquo;{cycle?.title}&rdquo;
                        </span>
                        ? This will immediately end the cycle and all pending
                        reviews will be closed. This action cannot be undone.
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
                        onClick={handleForceFinish}
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
