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

import { useArchiveCycleMutation } from '../api/archive-cycle.mutation';

interface ArchiveCycleDialogProps {
    cycle: Cycle | null;
    onClose: () => void;
}

export function ArchiveCycleDialog({
    cycle,
    onClose,
}: ArchiveCycleDialogProps) {
    const mutation = useArchiveCycleMutation();

    const handleArchive = () => {
        if (!cycle) return;
        mutation.mutate(cycle.id, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <AlertDialog open={!!cycle} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Archive Cycle</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to archive{' '}
                        <span className="font-semibold text-foreground">
                            &ldquo;{cycle?.title}&rdquo;
                        </span>
                        ? Archived cycles will no longer appear in the active
                        list.
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
                        onClick={handleArchive}
                        disabled={mutation.isPending}
                        variant={undefined}
                        size={undefined}
                    >
                        {mutation.isPending ? 'Archiving...' : 'Archive'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
