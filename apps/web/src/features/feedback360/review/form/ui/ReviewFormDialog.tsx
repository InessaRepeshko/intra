'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
    Eye,
    Pencil,
    Plus,
    RotateCcw,
    Save,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import type { Review } from '@entities/feedback360/review/model/mappers';
import {
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
} from '@entities/feedback360/review/model/types';
import { StageBadge } from '@entities/feedback360/review/ui/stage-badge';
import {
    useUserQuery,
    useUsersQuery,
} from '@entities/identity/user/api/user.queries';
import { useAuth } from '@entities/identity/user/model/auth-context';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@shared/components/ui/dialog';
import { Label } from '@shared/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/components/ui/select';
import { Textarea } from '@shared/components/ui/textarea';
import { cn } from '@shared/lib/utils/cn';

import {
    useCreateReviewFormMutation,
    useUpdateReviewFormMutation,
} from '../api/review-form.mutation';
import {
    reviewFormSchema,
    type ReviewFormValues,
} from '../model/review-form.schema';

export type ReviewFormMode = 'create' | 'edit' | 'view';

interface ReviewFormDialogProps {
    mode: ReviewFormMode;
    review?: Review | null;
    open?: boolean;
    onClose: () => void;
}

const inputClassName =
    'border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground rounded-xl';

const NO_CYCLE_VALUE = '__none__';

function buildDefaults(
    review: Review | null | undefined,
    currentUserId: number,
): Partial<ReviewFormValues> {
    if (!review) {
        return {
            rateeId: undefined as unknown as number,
            hrId: currentUserId,
            hrNote: '',
            cycleId: undefined,
            stage: ReviewStage.NEW,
        };
    }
    return {
        rateeId: review.rateeId,
        hrId: review.hrId ?? currentUserId,
        hrNote: review.hrNote ?? '',
        cycleId: review.cycleId ?? undefined,
        stage: review.stage,
    };
}

function isStageDisabledFor(
    stage: ReviewStage,
    mode: ReviewFormMode,
): boolean {
    if (mode === 'create') {
        return stage !== ReviewStage.NEW;
    }
    if (mode === 'edit') {
        return (
            stage === ReviewStage.PREPARING_REPORT ||
            stage === ReviewStage.PROCESSING_BY_HR ||
            stage === ReviewStage.PUBLISHED ||
            stage === ReviewStage.ANALYSIS
        );
    }
    return true;
}

