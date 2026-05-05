'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
    CalendarIcon,
    Eye,
    Pencil,
    Plus,
    RotateCcw,
    Save,
    StopCircle,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

import type { Cycle } from '@entities/feedback360/cycle/model/mappers';
import {
    CYCLE_STAGE_ENUM_VALUES,
    CycleStage,
} from '@entities/feedback360/cycle/model/types';
import { StageBadge, stageConfig } from '@entities/feedback360/cycle/ui/stage-badge';
import { useAuth } from '@entities/identity/user/model/auth-context';
import { DeleteCycleDialog } from '@features/feedback360/cycle/delete/ui/DeleteCycleDialog';
import { ForceFinishCycleDialog } from '@features/feedback360/cycle/force-finish/ui/ForceFinishCycleDialog';
import { Button } from '@shared/components/ui/button';
import { Calendar } from '@shared/components/ui/calendar';
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
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@shared/components/ui/popover';
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
    useCreateCycleFormMutation,
    useUpdateCycleFormMutation,
} from '../api/cycle-form.mutation';
import {
    cycleFormSchema,
    type CycleFormValues,
} from '../model/cycle-form.schema';

export type CycleFormMode = 'create' | 'edit' | 'view';

interface CycleFormDialogProps {
    mode: CycleFormMode;
    cycle?: Cycle | null;
    open?: boolean;
    onClose: () => void;
}

