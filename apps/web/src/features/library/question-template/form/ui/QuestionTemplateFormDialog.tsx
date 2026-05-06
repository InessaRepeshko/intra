'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
    Check,
    ChevronsUpDown,
    Eye,
    Pencil,
    Plus,
    RotateCcw,
    Save,
    X,
} from 'lucide-react';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

import { useCompetencesQuery } from '@entities/library/competence/api/competence.queries';
import type { QuestionTemplate } from '@entities/library/question-template/model/mappers';
import {
    ANSWER_TYPE_ENUM_VALUES,
    AnswerType,
    FOR_SELFASSESSMENT_TYPES_ENUM_VALUES,
    ForSelfassessmentType,
    QUESTION_TEMPLATE_STATUSES_ENUM_VALUES,
    QuestionTemplateStatus,
} from '@entities/library/question-template/model/types';
import { AnswerTypeBadge } from '@entities/library/question-template/ui/answer-type-badge';
import {
    ForSelfAssessmentBadge,
    forSelfAssessmentConfig,
} from '@entities/library/question-template/ui/is-for-self-assessment-badge';
import { StatusBadge } from '@entities/library/question-template/ui/status-badge';
import { usePositionsQuery } from '@entities/organisation/position/api/position.queries';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@shared/components/ui/command';
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
import { cn } from '@shared/lib/utils/cn';

import {
    useCreateQuestionTemplateFormMutation,
    useUpdateQuestionTemplateFormMutation,
} from '../api/question-template-form.mutation';
import {
    questionTemplateFormSchema,
    type QuestionTemplateFormValues,
} from '../model/question-template-form.schema';

export type QuestionTemplateFormMode = 'create' | 'edit' | 'view';

interface QuestionTemplateFormDialogProps {
    mode: QuestionTemplateFormMode;
    questionTemplate?: QuestionTemplate | null;
    open?: boolean;
    onClose: () => void;
}

const inputClassName =
    'border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground rounded-xl';

function buildDefaults(
    questionTemplate?: QuestionTemplate | null,
): QuestionTemplateFormValues {
    if (!questionTemplate) {
        return {
            title: '',
            answerType: AnswerType.NUMERICAL_SCALE,
            isForSelfassessment: false,
            status: QuestionTemplateStatus.ACTIVE,
            competenceId: 0,
            positionIds: [],
        };
    }
    return {
        title: questionTemplate.title,
        answerType: questionTemplate.answerType,
        isForSelfassessment: questionTemplate.isForSelfassessment,
        status: questionTemplate.status,
        competenceId: questionTemplate.competenceId ?? 0,
        positionIds: questionTemplate.positionIds ?? [],
    };
}

function forwardWheelToCommandList(e: React.WheelEvent<HTMLDivElement>) {
    const list = (e.currentTarget as HTMLElement).querySelector(
        '[cmdk-list]',
    ) as HTMLElement | null;
    if (!list) return;
    if (list.scrollHeight <= list.clientHeight) return;
    list.scrollTop += e.deltaY;
    e.preventDefault();
    e.stopPropagation();
}

interface EntityOption {
    id: number;
    title: string;
    subtitle?: string | null;
}

