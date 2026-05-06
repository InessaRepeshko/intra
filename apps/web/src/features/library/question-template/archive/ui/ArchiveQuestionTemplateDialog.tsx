'use client';

import type { QuestionTemplate } from '@entities/library/question-template/model/mappers';
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

import { useArchiveQuestionTemplateMutation } from '../api/archive-question-template.mutation';

interface ArchiveQuestionTemplateDialogProps {
    questionTemplate: QuestionTemplate | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ArchiveQuestionTemplateDialog({
    questionTemplate,
    onClose,
    onSuccess,
}: ArchiveQuestionTemplateDialogProps) {
    const mutation = useArchiveQuestionTemplateMutation();

    const handleArchive = () => {
        if (!questionTemplate) return;
        mutation.mutate(questionTemplate.id, {
            onSuccess: () => {
                onClose();
                onSuccess?.();
            },
        });
    };

    return (
        <AlertDialog open={!!questionTemplate} onOpenChange={() => onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Archive Question Template
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to archive{' '}
                        <span className="font-semibold text-foreground">
                            &ldquo;{questionTemplate?.title}&rdquo;
                        </span>
                        ? Archived question templates will be hidden from active
                        usage but can be restored later by editing the template
                        and changing its status.
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
                        className="bg-amber-600 text-white hover:bg-amber-700"
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
