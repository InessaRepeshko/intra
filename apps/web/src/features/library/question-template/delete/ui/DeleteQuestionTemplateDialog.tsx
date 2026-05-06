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

import { useDeleteQuestionTemplateMutation } from '../api/delete-question-template.mutation';

interface DeleteQuestionTemplateDialogProps {
    questionTemplate: QuestionTemplate | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export function DeleteQuestionTemplateDialog({
    questionTemplate,
    onClose,
    onSuccess,
}: DeleteQuestionTemplateDialogProps) {
    const mutation = useDeleteQuestionTemplateMutation();

    const handleDelete = () => {
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
                        Delete Question Template
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-foreground">
                            &ldquo;{questionTemplate?.title}&rdquo;
                        </span>
                        ? This will permanently remove the question template and
                        any associations with positions and reviews. This action
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