function EntitySingleCombobox({
    options,
    value,
    onChange,
    placeholder,
    searchPlaceholder,
    emptyText,
    disabled,
}: {
    options: EntityOption[];
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    placeholder: string;
    searchPlaceholder: string;
    emptyText: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const selected = options.find((opt) => opt.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        'w-full justify-between text-left font-normal h-auto min-h-9 py-2',
                        inputClassName,
                        !selected && 'text-muted-foreground',
                    )}
                >
                    {selected ? (
                        <div className="flex flex-col items-start min-w-0 flex-1">
                            <span className="font-medium text-foreground truncate">
                                {selected.title}
                            </span>
                            {selected.subtitle && (
                                <span className="text-xs text-muted-foreground truncate">
                                    {selected.subtitle}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0"
                align="start"
                style={{ width: 'var(--radix-popover-trigger-width)' }}
                onWheel={forwardWheelToCommandList}
                onTouchMove={(e) => e.stopPropagation()}
            >
                <Command
                    filter={(itemValue, search) =>
                        itemValue.toLowerCase().includes(search.toLowerCase())
                            ? 1
                            : 0
                    }
                >
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        {options.map((option) => {
                            const haystack = [option.title, option.subtitle]
                                .filter(Boolean)
                                .join(' ');
                            return (
                                <CommandItem
                                    key={option.id}
                                    value={haystack}
                                    onSelect={() => {
                                        onChange(option.id);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="font-medium text-foreground truncate">
                                            {option.title}
                                        </span>
                                        {option.subtitle && (
                                            <span className="text-xs text-muted-foreground truncate">
                                                {option.subtitle}
                                            </span>
                                        )}
                                    </div>
                                    {value === option.id && (
                                        <Check className="ml-auto h-4 w-4 shrink-0" />
                                    )}
                                </CommandItem>
                            );
                        })}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function EntityMultiCombobox({
    options,
    value,
    onChange,
    placeholder,
    searchPlaceholder,
    emptyText,
    disabled,
}: {
    options: EntityOption[];
    value: number[];
    onChange: (value: number[]) => void;
    placeholder: string;
    searchPlaceholder: string;
    emptyText: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);

    const selectedOptions = useMemo(
        () =>
            value
                .map((id) => options.find((opt) => opt.id === id))
                .filter((opt): opt is EntityOption => Boolean(opt)),
        [value, options],
    );

    const toggle = (id: number) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            'w-full justify-between text-left font-normal',
                            inputClassName,
                            value.length === 0 && 'text-muted-foreground',
                        )}
                    >
                        <span className="truncate">
                            {value.length === 0
                                ? placeholder
                                : `${value.length} selected`}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0"
                    align="start"
                    style={{ width: 'var(--radix-popover-trigger-width)' }}
                    onWheel={forwardWheelToCommandList}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <Command
                        filter={(itemValue, search) =>
                            itemValue
                                .toLowerCase()
                                .includes(search.toLowerCase())
                                ? 1
                                : 0
                        }
                    >
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>{emptyText}</CommandEmpty>
                            {options.map((option) => {
                                const isSelected = value.includes(option.id);
                                const haystack = [option.title, option.subtitle]
                                    .filter(Boolean)
                                    .join(' ');
                                return (
                                    <CommandItem
                                        key={option.id}
                                        value={haystack}
                                        onSelect={() => toggle(option.id)}
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'border-muted-foreground/40',
                                            )}
                                        >
                                            {isSelected && (
                                                <Check className="h-3 w-3" />
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="font-medium text-foreground truncate">
                                                {option.title}
                                            </span>
                                            {option.subtitle && (
                                                <span className="text-xs text-muted-foreground truncate">
                                                    {option.subtitle}
                                                </span>
                                            )}
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((option) => (
                        <div
                            key={option.id}
                            className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 max-w-full w-full"
                        >
                            <div className="flex flex-col min-w-0 w-full">
                                <span className="text-sm font-medium truncate">
                                    {option.title}
                                </span>
                                {option.subtitle && (
                                    <span className="text-xs text-muted-foreground truncate">
                                        {option.subtitle}
                                    </span>
                                )}
                            </div>
                            {!disabled && (
                                <button
                                    type="button"
                                    className="ml-0.5 rounded-full p-1 hover:bg-foreground/10 shrink-0"
                                    onClick={() =>
                                        onChange(
                                            value.filter(
                                                (v) => v !== option.id,
                                            ),
                                        )
                                    }
                                    aria-label={`Remove ${option.title}`}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function QuestionTemplateFormDialog({
    mode,
    questionTemplate,
    open,
    onClose,
}: QuestionTemplateFormDialogProps) {
    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const isOpen = isCreate ? !!open : questionTemplate != null;

    const createMutation = useCreateQuestionTemplateFormMutation();
    const updateMutation = useUpdateQuestionTemplateFormMutation();
    const mutation = isEdit ? updateMutation : createMutation;

    const { data: competences = [], isLoading: isCompetencesLoading } =
        useCompetencesQuery();
    const { data: positions = [], isLoading: isPositionsLoading } =
        usePositionsQuery();

    const competenceOptions: EntityOption[] = useMemo(
        () =>
            [...competences]
                .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
                .map((c) => ({
                    id: c.id,
                    title: c.title,
                    subtitle: c.description ?? null,
                })),
        [competences],
    );

    const positionOptions: EntityOption[] = useMemo(
        () =>
            [...positions]
                .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
                .map((p) => ({
                    id: p.id,
                    title: p.title,
                    subtitle: p.description ?? null,
                })),
        [positions],
    );

    const form = useForm<QuestionTemplateFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(questionTemplateFormSchema) as any,
        defaultValues: buildDefaults(questionTemplate),
        mode: 'onChange',
    });

    useEffect(() => {
        if (!isOpen) return;
        form.reset(buildDefaults(questionTemplate));
    }, [isOpen, questionTemplate, form]);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            onClose();
        }
    };

    const handleClose = () => {
        form.reset(buildDefaults(null));
        onClose();
    };

    const onSubmit = (values: QuestionTemplateFormValues) => {
        if (isCreate) {
            createMutation.mutate(values, {
                onSuccess: () => {
                    handleClose();
                },
            });
            return;
        }
        if (isEdit && questionTemplate) {
            updateMutation.mutate(
                {
                    id: questionTemplate.id,
                    values,
                    originalPositionIds: questionTemplate.positionIds ?? [],
                },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                },
            );
        }
    };

    const onInvalid = (errors: FieldErrors<QuestionTemplateFormValues>) => {
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

    const titleText = isCreate
        ? 'Create New Question Template'
        : isEdit
          ? 'Edit Question Template'
          : 'Question Template Details';

    const TitleIcon = isCreate ? Plus : isEdit ? Pencil : Eye;

    const submitLabel = isCreate
        ? mutation.isPending
            ? 'Creating...'
            : 'Create Question Template'
        : mutation.isPending
          ? 'Saving...'
          : 'Save Changes';

    const fieldsDisabled = isView;

    const watchedCompetenceId = form.watch('competenceId');
    const watchedPositionIds = form.watch('positionIds') ?? [];

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
                                {questionTemplate && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                        <span>#{questionTemplate.id}</span>
                                        <span>·</span>
                                        <StatusBadge
                                            status={questionTemplate.status}
                                        />
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
                                    Basic information and lifecycle settings.
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
                                        placeholder="e.g. How well does this person communicate?"
                                        disabled={fieldsDisabled}
                                        className={inputClassName}
                                        {...form.register('title')}
                                    />
                                    {form.formState.errors.title && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors.title
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="answerType">
                                        Answer Type{' '}
                                        {!isView && (
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        )}
                                    </Label>
                                    <Select
                                        value={form.watch('answerType') ?? ''}
                                        onValueChange={(value) =>
                                            form.setValue(
                                                'answerType',
                                                value as AnswerType,
                                                { shouldValidate: true },
                                            )
                                        }
                                        disabled={fieldsDisabled}
                                    >
                                        <SelectTrigger
                                            id="answerType"
                                            className={cn(
                                                'w-full',
                                                inputClassName,
                                            )}
                                        >
                                            <SelectValue placeholder="Select answer type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ANSWER_TYPE_ENUM_VALUES.map(
                                                (option) => (
                                                    <SelectItem
                                                        key={option}
                                                        value={option}
                                                    >
                                                        <AnswerTypeBadge
                                                            answerType={
                                                                option as AnswerType
                                                            }
                                                        />
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {form.formState.errors.answerType && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors.answerType
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="isForSelfassessment">
                                            Self-Assessment
                                        </Label>
                                        <Select
                                            value={
                                                form.watch(
                                                    'isForSelfassessment',
                                                )
                                                    ? ForSelfassessmentType.TRUE
                                                    : ForSelfassessmentType.FALSE
                                            }
                                            onValueChange={(value) =>
                                                form.setValue(
                                                    'isForSelfassessment',
                                                    value ===
                                                        ForSelfassessmentType.TRUE,
                                                    { shouldValidate: true },
                                                )
                                            }
                                            disabled={fieldsDisabled}
                                        >
                                            <SelectTrigger
                                                id="isForSelfassessment"
                                                className={cn(
                                                    'w-full',
                                                    inputClassName,
                                                )}
                                            >
                                                <SelectValue placeholder="Select self-assessment" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {FOR_SELFASSESSMENT_TYPES_ENUM_VALUES.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option}
                                                            value={option}
                                                        >
                                                            <span className="flex items-center gap-2">
                                                                <ForSelfAssessmentBadge
                                                                    forSelfassessment={
                                                                        option as ForSelfassessmentType
                                                                    }
                                                                />
                                                                <span className="text-sm">
                                                                    {
                                                                        forSelfAssessmentConfig[
                                                                            option as ForSelfassessmentType
                                                                        ].label
                                                                    }
                                                                </span>
                                                            </span>
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="status">
                                            Status{' '}
                                            {!isView && (
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            )}
                                        </Label>
                                        <Select
                                            value={form.watch('status') ?? ''}
                                            onValueChange={(value) =>
                                                form.setValue(
                                                    'status',
                                                    value as QuestionTemplateStatus,
                                                    { shouldValidate: true },
                                                )
                                            }
                                            disabled={fieldsDisabled}
                                        >
                                            <SelectTrigger
                                                id="status"
                                                className={cn(
                                                    'w-full',
                                                    inputClassName,
                                                )}
                                            >
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {QUESTION_TEMPLATE_STATUSES_ENUM_VALUES.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option}
                                                            value={option}
                                                        >
                                                            <StatusBadge
                                                                status={
                                                                    option as QuestionTemplateStatus
                                                                }
                                                            />
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {form.formState.errors.status && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    form.formState.errors.status
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">
                                    Competence{' '}
                                    {!isView && (
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    Pick the competence this question template
                                    assesses.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EntitySingleCombobox
                                    options={competenceOptions}
                                    value={
                                        watchedCompetenceId
                                            ? watchedCompetenceId
                                            : undefined
                                    }
                                    onChange={(id) =>
                                        form.setValue('competenceId', id ?? 0, {
                                            shouldValidate: true,
                                        })
                                    }
                                    placeholder={
                                        isCompetencesLoading
                                            ? 'Loading competences...'
                                            : 'Select a competence'
                                    }
                                    searchPlaceholder="Search competences..."
                                    emptyText="No competences found."
                                    disabled={
                                        fieldsDisabled || isCompetencesLoading
                                    }
                                />
                                {form.formState.errors.competenceId && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {
                                            form.formState.errors.competenceId
                                                .message
                                        }
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">
                                    Positions{' '}
                                    {!isView && (
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    Pick one or more positions this question
                                    template applies to.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <EntityMultiCombobox
                                    options={positionOptions}
                                    value={watchedPositionIds}
                                    onChange={(ids) =>
                                        form.setValue('positionIds', ids, {
                                            shouldValidate: true,
                                        })
                                    }
                                    placeholder={
                                        isPositionsLoading
                                            ? 'Loading positions...'
                                            : 'Select positions'
                                    }
                                    searchPlaceholder="Search positions..."
                                    emptyText="No positions found."
                                    disabled={
                                        fieldsDisabled || isPositionsLoading
                                    }
                                />
                                {form.formState.errors.positionIds && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {
                                            form.formState.errors.positionIds
                                                .message
                                        }
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex flex-wrap justify-end gap-3 pt-2">
                            {isCreate && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-secondary rounded-xl"
                                    disabled={mutation.isPending}
                                    onClick={() =>
                                        form.reset(buildDefaults(null))
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
                                            buildDefaults(questionTemplate),
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
