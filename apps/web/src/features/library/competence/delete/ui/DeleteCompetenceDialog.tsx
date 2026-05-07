'use client';

import type { Competence } from '@entities/library/competence/model/mappers';
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

import { useDeleteCompetenceMutation } from '../api/delete-competence.mutation';

interface DeleteCompetenceDialogProps {
    competence: Competence | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function DeleteCompetenceDialog({
    competence,
    onClose,
    onSuccess,
}: DeleteCompetenceDialogProps) {
    const mutation = useDeleteCompetenceMutation();

    const handleDelete = () => {
        if (!competence) return;
        mutation.mutate(competence.id, {
            onSuccess: () => {
                onClose();
                onSuccess?.();
            },
        });
    };

    return (
        <AlertDialog open={!!competence} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Competence</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-foreground">
                            &ldquo;{competence?.title}&rdquo;
                        </span>
                        ? This will permanently remove the competence and any
                        associations with positions and question templates. This
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
