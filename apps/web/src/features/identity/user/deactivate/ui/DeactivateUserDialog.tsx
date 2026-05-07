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

import { useDeactivateUserMutation } from '../api/deactivate-user.mutation';

interface DeactivateUserDialogProps {
    user: User | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function DeactivateUserDialog({
    user,
    onClose,
    onSuccess,
}: DeactivateUserDialogProps) {
    const mutation = useDeactivateUserMutation();

    const handleDeactivate = () => {
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
                    <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to deactivate{' '}
                        <span className="font-semibold text-foreground">
                            &ldquo;{user?.fullName}&rdquo;
                        </span>
                        ? Deactivated users will lose access but can be
                        reactivated later by editing the user.
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
                        onClick={handleDeactivate}
                        disabled={mutation.isPending}
                        className="bg-amber-600 text-white hover:bg-amber-700"
                        variant={undefined}
                        size={undefined}
                    >
                        {mutation.isPending ? 'Deactivating...' : 'Deactivate'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
