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
    Trash2,
    X,
} from 'lucide-react';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

import { useCompetencePositionIdsQuery } from '@entities/library/competence/api/competence.queries';
import type { Competence } from '@entities/library/competence/model/mappers';
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
import { Textarea } from '@shared/components/ui/textarea';
import { cn } from '@shared/lib/utils/cn';

import { DeleteCompetenceDialog } from '../../delete/ui/DeleteCompetenceDialog';
import {
    useCreateCompetenceFormMutation,
    useUpdateCompetenceFormMutation,
} from '../api/competence-form.mutation';
import {
    competenceFormSchema,
    type CompetenceFormValues,
} from '../model/competence-form.schema';

export type CompetenceFormMode = 'create' | 'edit' | 'view';

interface CompetenceFormDialogProps {
    mode: CompetenceFormMode;
    competence?: Competence | null;
    open?: boolean;
    onClose: () => void;
}

const inputClassName =
    'border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground rounded-xl';

function buildDefaults(
    competence?: Competence | null,
    positionIds: number[] = [],
): CompetenceFormValues {
    if (!competence) {
        return {
            title: '',
            code: '',
            description: '',
            positionIds: [],
        };
    }
    return {
        title: competence.title,
        code: competence.code ?? '',
        description: competence.description ?? '',
        positionIds,
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

export function CompetenceFormDialog({
    mode,
    competence,
    open,
    onClose,
}: CompetenceFormDialogProps) {
    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const isOpen = isCreate ? !!open : competence != null;

    const createMutation = useCreateCompetenceFormMutation();
    const updateMutation = useUpdateCompetenceFormMutation();
    const mutation = isEdit ? updateMutation : createMutation;

    const [deletingCompetence, setDeletingCompetence] =
        useState<Competence | null>(null);

    const { data: positions = [], isLoading: isPositionsLoading } =
        usePositionsQuery();

    const {
        data: existingPositionIds,
        isLoading: isExistingPositionIdsLoading,
    } = useCompetencePositionIdsQuery(competence?.id ?? 0);

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

    const form = useForm<CompetenceFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(competenceFormSchema) as any,
        defaultValues: buildDefaults(competence, []),
        mode: 'onChange',
    });

    useEffect(() => {
        if (!isOpen) return;
        if (isCreate) {
            form.reset(buildDefaults(null, []));
            return;
        }
        if (isExistingPositionIdsLoading) return;
        form.reset(buildDefaults(competence, existingPositionIds ?? []));
    }, [
        isOpen,
        isCreate,
        competence,
        existingPositionIds,
        isExistingPositionIdsLoading,
        form,
    ]);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            onClose();
        }
    };

    const handleClose = () => {
        form.reset(buildDefaults(null, []));
        onClose();
    };

    const onSubmit = (values: CompetenceFormValues) => {
        if (isCreate) {
            createMutation.mutate(values, {
                onSuccess: () => {
                    handleClose();
                },
            });
            return;
        }
        if (isEdit && competence) {
            updateMutation.mutate(
                {
                    id: competence.id,
                    values,
                    originalPositionIds: existingPositionIds ?? [],
                },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                },
            );
        }
    };

    const onInvalid = (errors: FieldErrors<CompetenceFormValues>) => {
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
        ? 'Create New Competence'
        : isEdit
          ? 'Edit Competence'
          : 'Competence Details';

    const TitleIcon = isCreate ? Plus : isEdit ? Pencil : Eye;

    const submitLabel = isCreate
        ? mutation.isPending
            ? 'Creating...'
            : 'Create Competence'
        : mutation.isPending
          ? 'Saving...'
          : 'Save Changes';

    const fieldsDisabled = isView;

    const watchedPositionIds = form.watch('positionIds') ?? [];

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
                                    {competence && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                            <span>#{competence.id}</span>
                                            {competence.code && (
                                                <>
                                                    <span>·</span>
                                                    <span className="font-medium text-foreground">
                                                        {competence.code}
                                                    </span>
                                                </>
                                            )}
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
                                        Basic information about the competence.
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
                                            placeholder="e.g. Communication"
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
                                        <Label htmlFor="code">Code</Label>
                                        <Input
                                            id="code"
                                            placeholder="e.g. COMM-01"
                                            disabled={fieldsDisabled}
                                            className={inputClassName}
                                            {...form.register('code', {
                                                setValueAs: (value: unknown) =>
                                                    typeof value === 'string'
                                                        ? value
                                                              .toUpperCase()
                                                              .replace(
                                                                  /\s+/g,
                                                                  '-',
                                                              )
                                                        : value,
                                                onChange: (e) => {
                                                    e.target.value =
                                                        e.target.value
                                                            .toUpperCase()
                                                            .replace(
                                                                /\s+/g,
                                                                '-',
                                                            );
                                                },
                                            })}
                                        />
                                        {form.formState.errors.code && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    form.formState.errors.code
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Optional description of the competence..."
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
                                </CardContent>
                            </Card>

                            <Card className="border-border bg-card">
                                <CardHeader>
                                    <CardTitle className="text-base text-foreground">
                                        Positions
                                    </CardTitle>
                                    <CardDescription>
                                        Optionally link this competence to
                                        positions that require it.
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
                                                form.formState.errors
                                                    .positionIds.message
                                            }
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="flex flex-wrap justify-end gap-3 pt-2">
                                {isEdit && competence && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-destructive/40 bg-red-50 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
                                        disabled={mutation.isPending}
                                        onClick={() =>
                                            setDeletingCompetence(competence)
                                        }
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                )}
                                {isCreate && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-border text-foreground hover:bg-secondary rounded-xl"
                                        disabled={mutation.isPending}
                                        onClick={() =>
                                            form.reset(buildDefaults(null, []))
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
                                                    competence,
                                                    existingPositionIds ?? [],
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

            <DeleteCompetenceDialog
                competence={deletingCompetence}
                onClose={() => setDeletingCompetence(null)}
                onSuccess={handleClose}
            />
        </>
    );
}
