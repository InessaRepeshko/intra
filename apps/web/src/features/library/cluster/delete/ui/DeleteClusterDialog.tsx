'use client';

import type { Cluster } from '@entities/library/cluster/model/mappers';
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

import { useDeleteClusterMutation } from '../api/delete-cluster.mutation';

interface DeleteClusterDialogProps {
    cluster: Cluster | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function DeleteClusterDialog({
    cluster,
    onClose,
    onSuccess,
}: DeleteClusterDialogProps) {
    const mutation = useDeleteClusterMutation();

    const handleDelete = () => {
        if (!cluster) return;
        mutation.mutate(cluster.id, {
            onSuccess: () => {
                onClose();
                onSuccess?.();
            },
        });
    };

    return (
        <AlertDialog open={!!cluster} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Cluster</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-foreground">
                            &ldquo;{cluster?.title}&rdquo;
                        </span>
                        ? This will permanently remove the cluster. This action
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
