'use client';

import { format } from 'date-fns';
import {
    ArrowUpFromLine,
    ArrowUpToLine,
    Bookmark,
    Calendar,
    Eye,
    Layers2,
    MoreHorizontal,
    Pencil,
    Trash2,
} from 'lucide-react';

import type { Cluster } from '@entities/library/cluster/model/mappers';
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
import { SortDirection } from '../model/types';

interface ClustersTableProps {
    clusters: Cluster[];
    competenceTitles: Record<number, string>;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    onDelete?: (cluster: Cluster) => void;
    resetTrigger?: number;
}

function ClusterActionsMenu({
    cluster,
    onDelete,
}: {
    cluster: Cluster;
    onDelete?: (cluster: Cluster) => void;
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
                    onClick={() => onDelete?.(cluster)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function ClusterTable({
    clusters,
    competenceTitles,
    sortField,
    sortDirection,
    onSort,
    onDelete,
    resetTrigger,
}: ClustersTableProps) {
    const {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    } = useDraggableColumns<
        | 'title'
        | 'lowerBound'
        | 'upperBound'
        | 'competence'
        | 'date'
        | 'actions'
    >('clusters-table', [
        'title',
        'lowerBound',
        'upperBound',
        'competence',
        'date',
        'actions',
    ]);

    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetOrder();
        }
    }, [resetTrigger, resetOrder]);

    const COLUMNS: Record<
        | 'title'
        | 'lowerBound'
        | 'upperBound'
        | 'competence'
        | 'date'
        | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (cluster: Cluster) => React.ReactNode;
            cellClassName: string;
        }
    > = {
        title: {
            header: (
                <SortableHeader
                    label="Cluster"
                    field="title"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[300px] w-[400px] cursor-grab active:cursor-grabbing',
            cell: (cluster) => (
                <div className="flex flex-col gap-0.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {cluster.title}
                    </span>
                    {cluster.description && (
                        <span className="text-sm text-muted-foreground break-words overflow-wrap-anywhere">
                            {cluster.description}
                        </span>
                    )}
                </div>
            ),
            cellClassName: 'min-w-[100px] whitespace-normal',
        },
        lowerBound: {
            header: (
                <SortableHeader
                    label="Lower Bound"
                    field="lowerBound"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (cluster) => (
                <div className="flex items-center justify-center gap-1.5">
                    <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {cluster.lowerBound ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        upperBound: {
            header: (
                <SortableHeader
                    label="Upper Bound"
                    field="upperBound"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (cluster) => (
                <div className="flex items-center justify-center gap-1.5">
                    <ArrowUpToLine className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {cluster.upperBound ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        competence: {
            header: (
                <SortableHeader
                    label="Competence"
                    field="competenceTitle"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[200px] w-[200px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (cluster) => (
                <div className="flex items-center justify-center gap-1.5 w-full">
                    <Bookmark className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {cluster.competenceId ? (
                            (competenceTitles[cluster.competenceId] ?? (
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
            cellClassName: 'whitespace-normal',
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
                'min-w-[120px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (cluster) => (
                <div className="flex flex-col gap-0.5 text-sm">
                    <span className="text-foreground">
                        {format(cluster.createdAt, 'MMM dd, yyyy')}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        actions: {
            header: <span className="text-muted-foreground">Actions</span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center pb-1',
            cell: (cluster) => (
                <ClusterActionsMenu cluster={cluster} onDelete={onDelete} />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (clusters.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <Layers2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No clusters found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or create a new cluster.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile card layout (hidden on md+) */}
            <div className="flex flex-col gap-3 lg:hidden">
                {clusters.map((cluster) => (
                    <div
                        key={cluster.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-2 font-medium text-foreground flex-wrap">
                                    <span className="break-words">
                                        {cluster.title}
                                    </span>
                                </p>
                                {cluster.description && (
                                    <p className="mt-0.5 text-sm text-muted-foreground break-words">
                                        {cluster.description}
                                    </p>
                                )}
                            </div>
                            <ClusterActionsMenu
                                cluster={cluster}
                                onDelete={onDelete}
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                {'From'}
                                <ArrowUpFromLine className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {cluster.lowerBound ?? `—`}
                                </span>
                                {' to '}
                                <ArrowUpToLine className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {cluster.upperBound ?? `—`}
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Bookmark className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {competenceTitles[cluster.competenceId]}
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="font-medium text-muted-foreground break-words">
                                    {format(cluster.createdAt, 'MMM dd, yyyy')}
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
                        {clusters.map((cluster) => (
                            <TableRow key={cluster.id}>
                                {columnOrder.map((id) => {
                                    const col = COLUMNS[id];
                                    return (
                                        <TableCell
                                            key={id}
                                            className={col.cellClassName}
                                        >
                                            {col.cell(cluster)}
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
