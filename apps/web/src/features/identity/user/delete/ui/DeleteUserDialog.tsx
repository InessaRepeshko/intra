'use client';

import type { User } from '@entities/identity/user/model/mappers';
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

import { useDeleteUserMutation } from '../api/delete-user.mutation';

interface DeleteUserDialogProps {
    user: User | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function DeleteUserDialog({
    user,
    onClose,
    onSuccess,
}: DeleteUserDialogProps) {
    const mutation = useDeleteUserMutation();

    const handleDelete = () => {
        if (!user) return;
        mutation.mutate(user.id, {
            onSuccess: () => {
                onClose();
                onSuccess?.();
            },
        });
    };

    return (
        <AlertDialog open={!!user} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-foreground">
                            &ldquo;{user?.fullName}&rdquo;
                        </span>
                        ? This will permanently remove the user account and all
                        associated data. This action cannot be undone.
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
