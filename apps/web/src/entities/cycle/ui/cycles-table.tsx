'use client';

import { format } from 'date-fns';
import {
    ArrowUpDown,
    Eye,
    MoreHorizontal,
    Pencil,
    StopCircle,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

import { mockReviewCounts } from '@/entities/cycle/model/mocks';
import { CycleResponse, CycleStage } from '@/entities/cycle/model/types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/ui/alert-dialog';
import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/shared/ui/table';
import { StageBadge } from './stage-badge';

interface CyclesTableProps {
    cycles: CycleResponse[];
    sortField: string;
    sortDirection: 'ASC' | 'DESC';
    onSort: (field: string) => void;
}

function SortableHeader({
    label,
    field,
    currentField,
    currentDirection,
    onSort,
}: {
    label: string;
    field: string;
    currentField: string;
    currentDirection: string;
    onSort: (field: string) => void;
}) {
    const isActive = currentField === field;
    return (
        <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 font-medium text-muted-foreground hover:text-foreground"
            onClick={() => onSort(field)}
        >
            {label}
            <ArrowUpDown
                className={`ml-1 h-3.5 w-3.5 ${isActive ? 'text-foreground' : 'text-muted-foreground/50'}`}
            />
        </Button>
    );
}

export function CyclesTable({
    cycles,
    sortField,
    sortDirection,
    onSort,
}: CyclesTableProps) {
    const [forceFinishCycle, setForceFinishCycle] =
        useState<CycleResponse | null>(null);
    const [deleteCycle, setDeleteCycle] = useState<CycleResponse | null>(null);

    const handleForceFinish = () => {
        // In a real app, this would call an API
        setForceFinishCycle(null);
    };

    const handleDelete = () => {
        // In a real app, this would call an API
        setDeleteCycle(null);
    };

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
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[35%]">
                            <SortableHeader
                                label="Name"
                                field="title"
                                currentField={sortField}
                                currentDirection={sortDirection}
                                onSort={onSort}
                            />
                        </TableHead>
                        <TableHead>
                            <SortableHeader
                                label="Dates"
                                field="createdAt"
                                currentField={sortField}
                                currentDirection={sortDirection}
                                onSort={onSort}
                            />
                        </TableHead>
                        <TableHead>
                            <SortableHeader
                                label="Status"
                                field="stage"
                                currentField={sortField}
                                currentDirection={sortDirection}
                                onSort={onSort}
                            />
                        </TableHead>
                        <TableHead className="text-center">Reviews</TableHead>
                        <TableHead className="w-[70px]">
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cycles.map((cycle) => (
                        <TableRow key={cycle.id}>
                            <TableCell>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-medium text-foreground">
                                        {cycle.title}
                                    </span>
                                    {cycle.description && (
                                        <span className="line-clamp-1 text-sm text-muted-foreground">
                                            {cycle.description}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-0.5 text-sm">
                                    <span className="text-foreground">
                                        {format(
                                            new Date(cycle.startDate),
                                            'MMM dd, yyyy',
                                        )}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {format(
                                            new Date(cycle.endDate),
                                            'MMM dd, yyyy',
                                        )}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <StageBadge stage={cycle.stage} />
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium text-foreground">
                                        {mockReviewCounts[cycle.id] ?? 0}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                                Open actions
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        className="w-48"
                                    >
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
                                                onClick={() =>
                                                    setForceFinishCycle(cycle)
                                                }
                                            >
                                                <StopCircle className="mr-2 h-4 w-4" />
                                                Force Finish
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                            onClick={() =>
                                                setDeleteCycle(cycle)
                                            }
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Force Finish Confirmation Dialog */}
            <AlertDialog
                open={!!forceFinishCycle}
                onOpenChange={() => setForceFinishCycle(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Force Finish Cycle</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to force finish{' '}
                            <span className="font-semibold text-foreground">
                                {'\u201C'}
                                {forceFinishCycle?.title}
                                {'\u201D'}
                            </span>
                            ? This will immediately end the cycle and all
                            pending reviews will be closed. This action cannot
                            be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleForceFinish}
                            className="bg-amber-600 text-white hover:bg-amber-700"
                        >
                            Force Finish
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={!!deleteCycle}
                onOpenChange={() => setDeleteCycle(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Cycle</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-foreground">
                                {'\u201C'}
                                {deleteCycle?.title}
                                {'\u201D'}
                            </span>
                            ? This will permanently remove the cycle and all
                            associated feedback data. This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
