'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
    Check,
    ChevronsUpDown,
    Eye,
    OctagonMinus,
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

import { useUsersWithOrgDataQuery } from '@entities/identity/user/api/user.queries';
import type { User } from '@entities/identity/user/model/mappers';
import {
    IDENTITY_ROLES_ENUM_VALUES,
    IDENTITY_STATUSES_ENUM_VALUES,
    IdentityRole,
    IdentityStatus,
} from '@entities/identity/user/model/types';
import { RoleBadge } from '@entities/identity/user/ui/role-badge';
import { StatusBadge } from '@entities/identity/user/ui/status-badge';
import { usePositionsQuery } from '@entities/organisation/position/api/position.queries';
import { useTeamsQuery } from '@entities/organisation/team/api/team.queries';
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

import { DeactivateUserDialog } from '../../deactivate/ui/DeactivateUserDialog';
import { DeleteUserDialog } from '../../delete/ui/DeleteUserDialog';
import {
    useCreateUserFormMutation,
    useUpdateUserFormMutation,
} from '../api/user-form.mutation';
import { userFormSchema, type UserFormValues } from '../model/user-form.schema';

export type UserFormMode = 'create' | 'edit' | 'view';

interface UserFormDialogProps {
    mode: UserFormMode;
    user?: User | null;
    open?: boolean;
    onClose: () => void;
}

const inputClassName =
    'border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground rounded-xl';