export function ReviewFormDialog({
    mode,
    review,
    open,
    onClose,
}: ReviewFormDialogProps) {
    const isCreate = mode === 'create';
    const isView = mode === 'view';
    const isEdit = mode === 'edit';

    const isOpen = isCreate ? !!open : review != null;

    const auth = useAuth();
    const createMutation = useCreateReviewFormMutation();
    const updateMutation = useUpdateReviewFormMutation();
    const mutation = isEdit ? updateMutation : createMutation;

    const { data: users = [], isLoading: isUsersLoading } = useUsersQuery();
    const { data: cycles = [], isLoading: isCyclesLoading } = useCyclesQuery();

    const form = useForm<ReviewFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(reviewFormSchema) as any,
        defaultValues: buildDefaults(review, auth.user.id),
        mode: 'onChange',
    });

    useEffect(() => {
        if (!isOpen) return;
        form.reset(buildDefaults(review, auth.user.id));
    }, [isOpen, review, form, auth.user.id]);

    const watchedRateeId = form.watch('rateeId');
    const { data: rateeUser } = useUserQuery(
        Number.isFinite(watchedRateeId) ? Number(watchedRateeId) : 0,
    );

    const eligibleUsers = useMemo(
        () =>
            users
                .filter((user) => user.positionId != null)
                .sort((a, b) => a.fullName.localeCompare(b.fullName)),
        [users],
    );

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            onClose();
        }
    };

    const handleClose = () => {
        form.reset(buildDefaults(null, auth.user.id));
        onClose();
    };

    const onSubmit = (values: ReviewFormValues) => {
        if (isEdit && review) {
            updateMutation.mutate(
                { id: review.id, values, rateeUser },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                },
            );
            return;
        }
        if (isCreate) {
            if (!rateeUser) {
                toast.error('Please select a ratee.');
                return;
            }
            createMutation.mutate(
                { values, rateeUser, currentUser: auth.user },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                },
            );
        }
    };

    const onInvalid = (errors: FieldErrors<ReviewFormValues>) => {
        const firstField = Object.keys(errors)[0];
        const firstMessage =
            firstField &&
            (errors as Record<string, { message?: string } | undefined>)[
                firstField
            ]?.message;
        toast.error(
            firstMessage
                ? `Please fix: ${firstMessage}`
                : 'Please fill in all required fields correctly.',
        );
    };

    const titleText =
        mode === 'create'
            ? 'Create New Review'
            : mode === 'edit'
              ? 'Edit Review'
              : 'Review Details';

    const TitleIcon = isCreate ? Plus : isEdit ? Pencil : Eye;

    const submitLabel = isCreate
        ? mutation.isPending
            ? 'Creating...'
            : 'Create Review'
        : mutation.isPending
          ? 'Saving...'
          : 'Save Changes';

    const fieldsDisabled = isView;

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-0 gap-0"
            >
                <DialogTitle className="sr-only">{titleText}</DialogTitle>
                <form
                    onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                    className="flex flex-col"
                >
                    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background rounded-t-xl px-6 py-4 flex-wrap gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                                <TitleIcon className="h-5 w-5" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-lg font-semibold tracking-tight text-foreground truncate">
                                    {titleText}
                                </p>
                                {review && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                        <span>#{review.id}</span>
                                        <span>·</span>
                                        <StageBadge stage={review.stage} />
                                    </p>
                                )}
                            </div>
                        </div>
                        {!isView && (
                            <Button
                                type="submit"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                                disabled={mutation.isPending}
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {submitLabel}
                            </Button>
                        )}
                    </header>

                    <div className="flex flex-col gap-6 p-6">
                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">
                                    General
                                </CardTitle>
                                <CardDescription>
                                    Who is being reviewed and HR comments.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="rateeId">
                                        Ratee{' '}
                                        {!isView && (
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        )}
                                    </Label>
                                    <Select
                                        value={
                                            watchedRateeId
                                                ? String(watchedRateeId)
                                                : ''
                                        }
                                        onValueChange={(value) =>
                                            form.setValue(
                                                'rateeId',
                                                Number(value),
                                                { shouldValidate: true },
                                            )
                                        }
                                        disabled={
                                            fieldsDisabled || isUsersLoading
                                        }
                                    >
                                        <SelectTrigger
                                            id="rateeId"
                                            className={cn(
                                                'w-full',
                                                inputClassName,
                                            )}
                                        >
                                            <SelectValue
                                                placeholder={
                                                    isUsersLoading
                                                        ? 'Loading users...'
                                                        : 'Select a ratee'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {eligibleUsers.map((user) => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={String(user.id)}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {user.fullName}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.rateeId && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors.rateeId
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                {(rateeUser || review) && (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-xl border border-border bg-secondary/30 p-3 text-sm">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-muted-foreground">
                                                Position
                                            </span>
                                            <span className="font-medium text-foreground break-words">
                                                {rateeUser?.positionTitle ??
                                                    review?.rateePositionTitle ??
                                                    '—'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-muted-foreground">
                                                Team
                                            </span>
                                            <span className="font-medium text-foreground break-words">
                                                {rateeUser?.teamTitle ??
                                                    review?.teamTitle ??
                                                    '—'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs text-muted-foreground">
                                                Manager
                                            </span>
                                            <span className="font-medium text-foreground break-words">
                                                {rateeUser?.managerName ??
                                                    review?.managerFullName ??
                                                    '—'}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="hrNote">HR Note</Label>
                                    <Textarea
                                        id="hrNote"
                                        placeholder="Optional internal note from HR..."
                                        rows={3}
                                        disabled={fieldsDisabled}
                                        className={cn(
                                            'resize-none',
                                            inputClassName,
                                        )}
                                        {...form.register('hrNote')}
                                    />
                                    {form.formState.errors.hrNote && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors.hrNote
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">
                                    Cycle & Stage
                                </CardTitle>
                                <CardDescription>
                                    Optional cycle association and current
                                    review stage.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="cycleId">Cycle</Label>
                                    <Select
                                        value={
                                            form.watch('cycleId')
                                                ? String(form.watch('cycleId'))
                                                : NO_CYCLE_VALUE
                                        }
                                        onValueChange={(value) =>
                                            form.setValue(
                                                'cycleId',
                                                value === NO_CYCLE_VALUE
                                                    ? undefined
                                                    : Number(value),
                                                { shouldValidate: true },
                                            )
                                        }
                                        disabled={
                                            fieldsDisabled || isCyclesLoading
                                        }
                                    >
                                        <SelectTrigger
                                            id="cycleId"
                                            className={cn(
                                                'w-full',
                                                inputClassName,
                                            )}
                                        >
                                            <SelectValue
                                                placeholder={
                                                    isCyclesLoading
                                                        ? 'Loading cycles...'
                                                        : 'No cycle'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={NO_CYCLE_VALUE}>
                                                <span className="text-muted-foreground">
                                                    No cycle
                                                </span>
                                            </SelectItem>
                                            {cycles.map((cycle) => (
                                                <SelectItem
                                                    key={cycle.id}
                                                    value={String(cycle.id)}
                                                >
                                                    <span className="break-words">
                                                        #{cycle.id} —{' '}
                                                        {cycle.title}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.cycleId && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors.cycleId
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="stage">
                                        Stage{' '}
                                        {!isView && (
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        )}
                                    </Label>
                                    <Select
                                        value={form.watch('stage') ?? ''}
                                        onValueChange={(value) =>
                                            form.setValue(
                                                'stage',
                                                value as ReviewStage,
                                                { shouldValidate: true },
                                            )
                                        }
                                        disabled={fieldsDisabled}
                                    >
                                        <SelectTrigger
                                            id="stage"
                                            className={cn(
                                                'w-full',
                                                inputClassName,
                                            )}
                                        >
                                            <SelectValue placeholder="Select stage" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {REVIEW_STAGE_ENUM_VALUES.map(
                                                (stageOption) => (
                                                    <SelectItem
                                                        key={stageOption}
                                                        value={stageOption}
                                                        disabled={isStageDisabledFor(
                                                            stageOption as ReviewStage,
                                                            mode,
                                                        )}
                                                    >
                                                        <StageBadge
                                                            stage={
                                                                stageOption as ReviewStage
                                                            }
                                                        />
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.stage && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors.stage
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {review && (
                            <Card className="border-border bg-card">
                                <CardHeader>
                                    <CardTitle className="text-base text-foreground">
                                        HR
                                    </CardTitle>
                                    <CardDescription>
                                        HR responsible for this review.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-xl border border-border bg-secondary/30 p-3 text-sm">
                                        <span className="text-xs text-muted-foreground">
                                            HR Owner
                                        </span>
                                        <p className="font-medium text-foreground break-words">
                                            {review.hrFullName ?? '—'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <div className="flex flex-wrap justify-end gap-3 pt-2">
                            {isCreate && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-secondary rounded-xl"
                                    disabled={mutation.isPending}
                                    onClick={() =>
                                        form.reset(
                                            buildDefaults(null, auth.user.id),
                                        )
                                    }
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                            )}
                            {isEdit && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-secondary rounded-xl"
                                    disabled={mutation.isPending}
                                    onClick={() =>
                                        form.reset(
                                            buildDefaults(
                                                review,
                                                auth.user.id,
                                            ),
                                        )
                                    }
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                className="border-border text-foreground hover:bg-secondary rounded-xl"
                                onClick={handleClose}
                            >
                                <X className="mr-2 h-4 w-4" />
                                {isView ? 'Close' : 'Cancel'}
                            </Button>
                            {!isView && (
                                <Button
                                    type="submit"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                                    disabled={mutation.isPending}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {submitLabel}
                                </Button>
                            )}
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
