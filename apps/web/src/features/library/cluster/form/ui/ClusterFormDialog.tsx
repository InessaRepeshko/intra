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

import type { Cluster } from '@entities/library/cluster/model/mappers';
import { useCompetencesQuery } from '@entities/library/competence/api/competence.queries';
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

import {
    useCreateClusterFormMutation,
    useUpdateClusterFormMutation,
} from '../api/cluster-form.mutation';
import {
    clusterFormSchema,
    type ClusterFormValues,
} from '../model/cluster-form.schema';

export type ClusterFormMode = 'create' | 'edit' | 'view';

interface ClusterFormDialogProps {
    mode: ClusterFormMode;
    cluster?: Cluster | null;
    open?: boolean;
    onClose: () => void;
}

const inputClassName =
    'border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground rounded-xl';

function buildDefaults(cluster?: Cluster | null): ClusterFormValues {
    if (!cluster) {
        return {
            title: '',
            description: '',
            competenceId: 0,
            lowerBound: 0,
            upperBound: 5,
        };
    }
    return {
        title: cluster.title,
        description: cluster.description ?? '',
        competenceId: cluster.competenceId ?? 0,
        lowerBound: cluster.lowerBound ?? 0,
        upperBound: cluster.upperBound ?? 5,
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

export function ClusterFormDialog({
    mode,
    cluster,
    open,
    onClose,
}: ClusterFormDialogProps) {
    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const isOpen = isCreate ? !!open : cluster != null;

    const createMutation = useCreateClusterFormMutation();
    const updateMutation = useUpdateClusterFormMutation();
    const mutation = isEdit ? updateMutation : createMutation;

    const { data: competences = [], isLoading: isCompetencesLoading } =
        useCompetencesQuery();

    const competenceOptions: EntityOption[] = useMemo(
        () =>
            [...competences]
                .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
                .map((c) => ({
                    id: c.id,
                    title: c.title,
                    subtitle: c.code ?? c.description ?? null,
                })),
        [competences],
    );

    const form = useForm<ClusterFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(clusterFormSchema) as any,
        defaultValues: buildDefaults(cluster),
        mode: 'onChange',
    });

    useEffect(() => {
        if (!isOpen) return;
        form.reset(buildDefaults(cluster));
    }, [isOpen, cluster, form]);

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            onClose();
        }
    };

    const handleClose = () => {
        form.reset(buildDefaults(null));
        onClose();
    };

    const onSubmit = (values: ClusterFormValues) => {
        if (isCreate) {
            createMutation.mutate(values, {
                onSuccess: () => {
                    handleClose();
                },
            });
            return;
        }
        if (isEdit && cluster) {
            updateMutation.mutate(
                {
                    id: cluster.id,
                    values,
                },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                },
            );
        }
    };

    const onInvalid = (errors: FieldErrors<ClusterFormValues>) => {
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
        ? 'Create New Cluster'
        : isEdit
          ? 'Edit Cluster'
          : 'Cluster Details';

    const TitleIcon = isCreate ? Plus : isEdit ? Pencil : Eye;

    const submitLabel = isCreate
        ? mutation.isPending
            ? 'Creating...'
            : 'Create Cluster'
        : mutation.isPending
          ? 'Saving...'
          : 'Save Changes';

    const fieldsDisabled = isView;

    const watchedCompetenceId = form.watch('competenceId');

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
                                {cluster && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                        <span>#{cluster.id}</span>
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
                                    Basic information about the cluster.
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
                                        placeholder="e.g. Excellent"
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
                                    <Label htmlFor="description">
                                        Description{' '}
                                        {!isView && (
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        )}
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the cluster..."
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
                                    Competence{' '}
                                    {!isView && (
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    Pick the competence this cluster belongs to.
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
                                    Score Range
                                </CardTitle>
                                <CardDescription>
                                    Numeric bounds (0–5) for which this cluster
                                    is assigned. Upper bound must be greater
                                    than lower bound.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="lowerBound">
                                        Lower Bound{' '}
                                        {!isView && (
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        )}
                                    </Label>
                                    <Input
                                        id="lowerBound"
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        max={5}
                                        placeholder="0"
                                        disabled={fieldsDisabled}
                                        className={inputClassName}
                                        {...form.register('lowerBound')}
                                    />
                                    {form.formState.errors.lowerBound && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors.lowerBound
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="upperBound">
                                        Upper Bound{' '}
                                        {!isView && (
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        )}
                                    </Label>
                                    <Input
                                        id="upperBound"
                                        type="number"
                                        step="0.01"
                                        min={0}
                                        max={5}
                                        placeholder="5"
                                        disabled={fieldsDisabled}
                                        className={inputClassName}
                                        {...form.register('upperBound')}
                                    />
                                    {form.formState.errors.upperBound && (
                                        <p className="text-sm text-destructive">
                                            {
                                                form.formState.errors.upperBound
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>
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
                                        form.reset(buildDefaults(cluster))
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