function buildDefaults(user?: User | null): UserFormValues {
    if (!user) {
        return {
            firstName: '',
            secondName: '',
            lastName: '',
            email: '',
            status: IdentityStatus.ACTIVE,
            roles: [IdentityRole.EMPLOYEE],
            positionId: 0,
            teamId: 0,
            managerId: 0,
        };
    }
    return {
        firstName: user.firstName ?? '',
        secondName: user.secondName ?? '',
        lastName: user.lastName ?? '',
        email: user.email ?? '',
        status: user.status,
        roles:
            (user.roles ?? []).length > 0
                ? user.roles
                : [IdentityRole.EMPLOYEE],
        positionId: user.positionId ?? 0,
        teamId: user.teamId ?? 0,
        managerId: user.managerId ?? 0,
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
    allowClear,
    clearLabel,
}: {
    options: EntityOption[];
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    placeholder: string;
    searchPlaceholder: string;
    emptyText: string;
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

export function UserFormDialog({
    mode,
    user,
    open,
    onClose,
}: UserFormDialogProps) {
    const isCreate = mode === 'create';
    const isEdit = mode === 'edit';
    const isView = mode === 'view';

    const isOpen = isCreate ? !!open : user != null;

    const createMutation = useCreateUserFormMutation();
    const updateMutation = useUpdateUserFormMutation();
    const mutation = isEdit ? updateMutation : createMutation;

    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [deactivatingUser, setDeactivatingUser] = useState<User | null>(null);

    const { data: positions = [], isLoading: isPositionsLoading } =
        usePositionsQuery();
    const { data: teams = [], isLoading: isTeamsLoading } = useTeamsQuery();
    const { data: allUsers = [], isLoading: isUsersLoading } =
        useUsersWithOrgDataQuery();

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

    const teamOptions: EntityOption[] = useMemo(
        () =>
            [...teams]
                .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
                .map((t) => ({
                    id: t.id,
                    title: t.title,
                    subtitle: t.description ?? null,
                })),
        [teams],
    );

    const managerOptions: EntityOption[] = useMemo(
        () =>
            [...allUsers]
                .filter((u) => u.id !== user?.id)
                .sort((a, b) =>
                    (a.fullName ?? '').localeCompare(b.fullName ?? ''),
                )
                .map((u) => ({
                    id: u.id,
                    title: u.fullName,
                    subtitle:
                        [u.positionTitle, u.teamTitle]
                            .filter(Boolean)
                            .join(' · ') || null,
                })),
        [allUsers, user?.id],
    );

    const form = useForm<UserFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(userFormSchema) as any,
        defaultValues: buildDefaults(user),
        mode: 'onChange',
    });

    useEffect(() => {
        if (!isOpen) return;
        form.reset(buildDefaults(user));
    }, [isOpen, user, form]);

    const handleOpenChange = (next: boolean) => {
        if (!next) onClose();
    };

    const handleClose = () => {
        form.reset(buildDefaults(null));
        onClose();
    };

    const onSubmit = (values: UserFormValues) => {
        if (isCreate) {
            createMutation.mutate(values, {
                onSuccess: () => {
                    handleClose();
                },
            });
            return;
        }
        if (isEdit && user) {
            updateMutation.mutate(
                {
                    id: user.id,
                    values,
                    originalRoles: user.roles ?? [],
                },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                },
            );
        }
    };

    const onInvalid = (errors: FieldErrors<UserFormValues>) => {
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
        ? 'Create New User'
        : isEdit
          ? 'Edit User'
          : 'User Details';

    const TitleIcon = isCreate ? Plus : isEdit ? Pencil : Eye;

    const submitLabel = isCreate
        ? mutation.isPending
            ? 'Creating...'
            : 'Create User'
        : mutation.isPending
          ? 'Saving...'
          : 'Save Changes';

    const fieldsDisabled = isView;
    const watchedStatus = form.watch('status');
    const watchedRoles = form.watch('roles') ?? [];
    const watchedPositionId = form.watch('positionId');
    const watchedTeamId = form.watch('teamId');
    const watchedManagerId = form.watch('managerId');

    const toggleRole = (role: IdentityRole) => {
        const current = form.getValues('roles') ?? [];
        const next = current.includes(role)
            ? current.filter((r) => r !== role)
            : [...current, role];
        form.setValue('roles', next, { shouldValidate: true });
    };

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
                                    {user && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                            <span>#{user.id}</span>
                                            <span>·</span>
                                            <StatusBadge status={user.status} />
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
                                        Basic information about the user.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="firstName">
                                                First Name{' '}
                                                {!isView && (
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                )}
                                            </Label>
                                            <Input
                                                id="firstName"
                                                placeholder="Ліна"
                                                disabled={fieldsDisabled}
                                                className={inputClassName}
                                                {...form.register('firstName')}
                                            />
                                            {form.formState.errors
                                                .firstName && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        form.formState.errors
                                                            .firstName.message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="lastName">
                                                Last Name{' '}
                                                {!isView && (
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                )}
                                            </Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Костенко"
                                                disabled={fieldsDisabled}
                                                className={inputClassName}
                                                {...form.register('lastName')}
                                            />
                                            {form.formState.errors.lastName && (
                                                <p className="text-sm text-destructive">
                                                    {
                                                        form.formState.errors
                                                            .lastName.message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="secondName">
                                            Second Name
                                        </Label>
                                        <Input
                                            id="secondName"
                                            placeholder="Василівна"
                                            disabled={fieldsDisabled}
                                            className={inputClassName}
                                            {...form.register('secondName')}
                                        />
                                        {form.formState.errors.secondName && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    form.formState.errors
                                                        .secondName.message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email">
                                            Email{' '}
                                            {!isView && (
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            )}
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="lina.kostenko@intra.com"
                                            disabled={fieldsDisabled || isEdit}
                                            className={inputClassName}
                                            {...form.register('email')}
                                        />
                                        {form.formState.errors.email && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    form.formState.errors.email
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
                                        Access
                                    </CardTitle>
                                    <CardDescription>
                                        Account status and roles.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                                value={watchedStatus ?? ''}
                                                onValueChange={(value) =>
                                                    form.setValue(
                                                        'status',
                                                        value as IdentityStatus,
                                                        {
                                                            shouldValidate: true,
                                                        },
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
                                                    {IDENTITY_STATUSES_ENUM_VALUES.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={option}
                                                                value={option}
                                                            >
                                                                <StatusBadge
                                                                    status={
                                                                        option as IdentityStatus
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
                                                        form.formState.errors
                                                            .status.message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>
                                            Roles{' '}
                                            {!isView && (
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            )}
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {IDENTITY_ROLES_ENUM_VALUES.map(
                                                (role) => {
                                                    const isSelected =
                                                        watchedRoles.includes(
                                                            role as IdentityRole,
                                                        );
                                                    return (
                                                        <button
                                                            key={role}
                                                            type="button"
                                                            disabled={
                                                                fieldsDisabled
                                                            }
                                                            onClick={() =>
                                                                toggleRole(
                                                                    role as IdentityRole,
                                                                )
                                                            }
                                                            className={cn(
                                                                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition',
                                                                isSelected
                                                                    ? 'border-primary bg-primary/5'
                                                                    : 'border-border bg-secondary/30 opacity-60 hover:opacity-100',
                                                                fieldsDisabled &&
                                                                    'cursor-not-allowed',
                                                            )}
                                                        >
                                                            {isSelected && (
                                                                <Check className="h-3.5 w-3.5 text-primary" />
                                                            )}
                                                            <RoleBadge
                                                                role={
                                                                    role as IdentityRole
                                                                }
                                                            />
                                                        </button>
                                                    );
                                                },
                                            )}
                                        </div>
                                        {form.formState.errors.roles && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    form.formState.errors.roles
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
                                        Organisation
                                    </CardTitle>
                                    <CardDescription>
                                        Position, team and direct manager.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label>Position</Label>
                                        <EntitySingleCombobox
                                            options={positionOptions}
                                            value={
                                                watchedPositionId &&
                                                watchedPositionId > 0
                                                    ? watchedPositionId
                                                    : undefined
                                            }
                                            onChange={(id) =>
                                                form.setValue(
                                                    'positionId',
                                                    id ?? 0,
                                                    {
                                                        shouldValidate: true,
                                                    },
                                                )
                                            }
                                            placeholder={
                                                isPositionsLoading
                                                    ? 'Loading positions...'
                                                    : 'Select a position'
                                            }
                                            searchPlaceholder="Search positions..."
                                            emptyText="No positions found."
                                            disabled={
                                                fieldsDisabled ||
                                                isPositionsLoading
                                            }
                                            allowClear
                                            clearLabel="No position"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Team</Label>
                                        <EntitySingleCombobox
                                            options={teamOptions}
                                            value={
                                                watchedTeamId &&
                                                watchedTeamId > 0
                                                    ? watchedTeamId
                                                    : undefined
                                            }
                                            onChange={(id) =>
                                                form.setValue(
                                                    'teamId',
                                                    id ?? 0,
                                                    {
                                                        shouldValidate: true,
                                                    },
                                                )
                                            }
                                            placeholder={
                                                isTeamsLoading
                                                    ? 'Loading teams...'
                                                    : 'Select a team'
                                            }
                                            searchPlaceholder="Search teams..."
                                            emptyText="No teams found."
                                            disabled={
                                                fieldsDisabled || isTeamsLoading
                                            }
                                            allowClear
                                            clearLabel="No team"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label>Manager</Label>
                                        <EntitySingleCombobox
                                            options={managerOptions}
                                            value={
                                                watchedManagerId &&
                                                watchedManagerId > 0
                                                    ? watchedManagerId
                                                    : undefined
                                            }
                                            onChange={(id) =>
                                                form.setValue(
                                                    'managerId',
                                                    id ?? 0,
                                                    {
                                                        shouldValidate: true,
                                                    },
                                                )
                                            }
                                            placeholder={
                                                isUsersLoading
                                                    ? 'Loading users...'
                                                    : 'Select a manager'
                                            }
                                            searchPlaceholder="Search by name, email..."
                                            emptyText="No users found."
                                            disabled={
                                                fieldsDisabled || isUsersLoading
                                            }
                                            allowClear
                                            clearLabel="No manager"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-wrap justify-end gap-3 pt-2">
                                {isEdit && user && (
                                    <>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="border-destructive/40 bg-red-50 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
                                            disabled={mutation.isPending}
                                            onClick={() =>
                                                setDeletingUser(user)
                                            }
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                        {user.status ===
                                            IdentityStatus.ACTIVE && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-900 rounded-xl"
                                                disabled={mutation.isPending}
                                                onClick={() =>
                                                    setDeactivatingUser(user)
                                                }
                                            >
                                                <OctagonMinus className="mr-2 h-4 w-4" />
                                                Deactivate
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
                                            form.reset(buildDefaults(user))
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

            <DeleteUserDialog
                user={deletingUser}
                onClose={() => setDeletingUser(null)}
                onSuccess={handleClose}
            />
            <DeactivateUserDialog
                user={deactivatingUser}
                onClose={() => setDeactivatingUser(null)}
                onSuccess={handleClose}
            />
        </>
    );
}
