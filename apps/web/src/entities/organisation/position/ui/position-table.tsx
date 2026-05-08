'use client';

import { format } from 'date-fns';
import {
    Award,
<<<<<<< HEAD
    Bookmark,
=======
>>>>>>> main
    Calendar,
    Eye,
    MoreHorizontal,
    Pencil,
    Trash2,
    UserRound,
<<<<<<< HEAD
=======
    Users,
>>>>>>> main
} from 'lucide-react';

import { cn } from '@/shared/lib/utils/cn';
import { AvatarGroupList } from '@/shared/ui/avatar-group-list';
import { AvatarGroupWithCount } from '@/shared/ui/avatar-group-with-count';
import { User } from '@entities/identity/user/model/mappers';
import { Position } from '@entities/organisation/position/model/mappers';
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
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SortDirection } from '../model/types';

interface PositionTableProps {
    positions: Position[];
    competenceTitles: Record<number, { id: number; title: string }[]>;
    users: { positionId: number; users: User[] }[];
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    onDelete?: (position: Position) => void;
    resetTrigger?: number;
}

function PositionActionsMenu({
    position,
    onDelete,
}: {
    position: Position;
    onDelete?: (position: Position) => void;
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
                    onClick={() => onDelete?.(position)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function PositionTable({
    positions,
    competenceTitles,
    users,
    sortField,
    sortDirection,
    onSort,
    onDelete,
    resetTrigger,
}: PositionTableProps) {
    const {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    } = useDraggableColumns<
        'title' | 'competences' | 'users' | 'date' | 'actions'
    >('position-table', ['title', 'competences', 'users', 'date', 'actions']);

    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetOrder();
        }
    }, [resetTrigger, resetOrder]);

    const ExpandableCompetences = ({
        competences,
    }: {
        competences: { id: number; title: string }[];
    }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        if (!competences?.length)
<<<<<<< HEAD
            return (
                <span className="flex items-center justify-start gap-1 p-1">
                    <Bookmark className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">None</span>
                </span>
            );
=======
            return <span className="text-muted-foreground"> None </span>;
>>>>>>> main

        const firstCompetence = competences[0].title;
        const extraCount = competences.length - 1;

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
<<<<<<< HEAD
                <Bookmark className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
=======
                <Award className="h-3.5 w-3.5 shrink-0" />
>>>>>>> main
                {isExpanded ? (
                    <div className="flex flex-col items-start justify-start text-start flex-wrap gap-1 items-center justify-center animate-in fade-in slide-in-from-top-1">
                        {competences.map((c, index) => (
                            <span
                                key={c.id}
                                className="text-sm font-medium text-foreground"
                            >
                                {c.title}
                                {index < competences.length - 1 ? ',' : ''}
                            </span>
                        ))}
                        <ChevronUp className="h-3 w-3 text-muted-foreground ml-1" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-center gap-1 overflow-hidden">
                        <span className="text-sm font-medium truncate text-foreground">
                            {firstCompetence}
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
<<<<<<< HEAD
                <div className="text-muted-foreground flex items-center justify-start">
                    <span className="text-sm text-muted-foreground">None</span>
=======
                <div className="text-muted-foreground flex items-center justify-center">
                    —
>>>>>>> main
                </div>
            );

        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }}
                className={cn(
<<<<<<< HEAD
                    'group flex flex-wrap items-center justify-start gap-1 cursor-pointer transition-all duration-200 p-1 rounded-md hover:bg-muted/50',
=======
                    'group flex flex-wrap items-center justify-center gap-1 cursor-pointer transition-all duration-200 p-1 rounded-md hover:bg-muted/50',
>>>>>>> main
                    isExpanded ? 'bg-muted/30' : 'max-w-[400px]',
                )}
            >
                {isExpanded ? (
<<<<<<< HEAD
                    <div className="flex flex-row items-center justify-center gap-1">
                        <div className="flex flex-col flex-wrap gap-1 items-start justify-start animate-in fade-in slide-in-from-top-1">
                            <AvatarGroupList users={users} />
                        </div>
                        <ChevronUp className="h-3 w-3 text-muted-foreground" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-center gap-1">
=======
                    <div className="flex flex-wrap gap-1 items-center justify-center text-center animate-in fade-in slide-in-from-top-1">
                        <div className="flex items-start justify-start text-start">
                            <AvatarGroupList users={users} />
                        </div>
                        <ChevronUp className="h-3 w-3 text-muted-foreground ml-1" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-1 overflow-hidden">
>>>>>>> main
                        <AvatarGroupWithCount users={users} />
                        <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </div>
        );
    };

    const COLUMNS: Record<
        'title' | 'competences' | 'users' | 'date' | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (position: Position) => React.ReactNode;
            cellClassName: string;
        }
    > = {
        title: {
            header: (
                <SortableHeader
                    label="Position"
                    field="title"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[200px] w-[300px] align-bottom cursor-grab active:cursor-grabbing rounded-full',
            cell: (position) => (
                <div className="flex flex-col gap-0.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {position.title}
                    </span>
                    {position.description && (
                        <span className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-1 gap-y-1 break-words overflow-wrap-anywhere">
                            {position.description}
                        </span>
                    )}
                </div>
            ),
            cellClassName: 'whitespace-normal',
        },
        competences: {
            header: (
                <SortableHeader
                    label="Competences"
                    field="competenceTitles"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
<<<<<<< HEAD
                'min-w-[200px] w-[250px] whitespace-nowrap text-start align-bottom cursor-grab active:cursor-grabbing',
=======
                'min-w-[200px] w-[250px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
>>>>>>> main
            cell: (position) => (
                <ExpandableCompetences
                    competences={competenceTitles[position.id] || []}
                />
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
<<<<<<< HEAD
                'min-w-[200px] w-[300px] whitespace-nowrap text-start align-bottom cursor-grab active:cursor-grabbing',
=======
                'min-w-[200px] w-[300px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
>>>>>>> main
            cell: (position) => {
                const positionUsers =
                    users.find((u) => u.positionId === position.id)?.users ||
                    [];
                return <ExpandableUsers users={positionUsers} />;
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
            cell: (position) => (
                <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                    <span className="text-foreground">
                        {format(position.createdAt, 'MMM dd, yyyy')}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        actions: {
            header: <span className="text-muted-foreground"> Actions </span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center pb-1',
            cell: (position) => (
                <PositionActionsMenu position={position} onDelete={onDelete} />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (positions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
<<<<<<< HEAD
                    <Award className="h-8 w-8 text-muted-foreground" />
=======
                    <Users className="h-8 w-8 text-muted-foreground" />
>>>>>>> main
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No positions found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or create a new position.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile card layout (hidden on md+) */}
            <div className="flex flex-col gap-3 lg:hidden">
                {positions.map((position) => (
                    <div
                        key={position.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-x-2 gap-y-1 font-medium text-foreground flex-wrap">
                                    <span className="break-words">
                                        {position.title}
                                    </span>
                                </p>
                                {position.description && (
                                    <p className="mt-0.5 flex flex-row gap-x-4 gap-y-2 text-sm text-muted-foreground flex-wrap">
                                        {position.description && (
                                            <span className="flex items-center gap-1 break-words">
                                                {position.description}
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                            <PositionActionsMenu
                                position={position}
                                onDelete={onDelete}
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
<<<<<<< HEAD
                                <Bookmark className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
=======
                                <Award className="h-3.5 w-3.5 shrink-0" />
>>>>>>> main
                                <span className="font-medium text-foreground">
                                    {competenceTitles[position.id]
                                        ? competenceTitles[position.id].length
                                        : `—`}
                                </span>
<<<<<<< HEAD
                                {(() => {
                                    const c = competenceTitles[position.id];
                                    return c && c.length === 1
                                        ? ' competence'
                                        : ' competences';
                                })()}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <UserRound className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
=======
                                {' competences'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <UserRound className="h-3.5 w-3.5 shrink-0" />
>>>>>>> main
                                <span className="font-medium text-foreground">
                                    {(() => {
                                        const u = users.find(
                                            (u) => u.positionId === position.id,
                                        )?.users;
                                        return u && u.length > 0
                                            ? u.length
                                            : `—`;
                                    })()}
                                </span>
<<<<<<< HEAD
                                {(() => {
                                    const u = users.find(
                                        (u) => u.positionId === position.id,
                                    )?.users;
                                    return u && u.length === 1
                                        ? ' user'
                                        : ' users';
                                })()}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
=======
                                {' users'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
>>>>>>> main
                                <span className="font-medium text-muted-foreground break-words">
                                    {format(position.createdAt, 'MMM dd, yyyy')}
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
                        {positions.map((position) => (
                            <TableRow key={position.id}>
                                {columnOrder.map((id) => {
                                    const col = COLUMNS[id];
                                    return (
                                        <TableCell
                                            key={id}
                                            className={col.cellClassName}
                                        >
                                            {col.cell(position)}
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
