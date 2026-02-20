'use client';

import type { Cycle } from '@entities/feedback360/cycle/model/mapper';
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

import { useDeleteCycleMutation } from '../api/delete-cycle.mutation';

interface DeleteCycleDialogProps {
    cycle: Cycle | null;
    onClose: () => void;
}

export function DeleteCycleDialog({ cycle, onClose }: DeleteCycleDialogProps) {
    const mutation = useDeleteCycleMutation();

    const handleDelete = () => {
        if (!cycle) return;
        mutation.mutate(cycle.id, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <AlertDialog open={!!cycle} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Cycle</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-foreground">
                            &ldquo;{cycle?.title}&rdquo;
                        </span>
                        ? This will permanently remove the cycle and all
                        associated feedback data. This action cannot be undone.
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
