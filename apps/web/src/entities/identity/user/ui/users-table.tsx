'use client';

import { format } from 'date-fns';
import {
    Award,
    Calendar,
    Crown,
    Eye,
    Mail,
    MoreHorizontal,
    OctagonMinus,
    Pencil,
    Trash2,
    UserRound,
    UsersRound,
} from 'lucide-react';

import { User } from '@entities/identity/user/model/mappers';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';
import { Button } from '@shared/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@shared/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@shared/components/ui/table';
import { useDraggableColumns } from '@shared/lib/hooks/use-draggable-columns';
import { SortableHeader } from '@shared/ui/sortable-table-column-header';
import { useEffect } from 'react';
import { IdentityStatus, SortDirection } from '../model/types';
import { RoleBadge } from './role-badge';
import { StatusBadge } from './status-badge';

interface UsersTableProps {
    users: User[];
    positionTitles: Record<number, string>;
    teamTitles: Record<number, string>;
    managerNames: Record<number, string>;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    onView?: (user: User) => void;
    onEdit?: (user: User) => void;
    onDeactivate?: (user: User) => void;
    onDelete?: (user: User) => void;
    resetTrigger?: number;
}

function UserActionsMenu({
    user,
    onView,
    onEdit,
    onDeactivate,
    onDelete,
}: {
    user: User;
    onView?: (user: User) => void;
    onEdit?: (user: User) => void;
    onDeactivate?: (user: User) => void;
    onDelete?: (user: User) => void;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open actions</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView?.(user)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(user)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user.status === IdentityStatus.ACTIVE && (
                    <DropdownMenuItem
                        className="text-amber-700 focus:bg-amber-50 focus:text-amber-800"
                        onClick={() => onDeactivate?.(user)}
                    >
                        <OctagonMinus className="mr-2 h-4 w-4" />
                        Deactivate
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => onDelete?.(user)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function UsersTable({
    users,
    positionTitles,
    teamTitles,
    managerNames,
    sortField,
    sortDirection,
    onSort,
    onView,
    onEdit,
    onDeactivate,
    onDelete,
    resetTrigger,
}: UsersTableProps) {
    const {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    } = useDraggableColumns<
        | 'fullname'
        | 'role'
        | 'email'
        | 'position'
        | 'team'
        | 'manager'
        | 'date'
        | 'status'
        | 'actions'
    >('users-table', [
        'fullname',
        'role',
        'email',
        'position',
        'team',
        'manager',
        'date',
        'status',
        'actions',
    ]);

    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetOrder();
        }
    }, [resetTrigger, resetOrder]);

    const COLUMNS: Record<
        | 'fullname'
        | 'role'
        | 'email'
        | 'position'
        | 'team'
        | 'manager'
        | 'date'
        | 'status'
        | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (user: User) => React.ReactNode;
            cellClassName: string;
        }
    > = {
        fullname: {
            header: (
                <SortableHeader
                    label="Full Name"
                    field="fullname"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[300px] w-[350px] cursor-grab active:cursor-grabbing',
            cell: (user) => (
                <div className="flex flex-row items-center gap-1.5 w-full">
                    <Avatar className="border-2 border-black/10 bg-neutral-100 rounded-full">
                        <AvatarImage
                            className="object-cover bg-white/20 text-black text-xs font-medium"
                            src={user.avatarUrl?.toString()}
                            alt={user.fullName}
                        />
                        <AvatarFallback className="bg-white/20 text-black text-xs font-medium">
                            {user.lastName?.charAt(0) +
                                user.firstName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {user.fullName ??
                            `${user.lastName ?? ''} ${user.firstName ?? ''}${user.secondName ? ` ${user.secondName}` : ''}`}
                    </span>
                </div>
            ),
            cellClassName: 'min-w-[200px] whitespace-normal',
        },
        role: {
            header: (
                <SortableHeader
                    label="Role"
                    field="role"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (user) => (
                <div className="flex flex-wrap items-center justify-center gap-1">
                    {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role) => (
                            <RoleBadge key={role} role={role} />
                        ))
                    ) : (
                        <span className="text-muted-foreground">None</span>
                    )}
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        email: {
            header: (
                <SortableHeader
                    label="Email"
                    field="email"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[250px] w-[300px] whitespace-nowrap cursor-grab active:cursor-grabbing',
            cell: (user) => (
                <div className="flex items-center justify-start gap-1.5 w-full">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {user.email}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-normal',
        },
        position: {
            header: (
                <SortableHeader
                    label="Position"
                    field="position"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[200px] w-[250px] whitespace-nowrap cursor-grab active:cursor-grabbing',
            cell: (user) => (
                <div className="flex items-center justify-start gap-1.5 w-full">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {user.positionId ? (
                            (positionTitles[user.positionId] ?? (
                                <span className="text-muted-foreground">
                                    None
                                </span>
                            ))
                        ) : (
                            <span className="text-muted-foreground">None</span>
                        )}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap',
        },
        team: {
            header: (
                <SortableHeader
                    label="Team"
                    field="team"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[200px] whitespace-nowrap cursor-grab active:cursor-grabbing',
            cell: (user) => (
                <div className="flex items-center justify-start gap-1.5 w-full">
                    <UsersRound className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {user.teamId ? (
                            (teamTitles[user.teamId] ?? (
                                <span className="text-muted-foreground">
                                    None
                                </span>
                            ))
                        ) : (
                            <span className="text-muted-foreground">None</span>
                        )}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        manager: {
            header: (
                <SortableHeader
                    label="Manager"
                    field="manager"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[250px] w-[300px] whitespace-nowrap cursor-grab active:cursor-grabbing',
            cell: (user) => (
                <div className="flex items-center justify-start gap-1.5 w-full">
                    <Crown className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {user.managerId ? (
                            (managerNames[user.managerId] ?? (
                                <span className="text-muted-foreground">
                                    None
                                </span>
                            ))
                        ) : (
                            <span className="text-muted-foreground">None</span>
                        )}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        date: {
            header: (
                <SortableHeader
                    label="Creation Date"
                    field="createdAt"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[100px] w-[150px] whitespace-nowrap align-bottom cursor-grab active:cursor-grabbing',
            cell: (user) => (
                <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                    <span className="text-foreground">
                        {user.createdAt
                            ? format(user.createdAt, 'MMM dd, yyyy')
                            : 'None'}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap',
        },
        status: {
            header: (
                <SortableHeader
                    label="Status"
                    field="status"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (user) => <StatusBadge key={user.id} status={user.status} />,
            cellClassName: 'whitespace-nowrap text-center',
        },
        actions: {
            header: <span className="text-muted-foreground">Actions</span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center pb-1',
            cell: (user) => (
                <UserActionsMenu
                    user={user}
                    onView={onView}
                    onEdit={onEdit}
                    onDeactivate={onDeactivate}
                    onDelete={onDelete}
                />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <UserRound className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No users found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or create a new user.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile card layout (hidden on md+) */}
            <div className="flex flex-col gap-3 lg:hidden">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-x-2 gap-y-1 font-medium text-foreground flex-wrap">
                                    <span className="break-words">
                                        {user.fullName ??
                                            `${user.lastName ?? ''} ${user.firstName ?? ''}${user.secondName ? ` ${user.secondName}` : ''}`}
                                    </span>
                                    <span className="whitespace-nowrap">
                                        {user.status ? (
                                            <StatusBadge
                                                key={user.id}
                                                status={user.status}
                                            />
                                        ) : (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
                                        )}
                                    </span>
                                </p>
                                {user.roles && (
                                    <p className="mt-0.5 flex flex-row gap-x-2 gap-y-2 text-sm text-muted-foreground flex-wrap">
                                        {user.roles.map((role) => (
                                            <span
                                                key={`${user.id}-${role}`}
                                                className="flex items-center gap-1 break-words"
                                            >
                                                <RoleBadge
                                                    key={role.toString()}
                                                    role={role}
                                                />
                                            </span>
                                        ))}
                                    </p>
                                )}
                            </div>
                            <UserActionsMenu
                                user={user}
                                onView={onView}
                                onEdit={onEdit}
                                onDeactivate={onDeactivate}
                                onDelete={onDelete}
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {user.email ?? 'None'}
                                </span>
                            </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Award className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {user.positionId ? (
                                        (positionTitles[user.positionId] ?? (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground">
                                            None
                                        </span>
                                    )}
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <UsersRound className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {user.teamId ? (
                                        (teamTitles[user.teamId] ?? (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground">
                                            None
                                        </span>
                                    )}
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Crown className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {user.managerId ? (
                                        (managerNames[user.managerId] ?? (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-muted-foreground">
                                            None
                                        </span>
                                    )}
                                </span>
                            </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-muted-foreground break-words">
                                    {format(user.createdAt, 'MMM dd, yyyy')}
                                </span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table layout (visible on md+) */}
            <div className="hidden overflow-x-auto lg:block">
                <Table className="w-full table-fixed">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {columnOrder.map((id) => {
                                const col = COLUMNS[id];
                                return (
                                    <TableHead
                                        key={id}
                                        className={col.headerClassName}
                                        draggable={id !== 'actions'}
                                        onDragStart={() => handleDragStart(id)}
                                        onDragEnter={() => handleDragEnter(id)}
                                        onDragEnd={handleDragEnd}
                                        onDragOver={(e) => e.preventDefault()}
                                    >
                                        {col.header}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                {columnOrder.map((id) => {
                                    const col = COLUMNS[id];
                                    return (
                                        <TableCell
                                            key={id}
                                            className={col.cellClassName}
                                        >
                                            {col.cell(user)}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
