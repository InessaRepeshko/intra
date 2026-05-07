'use client';

import type { Position } from '@entities/organisation/position/model/mappers';
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

import { useDeletePositionMutation } from '../api/delete-position.mutation';

interface DeletePositionDialogProps {
    position: Position | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function DeletePositionDialog({
    position,
    onClose,
    onSuccess,
}: DeletePositionDialogProps) {
    const mutation = useDeletePositionMutation();

    const handleDelete = () => {
        if (!position) return;
        mutation.mutate(position.id, {
            onSuccess: () => {
                onClose();
                onSuccess?.();
            },
        });
    };

    return (
        <AlertDialog open={!!position} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Position</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-foreground">
                            &ldquo;{position?.title}&rdquo;
                        </span>
                        ? This will permanently remove the position. This action
                        cannot be undone.
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
