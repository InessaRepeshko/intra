'use client';

import type { Cycle } from '@/entities/cycle/model/mapper';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

import { useForceFinishCycleMutation } from '../api/force-finish.mutation';

interface ForceFinishCycleDialogProps {
    cycle: Cycle | null;
    onClose: () => void;
}

export function ForceFinishCycleDialog({
    cycle,
    onClose,
}: ForceFinishCycleDialogProps) {
    const mutation = useForceFinishCycleMutation();

    const handleForceFinish = () => {
        if (!cycle) return;
        mutation.mutate(cycle.id, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <AlertDialog open={!!cycle} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Force Finish Cycle</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to force finish{' '}
                        <span className="font-semibold text-foreground">
                            &ldquo;{cycle?.title}&rdquo;
                        </span>
                        ? This will immediately end the cycle and all pending
                        reviews will be closed. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleForceFinish}
                        disabled={mutation.isPending}
                        className="bg-amber-600 text-white hover:bg-amber-700"
                    >
                        {mutation.isPending ? 'Finishing...' : 'Force Finish'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
