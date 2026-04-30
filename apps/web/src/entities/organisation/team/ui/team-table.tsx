'use client';

import { format } from 'date-fns';
import {
    Award,
    Calendar,
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
    UserRound,
    UsersRound,
} from 'lucide-react';

import { cn } from '@/shared/lib/utils/cn';
import { AvatarGroupList } from '@/shared/ui/avatar-group-list';
import { AvatarGroupWithCount } from '@/shared/ui/avatar-group-with-count';
import { User } from '@entities/identity/user/model/mappers';
import { TeamMember } from '@entities/organisation/team-member/model/mappers';
import { Team } from '@entities/organisation/team/model/mappers';
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
import { UserBadgeWithPosition } from '@shared/ui/user-badge-with-position';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SortDirection } from '../model/types';

interface TeamTableProps {
    teams: Team[];
    users: { teamId: number; users: TeamMember[] }[];
    positions: Record<number, { id: number; title: string }[]>;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    onDelete?: (team: Team) => void;
    resetTrigger?: number;
}

function TeamActionsMenu({
    team,
    onDelete,
}: {
    team: Team;
    onDelete?: (team: Team) => void;
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
                <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => onDelete?.(team)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function TeamTable({
    teams,
    users,
    positions,
    sortField,
    sortDirection,
    onSort,
    onDelete,
    resetTrigger,
}: TeamTableProps) {
    const {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    } = useDraggableColumns<
        'title' | 'head' | 'positions' | 'users' | 'date' | 'actions'
    >('team-table', ['title', 'head', 'positions', 'users', 'date', 'actions']);

    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetOrder();
        }
    }, [resetTrigger, resetOrder]);

    const ExpandablePositions = ({
        positions,
    }: {
        positions: { id: number; title: string }[];
    }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        if (!positions?.length)
            return <span className="text-muted-foreground">None</span>;

        const firstPosition = positions[0].title;
        const extraCount = positions.length - 1;

        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }}
                className={cn(
                    'group flex flex-wrap items-center justify-start gap-1 cursor-pointer transition-all duration-200 p-1 rounded-md hover:bg-muted/50',
                    isExpanded ? 'bg-muted/30' : 'max-w-[400px]',
                )}
            >
                {isExpanded ? (
                    <div className="flex flex-row items-center justify-center gap-1">
                        <Award className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div className="flex flex-col flex-wrap gap-1 items-start justify-start text-start animate-in fade-in slide-in-from-top-1">
                            {positions.map((p, index) => (
                                <span
                                    key={p.id}
                                    className="text-sm font-medium text-foreground"
                                >
                                    {p.title}
                                    {index < positions.length - 1 ? ',' : ''}
                                </span>
                            ))}
                        </div>
                        <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0 ml-1" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-center gap-1 overflow-hidden">
                        <Award className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-sm font-medium truncate text-foreground">
                            {firstPosition}
                        </span>
                        {extraCount > 0 && (
                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">
                                +{extraCount}
                            </span>
                        )}
                        <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </div>
        );
    };

    const ExpandableUsers = ({ users }: { users: User[] }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        if (!users?.length)
            return (
                <div className="text-muted-foreground flex items-center justify-center">
                    —
                </div>
            );

        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }}
                className={cn(
                    'group flex flex-wrap items-center justify-start gap-1 cursor-pointer transition-all duration-200 p-1 rounded-md hover:bg-muted/50',
                    isExpanded ? 'bg-muted/30' : 'max-w-[400px]',
                )}
            >
                {isExpanded ? (
                    <div className="flex flex-wrap gap-1 items-center justify-start text-start animate-in fade-in slide-in-from-top-1">
                        <div className="flex items-start justify-start text-start">
                            <AvatarGroupList users={users} />
                        </div>
                        <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-1 overflow-hidden">
                        <AvatarGroupWithCount users={users} />
                        <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </div>
        );
    };

    const COLUMNS: Record<
        'title' | 'positions' | 'head' | 'users' | 'date' | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (team: Team) => React.ReactNode;
            cellClassName: string;
        }
    > = {
        title: {
            header: (
                <SortableHeader
                    label="Team"
                    field="title"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[200px] w-[300px] align-bottom cursor-grab active:cursor-grabbing rounded-full',
            cell: (team) => (
                <div className="flex flex-col gap-0.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {team.title}
                    </span>
                    {team.description && (
                        <span className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-1 gap-y-1 break-words overflow-wrap-anywhere">
                            {team.description}
                        </span>
                    )}
                </div>
            ),
            cellClassName: 'whitespace-normal',
        },
        head: {
            header: (
                <SortableHeader
                    label="Head"
                    field="head"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[200px] w-[300px] whitespace-nowrap text-start align-bottom cursor-grab active:cursor-grabbing',
            cell: (team) => {
                const teamUsers =
                    users.find((u) => u.teamId === team.id)?.users || [];
                const headUser = teamUsers
                    .map((u) => u.user)
                    .find((u) => u.id === team.headId);
                return (
                    <UserBadgeWithPosition
                        user={{
                            id: headUser?.id || 0,
                            fullName: headUser?.fullName || '',
                            positionTitle:
                                positions[team.id]?.find(
                                    (p) => p.id === headUser?.positionId,
                                )?.title || 'kjsdbcvkjvcb',
                            avatarUrl: headUser?.avatarUrl || '',
                            firstName: headUser?.firstName || '',
                            lastName: headUser?.lastName || '',
                        }}
                    />
                );
            },
            cellClassName:
                'whitespace-nowrap text-start justify-start items-start',
        },
        positions: {
            header: (
                <SortableHeader
                    label="Positions"
                    field="positions"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[200px] w-[250px] whitespace-nowrap text-start align-bottom cursor-grab active:cursor-grabbing',
            cell: (team) => (
                <ExpandablePositions positions={positions[team.id] || []} />
            ),
            cellClassName: 'text-center',
        },
        users: {
            header: (
                <SortableHeader
                    label="Users"
                    field="users"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[200px] w-[300px] whitespace-nowrap text-start align-bottom cursor-grab active:cursor-grabbing',
            cell: (team) => {
                const teamUsers =
                    users
                        .find((u) => u.teamId === team.id)
                        ?.users?.map((user) => user?.user) || [];
                return <ExpandableUsers users={teamUsers} />;
            },
            cellClassName:
                'whitespace-nowrap text-start justify-start items-start',
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
                'min-w-[150px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (team) => (
                <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                    <span className="text-foreground">
                        {format(team.createdAt, 'MMM dd, yyyy')}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        actions: {
            header: <span className="text-muted-foreground"> Actions </span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center pb-1',
            cell: (team) => <TeamActionsMenu team={team} onDelete={onDelete} />,
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (teams.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <UsersRound className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No teams found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or create a new team.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile card layout (hidden on md+) */}
            <div className="flex flex-col gap-3 lg:hidden">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-x-2 gap-y-1 font-medium text-foreground flex-wrap">
                                    <span className="break-words">
                                        {team.title}
                                    </span>
                                </p>
                                {team.description && (
                                    <p className="mt-0.5 flex flex-row gap-x-4 gap-y-2 text-sm text-muted-foreground flex-wrap">
                                        {team.description && (
                                            <span className="flex items-center gap-1 break-words">
                                                {team.description}
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                            <TeamActionsMenu team={team} onDelete={onDelete} />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Award className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-medium text-foreground">
                                    {positions[team.id]
                                        ? positions[team.id].length
                                        : `—`}
                                </span>
                                {' positions'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <UserRound className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-medium text-foreground">
                                    {(() => {
                                        const u = users.find(
                                            (u) => u.teamId === team.id,
                                        )?.users;
                                        return u && u.length > 0
                                            ? u.length
                                            : `—`;
                                    })()}
                                </span>
                                {' members'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="font-medium text-muted-foreground break-words">
                                    {format(team.createdAt, 'MMM dd, yyyy')}
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
                        {teams.map((team) => (
                            <TableRow key={team.id}>
                                {columnOrder.map((id) => {
                                    const col = COLUMNS[id];
                                    return (
                                        <TableCell
                                            key={id}
                                            className={col.cellClassName}
                                        >
                                            {col.cell(team)}
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
