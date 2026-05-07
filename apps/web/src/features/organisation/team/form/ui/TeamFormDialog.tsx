'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
    Check,
    ChevronsUpDown,
    Eye,
    Lock,
    Pencil,
    Plus,
    RotateCcw,
    Save,
    Trash2,
    X,
} from 'lucide-react';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

import { useUsersQuery, useUsersWithOrgDataQuery } from '@entities/identity/user/api/user.queries';
import { useTeamMembersQuery } from '@entities/organisation/team-member/api/team-member.queries';
import type { Team } from '@entities/organisation/team/model/mappers';
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

import { DeleteTeamDialog } from '../../delete/ui/DeleteTeamDialog';
import {
    useCreateTeamFormMutation,
    useUpdateTeamFormMutation,
} from '../api/team-form.mutation';
import {
    teamFormSchema,
    type TeamFormValues,
} from '../model/team-form.schema';

export type TeamFormMode = 'create' | 'edit' | 'view';

interface TeamFormDialogProps {
    mode: TeamFormMode;
    team?: Team | null;
    open?: boolean;
    onClose: () => void;
}

const inputClassName =
    'border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground rounded-xl';

function buildDefaults(
    team?: Team | null,
    memberIds: number[] = [],
): TeamFormValues {
    if (!team) {
        return {
            title: '',
            description: '',
            headId: 0,
            memberIds: [],
        };
    }
    return {
        title: team.title,
        description: team.description ?? '',
        headId: team.headId ?? 0,
        memberIds,
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

interface UserOption {
    id: number;
    fullName: string;
    positionTitle?: string | null;
    teamTitle?: string | null;
    email?: string | null;
}

function userSubline(option: UserOption): string {
    return (
        [option.positionTitle, option.teamTitle].filter(Boolean).join(' · ') ||
        option.email ||
        ''
    );
}

function userSearchHaystack(option: UserOption): string {
    return [option.fullName, option.positionTitle, option.teamTitle, option.email]
        .filter(Boolean)
        .join(' ');
}

function UserSingleCombobox({
    options,
    value,
    onChange,
    placeholder,
    disabled,
    allowClear,
    clearLabel,
}: {
    options: UserOption[];
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    placeholder: string;
    disabled?: boolean;
    allowClear?: boolean;
    clearLabel?: string;
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
                                {selected.fullName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                                {userSubline(selected)}
                            </span>
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
                    <CommandInput placeholder="Search by name, position, team..." />
                    <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>
                        {allowClear && (
                            <CommandItem
                                value="__none__"
                                onSelect={() => {
                                    onChange(undefined);
                                    setOpen(false);
                                }}
                            >
                                <span className="text-muted-foreground">
                                    {clearLabel ?? 'No selection'}
                                </span>
                                {value === undefined && (
                                    <Check className="ml-auto h-4 w-4 shrink-0" />
                                )}
                            </CommandItem>
                        )}
                        {options.map((option) => (
                            <CommandItem
                                key={option.id}
                                value={userSearchHaystack(option)}
                                onSelect={() => {
                                    onChange(option.id);
                                    setOpen(false);
                                }}
                            >
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="font-medium text-foreground truncate">
                                        {option.fullName}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">
                                        {userSubline(option)}
                                    </span>
                                </div>
                                {value === option.id && (
                                    <Check className="ml-auto h-4 w-4 shrink-0" />
                                )}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function UserMultiCombobox({
    options,
    value,
    onChange,
    placeholder,
    disabled,
    lockedIds = [],
}: {
    options: UserOption[];
    value: number[];
    onChange: (value: number[]) => void;
    placeholder: string;
    disabled?: boolean;
    lockedIds?: number[];
}) {
    const [open, setOpen] = useState(false);
    const isLocked = (id: number) => lockedIds.includes(id);

    const selectedOptions = useMemo(
        () =>
            value
                .map((id) => options.find((opt) => opt.id === id))
                .filter((opt): opt is UserOption => Boolean(opt)),
        [value, options],
    );

    const toggle = (id: number) => {
        if (value.includes(id)) {
            if (isLocked(id)) return;
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
                        <CommandInput placeholder="Search by name, position, team..." />
                        <CommandList>
                            <CommandEmpty>No users found.</CommandEmpty>
                            {options.map((option) => {
                                const isSelected = value.includes(option.id);
                                const locked = isLocked(option.id);
                                return (
                                    <CommandItem
                                        key={option.id}
                                        value={userSearchHaystack(option)}
                                        onSelect={() => toggle(option.id)}
                                        disabled={isSelected && locked}
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
                                                {option.fullName}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate">
                                                {userSubline(option)}
                                            </span>
                                        </div>
                                        {locked && isSelected && (
                                            <Lock className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((option) => {
                        const subline = userSubline(option);
                        const locked = isLocked(option.id);
                        return (
                            <div
                                key={option.id}
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 max-w-full w-full',
                                    locked && 'bg-muted/80',
                                )}
                            >
                                <div className="flex flex-col min-w-0 w-full">
                                    <span className="text-sm font-medium truncate">
                                        {option.fullName}
                                    </span>
                                    {subline && (
                                        <span
                                            className={cn(
                                                'text-xs truncate',
                                                locked
                                                    ? 'text-primary/70'
                                                    : 'text-muted-foreground',
                                            )}
                                        >
                                            {subline}
                                        </span>
                                    )}
                                </div>
                                {locked ? (
                                    <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                ) : (
                                    !disabled && (
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
                                            aria-label={`Remove ${option.fullName}`}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export function TeamFormDialog({
    mode,
    team,
    open,
    onClose,
}: TeamFormDialogProps) {
    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const isOpen = isCreate ? !!open : team != null;

    const createMutation = useCreateTeamFormMutation();
    const updateMutation = useUpdateTeamFormMutation();
    const mutation = isEdit ? updateMutation : createMutation;

    const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);

    const { data: users = [], isLoading: isUsersLoading } = useUsersWithOrgDataQuery();

    const {
        data: existingMembers,
        isLoading: isExistingMembersLoading,
    } = useTeamMembersQuery(team?.id ?? 0);

    const existingMemberIds = useMemo(
        () => existingMembers?.map((m) => m.memberId) ?? [],
        [existingMembers],
    );

    const userOptions: UserOption[] = useMemo(
        () =>
            [...users]
                .sort((a, b) =>
                    (a.fullName ?? '').localeCompare(b.fullName ?? ''),
                )
                .map((u) => ({
                    id: u.id,
                    fullName: u.fullName,
                    positionTitle: u.positionTitle ?? null,
                    teamTitle: u.teamTitle ?? null,
                    email: u.email ?? null,
                })),
        [users],
    );

    const form = useForm<TeamFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(teamFormSchema) as any,
        defaultValues: buildDefaults(team, []),
        mode: 'onChange',
    });

    useEffect(() => {
        if (!isOpen) return;
        if (isCreate) {
            form.reset(buildDefaults(null, []));
            return;
        }
        if (isExistingMembersLoading) return;
        form.reset(buildDefaults(team, existingMemberIds));
    }, [
        isOpen,
        isCreate,
        team,
        existingMemberIds,
        isExistingMembersLoading,
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

    const onSubmit = (values: TeamFormValues) => {
        if (isCreate) {
            createMutation.mutate(values, {
                onSuccess: () => {
                    handleClose();
                },
            });
            return;
        }
        if (isEdit && team) {
            updateMutation.mutate(
                {
                    id: team.id,
                    values,
                    originalMemberIds: existingMemberIds,
                },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                },
            );
        }
    };

    const onInvalid = (errors: FieldErrors<TeamFormValues>) => {
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
        ? 'Create New Team'
        : isEdit
          ? 'Edit Team'
          : 'Team Details';

    const TitleIcon = isCreate ? Plus : isEdit ? Pencil : Eye;

    const submitLabel = isCreate
        ? mutation.isPending
            ? 'Creating...'
            : 'Create Team'
        : mutation.isPending
          ? 'Saving...'
          : 'Save Changes';

    const fieldsDisabled = isView;

    const watchedHeadId = form.watch('headId');
    const watchedMemberIds = form.watch('memberIds') ?? [];

    const headMemberId =
        watchedHeadId && watchedHeadId > 0 ? watchedHeadId : undefined;
    const lockedMemberIds = headMemberId ? [headMemberId] : [];

    const prevHeadIdRef = useRef<number | undefined>(headMemberId);
    useEffect(() => {
        if (!isOpen) {
            prevHeadIdRef.current = undefined;
            return;
        }
        const prev = prevHeadIdRef.current;
        const next = headMemberId;
        if (prev === next) return;

        const current = form.getValues('memberIds') ?? [];
        let updated = current;
        if (prev !== undefined && prev !== next) {
            updated = updated.filter((id) => id !== prev);
        }
        if (next !== undefined && !updated.includes(next)) {
            updated = [next, ...updated];
        }
        if (updated !== current) {
            form.setValue('memberIds', updated, { shouldValidate: true });
        }
        prevHeadIdRef.current = next;
    }, [isOpen, headMemberId, form]);

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
                                {team && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                        <span>#{team.id}</span>
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
                                    Basic information about the team.
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
                                        placeholder="e.g. Frontend Engineering"
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
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Optional description of the team..."
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
                                    Team Lead
                                </CardTitle>
                                <CardDescription>
                                    Optionally assign a user as the head of this
                                    team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserSingleCombobox
                                    options={userOptions}
                                    value={
                                        watchedHeadId && watchedHeadId > 0
                                            ? watchedHeadId
                                            : undefined
                                    }
                                    onChange={(id) =>
                                        form.setValue('headId', id ?? 0, {
                                            shouldValidate: true,
                                        })
                                    }
                                    placeholder={
                                        isUsersLoading
                                            ? 'Loading users...'
                                            : 'Select a team lead'
                                    }
                                    disabled={fieldsDisabled || isUsersLoading}
                                    allowClear
                                    clearLabel="No team lead"
                                />
                                {form.formState.errors.headId && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {form.formState.errors.headId.message}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-border bg-card">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">
                                    Team Members
                                </CardTitle>
                                <CardDescription>
                                    People who belong to this team.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserMultiCombobox
                                    options={userOptions}
                                    value={watchedMemberIds}
                                    onChange={(ids) =>
                                        form.setValue('memberIds', ids, {
                                            shouldValidate: true,
                                        })
                                    }
                                    placeholder={
                                        isUsersLoading
                                            ? 'Loading users...'
                                            : 'Select team members'
                                    }
                                    disabled={fieldsDisabled || isUsersLoading}
                                    lockedIds={lockedMemberIds}
                                />
                                {form.formState.errors.memberIds && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {
                                            form.formState.errors.memberIds
                                                .message
                                        }
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex flex-wrap justify-end gap-3 pt-2">
                            {isEdit && team && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-destructive/40 bg-red-50 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
                                    disabled={mutation.isPending}
                                    onClick={() => setDeletingTeam(team)}
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
                                                team,
                                                existingMemberIds,
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

            <DeleteTeamDialog
                team={deletingTeam}
                onClose={() => setDeletingTeam(null)}
                onSuccess={handleClose}
            />
        </>
    );
}
