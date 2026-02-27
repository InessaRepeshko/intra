'use client';

import { format } from 'date-fns';
import {
    Calendar,
    Eye,
    MoreHorizontal,
    Pencil,
    StopCircle,
    Trash2,
    Users,
} from 'lucide-react';

import type { Cycle } from '@entities/feedback360/cycle/model/mappers';
import { CycleStage } from '@entities/feedback360/cycle/model/types';
import { Button } from '@shared/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@shared/components/ui/dropdown-menu';
import { Spinner } from '@shared/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@shared/components/ui/table';
import { SortableHeader } from '@shared/ui/sortable-table-column-header';
import { SortDirection } from '../model/types';
import { StageBadge } from './stage-badge';

interface CyclesTableProps {
    cycles: Cycle[];
    reviewCounts: Record<number, number>;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    onForceFinish?: (cycle: Cycle) => void;
    onDelete?: (cycle: Cycle) => void;
}

function CycleActionsMenu({
    cycle,
    onForceFinish,
    onDelete,
}: {
    cycle: Cycle;
    onForceFinish?: (cycle: Cycle) => void;
    onDelete?: (cycle: Cycle) => void;
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
                {cycle.stage === CycleStage.ACTIVE && (
                    <DropdownMenuItem
                        className="text-amber-700 focus:bg-amber-50 focus:text-amber-800"
                        onClick={() => onForceFinish?.(cycle)}
                    >
                        <StopCircle className="mr-2 h-4 w-4" />
                        Force Finish
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => onDelete?.(cycle)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function CyclesTable({
    cycles,
    reviewCounts,
    sortField,
    sortDirection,
    onSort,
    onForceFinish,
    onDelete,
}: CyclesTableProps) {
    if (cycles.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No cycles found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or create a new feedback cycle.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile card layout (hidden on md+) */}
            <div className="flex flex-col gap-3 lg:hidden">
                {cycles.map((cycle) => (
                    <div
                        key={cycle.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-2 font-medium text-foreground flex-wrap">
                                    <span className="break-words">
                                        {cycle.title}
                                    </span>
                                    <span className="whitespace-nowrap">
                                        <StageBadge
                                            key={cycle.stage}
                                            stage={cycle.stage}
                                        />
                                    </span>
                                </p>
                                {cycle.description && (
                                    <p className="mt-0.5 text-sm text-muted-foreground break-words">
                                        {cycle.description}
                                    </p>
                                )}
                            </div>
                            <CycleActionsMenu
                                cycle={cycle}
                                onForceFinish={onForceFinish}
                                onDelete={onDelete}
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="whitespace-nowrap flex flex-wrap gap-x-1 gap-y-0.5 text-muted-foreground items-center">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="break-words">
                                    {format(cycle.startDate, 'MMM dd, yyyy')}
                                </span>
                                <span className="break-words">{' – '}</span>
                                <span className="break-words">
                                    {format(cycle.endDate, 'MMM dd, yyyy')}
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {reviewCounts[cycle.id] ?? <Spinner />}
                                </span>
                                {' reviews'}
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
                            <TableHead className="min-w-[300px] w-[300px]">
                                <SortableHeader
                                    label="Name"
                                    field="title"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[70px] w-[120px] whitespace-nowrap">
                                <SortableHeader
                                    label="Dates"
                                    field="startDate"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[70px] w-[120px] whitespace-nowrap text-center">
                                <SortableHeader
                                    label="Stage"
                                    field="stage"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[80px] w-[100px] whitespace-nowrap text-center">
                                <SortableHeader
                                    label="Reviews"
                                    field="reviewCount"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[80px] w-[100px] whitespace-nowrap text-center pb-1">
                                <span className="text-muted-foreground">
                                    Actions
                                </span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cycles.map((cycle) => (
                            <TableRow key={cycle.id}>
                                <TableCell className="min-w-[100px] whitespace-normal">
                                    <div className="flex flex-col gap-0.5 w-full">
                                        <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                                            {cycle.title}
                                        </span>
                                        {cycle.description && (
                                            <span className="text-sm text-muted-foreground break-words overflow-wrap-anywhere">
                                                {cycle.description}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <div className="flex flex-col gap-0.5 text-sm">
                                        <span className="text-foreground">
                                            {format(
                                                cycle.startDate,
                                                'MMM dd, yyyy',
                                            )}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {format(
                                                cycle.endDate,
                                                'MMM dd, yyyy',
                                            )}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-center">
                                    <StageBadge
                                        key={cycle.stage}
                                        stage={cycle.stage}
                                    />
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-foreground">
                                            {reviewCounts[cycle.id] ?? (
                                                <Spinner />
                                            )}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-center">
                                    <CycleActionsMenu
                                        cycle={cycle}
                                        onForceFinish={onForceFinish}
                                        onDelete={onDelete}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