function DatePickerField({
    value,
    onChange,
    placeholder,
    disabled,
}: {
    value: Date | undefined;
    onChange: (date: Date | undefined) => void;
    placeholder: string;
    disabled?: boolean;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'w-full justify-start text-left font-normal rounded-xl border-border bg-secondary/30',
                        !value && 'text-muted-foreground',
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(value, 'MMM dd, yyyy') : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

const inputClassName =
    'border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground rounded-xl';

function buildDefaults(
    cycle: Cycle | null | undefined,
    currentUserId: number,
): Partial<CycleFormValues> {
    if (!cycle) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        return {
            title: '',
            description: '',
            hrId: currentUserId,
            minRespondentsThreshold: 3,
            stage: CycleStage.NEW,
            startDate,
            endDate,
        };
    }
    return {
        title: cycle.title,
        description: cycle.description ?? '',
        hrId: cycle.hrId ?? currentUserId,
        minRespondentsThreshold: cycle.minRespondentsThreshold ?? 3,
        stage: cycle.stage,
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        responseDeadline: cycle.responseDeadline ?? undefined,
        reviewDeadline: cycle.reviewDeadline ?? undefined,
        approvalDeadline: cycle.approvalDeadline ?? undefined,
    };
}

function isStageDisabledFor(
    stage: CycleStage,
    mode: CycleFormMode,
): boolean {
    if (mode === 'create') {
        return stage !== CycleStage.NEW && stage !== CycleStage.ACTIVE;
    }
    if (mode === 'edit') {
        return stage === CycleStage.PREPARING_REPORT;
    }
    return true;
}

export function CycleFormDialog({
    mode,
    cycle,
    open,
    onClose,
}: CycleFormDialogProps) {
    const isCreate = mode === 'create';
    const isView = mode === 'view';
    const isEdit = mode === 'edit';

    const isOpen = isCreate ? !!open : cycle != null;

    const auth = useAuth();
    const createMutation = useCreateCycleFormMutation();
    const updateMutation = useUpdateCycleFormMutation();
    const mutation = isEdit ? updateMutation : createMutation;

    const [forceFinishingCycle, setForceFinishingCycle] =
        useState<Cycle | null>(null);
    const [deletingCycle, setDeletingCycle] = useState<Cycle | null>(null);

    const form = useForm<CycleFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(cycleFormSchema) as any,
        defaultValues: buildDefaults(cycle, auth.user.id),
        mode: 'onChange',
    });

    useEffect(() => {
        if (!isOpen) return;
        form.reset(buildDefaults(cycle, auth.user.id));
    }, [isOpen, cycle, form, auth.user.id]);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            onClose();
        }
    };

    const handleClose = () => {
        form.reset(buildDefaults(null, auth.user.id));
        onClose();
    };

    const onSubmit = (values: CycleFormValues) => {
        if (isEdit && cycle) {
            updateMutation.mutate(
                { id: cycle.id, values },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                },
            );
            return;
        }
        if (isCreate) {
            createMutation.mutate(values, {
                onSuccess: () => {
                    handleClose();
                },
            });
        }
    };

    const onInvalid = (errors: FieldErrors<CycleFormValues>) => {
        console.log(errors);
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
            ? 'Create New Cycle'
            : mode === 'edit'
              ? 'Edit Cycle'
              : 'Cycle Details';

    const TitleIcon = isCreate ? Plus : isEdit ? Pencil : Eye;

    const submitLabel = isCreate
        ? mutation.isPending
            ? 'Creating...'
            : 'Create Cycle'
        : mutation.isPending
          ? 'Saving...'
          : 'Save Changes';

    const fieldsDisabled = isView;

    return (
        <>
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
                                {cycle && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                        <span>#{cycle.id}</span>
                                        <span>·</span>
                                        <StageBadge stage={cycle.stage} />
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
                                    Basic information about the feedback cycle.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="title">
                                        Title{' '}
                                        {!isView && (
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        )}
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Q1 2026 Performance Review"
                                        disabled={fieldsDisabled}
                                        className={inputClassName}
                                        {...form.register('title')}
                                    />
                                    {form.formState.errors.title && (
                                        <p className="text-sm text-destructive">
                                            {form.formState.errors.title.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Optional description of the cycle..."
                                        rows={3}
                                        disabled={fieldsDisabled}
                                        className={cn(
                                            'resize-none',
                                            inputClassName,
                                        )}
                                        {...form.register('description')}
                                    />
                                    {form.formState.errors.description && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors
                                                    .description.message
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
                                                value as CycleStage,
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
                                            {CYCLE_STAGE_ENUM_VALUES.map(
                                                (stageOption) => (
                                                    <SelectItem
                                                        key={stageOption}
                                                        value={stageOption}
                                                        disabled={isStageDisabledFor(
                                                            stageOption,
                                                            mode,
                                                        )}
                                                    >
                                                        <StageBadge
                                                            stage={stageOption as CycleStage}
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

                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">
                                    Anonymity Threshold
                                </CardTitle>
                                <CardDescription>
                                    The minimum number of responses required for a feedback review to be valid.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="minRespondentsThreshold">
                                        Min Respondents
                                    </Label>
                                    <Input
                                        id="minRespondentsThreshold"
                                        type="number"
                                        placeholder="3"
                                        min={3}
                                        disabled={fieldsDisabled}
                                        className={inputClassName}
                                        {...form.register(
                                            'minRespondentsThreshold',
                                        )}
                                    />
                                    {form.formState.errors
                                        .minRespondentsThreshold && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors
                                                    .minRespondentsThreshold
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
                                    Schedule
                                </CardTitle>
                                <CardDescription>
                                    Cycle dates and optional milestone
                                    deadlines.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label>
                                            Start Date{' '}
                                            {!isView && (
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            )}
                                        </Label>
                                        <DatePickerField
                                            value={form.watch('startDate')}
                                            onChange={(date) =>
                                                form.setValue(
                                                    'startDate',
                                                    date as Date,
                                                    { shouldValidate: true },
                                                )
                                            }
                                            placeholder="Pick start date"
                                            disabled={fieldsDisabled}
                                        />
                                        {form.formState.errors.startDate && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    form.formState.errors
                                                        .startDate.message
                                                }
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label>
                                            End Date{' '}
                                            {!isView && (
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            )}
                                        </Label>
                                        <DatePickerField
                                            value={form.watch('endDate')}
                                            onChange={(date) =>
                                                form.setValue(
                                                    'endDate',
                                                    date as Date,
                                                    { shouldValidate: true },
                                                )
                                            }
                                            placeholder="Pick end date"
                                            disabled={fieldsDisabled}
                                        />
                                        {form.formState.errors.endDate && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    form.formState.errors
                                                        .endDate.message
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label className="text-muted-foreground">
                                        Optional Deadlines
                                    </Label>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground">
                                                Response
                                            </span>
                                            <DatePickerField
                                                value={form.watch(
                                                    'responseDeadline',
                                                )}
                                                onChange={(date) =>
                                                    form.setValue(
                                                        'responseDeadline',
                                                        date,
                                                    )
                                                }
                                                placeholder="Response"
                                                disabled={fieldsDisabled}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground">
                                                Review
                                            </span>
                                            <DatePickerField
                                                value={form.watch(
                                                    'reviewDeadline',
                                                )}
                                                onChange={(date) =>
                                                    form.setValue(
                                                        'reviewDeadline',
                                                        date,
                                                    )
                                                }
                                                placeholder="Review"
                                                disabled={fieldsDisabled}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-muted-foreground">
                                                Approval
                                            </span>
                                            <DatePickerField
                                                value={form.watch(
                                                    'approvalDeadline',
                                                )}
                                                onChange={(date) =>
                                                    form.setValue(
                                                        'approvalDeadline',
                                                        date,
                                                    )
                                                }
                                                placeholder="Approval"
                                                disabled={fieldsDisabled}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-wrap justify-end gap-3 pt-2">
                            {isEdit && cycle && (
                                <>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-destructive/40 bg-red-50 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
                                        disabled={mutation.isPending}
                                        onClick={() => setDeletingCycle(cycle)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                    {cycle.stage === CycleStage.ACTIVE && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-900 rounded-xl"
                                            disabled={mutation.isPending}
                                            onClick={() =>
                                                setForceFinishingCycle(cycle)
                                            }
                                        >
                                            <StopCircle className="mr-2 h-4 w-4" />
                                            Force Finish
                                        </Button>
                                    )}
                                </>
                            )}
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
                                            buildDefaults(cycle, auth.user.id),
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

        <ForceFinishCycleDialog
            cycle={forceFinishingCycle}
            onClose={() => setForceFinishingCycle(null)}
            onSuccess={handleClose}
        />
        <DeleteCycleDialog
            cycle={deletingCycle}
            onClose={() => setDeletingCycle(null)}
            onSuccess={handleClose}
        />
        </>
    );
}
