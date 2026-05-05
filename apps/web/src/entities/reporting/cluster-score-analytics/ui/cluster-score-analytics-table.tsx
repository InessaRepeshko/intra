'use client';

import { format } from 'date-fns';
import {
    ArrowUpFromLine,
    ArrowUpToLine,
    Boxes,
    Calendar,
    Eye,
    MoreHorizontal,
    Pencil,
    Percent,
    RefreshCcw,
    SeparatorHorizontal,
    Trash2,
    TrendingDown,
    TrendingUp,
    UserRound,
    Users,
} from 'lucide-react';

import { ClusterScoreAnalytics } from '@entities/reporting/cluster-score-analytics/model/mappers';
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
import { formatNumber } from '@shared/lib/utils/format-number';
import { SortableHeader } from '@shared/ui/sortable-table-column-header';
import { useEffect } from 'react';
import { SortDirection } from '../model/types';
import { ClusterBadge } from './cluster-badge';

interface ClusterScoreAnalyticsTableProps {
    clusterScoreAnalytics: ClusterScoreAnalytics[];
    clusterScoreTitles: Record<
        number,
        { title: string; description: string; competenceId: number }
    >;
    competenceTitles: Record<
        number,
        { title: string; code: string | null; description: string | null }
    >;
    cycleTitles: Record<number, string>;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    onDelete?: (clusterScoreAnalytics: ClusterScoreAnalytics) => void;
    resetTrigger?: number;
}

function ClusterScoreAnalyticsActionsMenu({
    clusterScoreAnalytics,
    onDelete,
}: {
    clusterScoreAnalytics: ClusterScoreAnalytics;
    onDelete?: (clusterScoreAnalytics: ClusterScoreAnalytics) => void;
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
                    onClick={() => onDelete?.(clusterScoreAnalytics)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function ClusterScoreAnalyticsTable({
    clusterScoreAnalytics,
    clusterScoreTitles,
    competenceTitles,
    cycleTitles,
    sortField,
    sortDirection,
    onSort,
    onDelete,
    resetTrigger,
}: ClusterScoreAnalyticsTableProps) {
    const {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    } = useDraggableColumns<
        | 'competence'
        | 'cluster'
        | 'cycle'
        | 'lowerBound'
        | 'upperBound'
        | 'minScore'
        | 'maxScore'
        | 'averageScore'
        | 'employeeCount'
        | 'employeeDensity'
        | 'date'
        | 'actions'
    >('competence-table', [
        'competence',
        'cluster',
        'cycle',
        'lowerBound',
        'upperBound',
        'minScore',
        'maxScore',
        'averageScore',
        'employeeCount',
        'employeeDensity',
        'date',
        'actions',
    ]);

    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetOrder();
        }
    }, [resetTrigger, resetOrder]);

    const COLUMNS: Record<
        | 'competence'
        | 'cluster'
        | 'cycle'
        | 'lowerBound'
        | 'upperBound'
        | 'minScore'
        | 'maxScore'
        | 'averageScore'
        | 'employeeCount'
        | 'employeeDensity'
        | 'date'
        | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (
                clusterScoreAnalytics: ClusterScoreAnalytics,
            ) => React.ReactNode;
            cellClassName: string;
        }
    > = {
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
                'min-w-[250px] w-[350px] align-bottom cursor-grab active:cursor-grabbing rounded-full',
            cell: (clusterScoreAnalytics) => (
                <div className="flex flex-col gap-0.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {(competenceTitles[
                            clusterScoreTitles[clusterScoreAnalytics.clusterId]
                                ?.competenceId
                        ]?.title ?? (
                            <span className="text-muted-foreground">None</span>
                        )) +
                            `, ` +
                            (competenceTitles[
                                clusterScoreTitles[
                                    clusterScoreAnalytics.clusterId
                                ]?.competenceId
                            ]?.code ?? (
                                <span className="text-muted-foreground">
                                    None
                                </span>
                            ))}
                    </span>
                    {competenceTitles[
                        clusterScoreTitles[clusterScoreAnalytics.clusterId]
                            ?.competenceId
                    ]?.description && (
                        <span className="text-sm text-muted-foreground break-words overflow-wrap-anywhere">
                            {competenceTitles[
                                clusterScoreTitles[
                                    clusterScoreAnalytics.clusterId
                                ]?.competenceId
                            ]?.description ?? (
                                <span className="text-muted-foreground">
                                    None
                                </span>
                            )}
                        </span>
                    )}
                </div>
            ),
            cellClassName: 'min-w-[200px] whitespace-normal',
        },
        cluster: {
            header: (
                <SortableHeader
                    label="Cluster"
                    field="clusterTitle"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[100px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (clusterScoreAnalytics) => (
                <ClusterBadge
                    key={clusterScoreAnalytics.id}
                    label={
                        clusterScoreTitles[clusterScoreAnalytics.clusterId]
                            ?.title
                    }
                />
            ),
            cellClassName: 'min-w-[200px] whitespace-nowrap text-center',
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
            cell: (clusterScoreAnalytics) => (
                <div className="flex items-center justify-start gap-1.5">
                    <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {clusterScoreAnalytics.lowerBound ?? `—`}
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
            cell: (clusterScoreAnalytics) => (
                <div className="flex items-center justify-start gap-1.5">
                    <ArrowUpToLine className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {clusterScoreAnalytics.upperBound ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        minScore: {
            header: (
                <SortableHeader
                    label="Lowest Score"
                    field="minScore"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (clusterScoreAnalytics) => (
                <div className="flex items-center justify-start gap-1.5">
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {formatNumber(clusterScoreAnalytics.minScore ?? 0, 2)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        maxScore: {
            header: (
                <SortableHeader
                    label="Highest Score"
                    field="maxScore"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (clusterScoreAnalytics) => (
                <div className="flex items-center justify-start gap-1.5">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {formatNumber(clusterScoreAnalytics.maxScore ?? 0, 2)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        averageScore: {
            header: (
                <SortableHeader
                    label="Average Score"
                    field="averageScore"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (clusterScoreAnalytics) => (
                <div className="flex items-center justify-start gap-1.5">
                    <SeparatorHorizontal className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {formatNumber(clusterScoreAnalytics.averageScore ?? 0, 2)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        employeeCount: {
            header: (
                <SortableHeader
                    label="Ratees"
                    field="employeeCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[100px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (clusterScoreAnalytics) => (
                <div className="flex items-center justify-center gap-1.5">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {clusterScoreAnalytics.employeesCount ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        employeeDensity: {
            header: (
                <SortableHeader
                    label="Density of ratees"
                    field="employeeDensity"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[100px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (clusterScoreAnalytics) => (
                <div className="flex items-center justify-center gap-1.5">
                    <span className="font-medium text-foreground">
                        {formatNumber(
                            clusterScoreAnalytics.employeeDensity * 100,
                            2,
                        ) ?? `—`}
                    </span>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        cycle: {
            header: (
                <SortableHeader
                    label="Cycle"
                    field="cycleTitle"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[250px] w-[300px] whitespace-nowrap cursor-grab active:cursor-grabbing',
            cell: (clusterScoreAnalytics) => (
                <div className="flex flex-row items-center gap-1.5 w-full">
                    <RefreshCcw className="shrink-0 h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {cycleTitles[clusterScoreAnalytics.cycleId] ?? (
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
                'min-w-[150px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (clusterScoreAnalytics) => (
                <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                    <span className="text-foreground">
                        {format(
                            clusterScoreAnalytics.createdAt,
                            'MMM dd, yyyy',
                        )}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        actions: {
            header: <span className="text-muted-foreground">Actions</span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center pb-1',
            cell: (clusterScoreAnalytics) => (
                <ClusterScoreAnalyticsActionsMenu
                    clusterScoreAnalytics={clusterScoreAnalytics}
                    onDelete={onDelete}
                />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (clusterScoreAnalytics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <Boxes className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No cluster score analytics found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile card layout (hidden on md+) */}
            <div className="flex flex-col gap-3 lg:hidden">
                {clusterScoreAnalytics.map((clusterScoreAnalytics) => (
                    <div
                        key={clusterScoreAnalytics.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-2 font-medium text-foreground flex-wrap">
                                    <span className="break-words">
                                        {(competenceTitles[
                                            clusterScoreTitles[
                                                clusterScoreAnalytics.clusterId
                                            ]?.competenceId
                                        ]?.title ?? (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
                                        )) +
                                            ', ' +
                                            (competenceTitles[
                                                clusterScoreTitles[
                                                    clusterScoreAnalytics
                                                        .clusterId
                                                ]?.competenceId
                                            ]?.code ?? (
                                                <span className="text-muted-foreground">
                                                    None
                                                </span>
                                            ))}
                                    </span>
                                    <span className="whitespace-nowrap">
                                        {clusterScoreTitles[
                                            clusterScoreAnalytics.clusterId
                                        ]?.competenceId ? (
                                            <ClusterBadge
                                                key={clusterScoreAnalytics.id}
                                                label={
                                                    clusterScoreTitles[
                                                        clusterScoreAnalytics
                                                            .clusterId
                                                    ]?.title
                                                }
                                            />
                                        ) : (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
                                        )}
                                    </span>
                                </p>
                                {competenceTitles[
                                    clusterScoreTitles[
                                        clusterScoreAnalytics.clusterId
                                    ]?.competenceId
                                ]?.description && (
                                    <p className="mt-0.5 text-sm text-muted-foreground break-words">
                                        {
                                            competenceTitles[
                                                clusterScoreTitles[
                                                    clusterScoreAnalytics
                                                        .clusterId
                                                ]?.competenceId
                                            ]?.description
                                        }
                                    </p>
                                )}
                                {clusterScoreTitles[
                                    clusterScoreAnalytics.clusterId
                                ]?.title && (
                                    <p className="mt-0.5 text-sm text-muted-foreground break-words">
                                        {
                                            clusterScoreTitles[
                                                clusterScoreAnalytics.clusterId
                                            ]?.title
                                        }
                                    </p>
                                )}
                            </div>
                            <ClusterScoreAnalyticsActionsMenu
                                clusterScoreAnalytics={clusterScoreAnalytics}
                                onDelete={onDelete}
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <RefreshCcw className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {cycleTitles[
                                        clusterScoreAnalytics.cycleId
                                    ] ?? (
                                        <span className="text-muted-foreground">
                                            None
                                        </span>
                                    )}
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="font-medium text-muted-foreground break-words">
                                    {format(
                                        clusterScoreAnalytics.createdAt,
                                        'MMM dd, yyyy',
                                    )}
                                </span>
                            </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-10 gap-y-2 text-sm">
                            <span className="flex flex-wrap items-center gap-1 text-muted-foreground break-words">
                                {'Bounds from'}
                                <ArrowUpFromLine className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {clusterScoreAnalytics.lowerBound ?? `—`}
                                </span>
                                {' to '}
                                <ArrowUpToLine className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {clusterScoreAnalytics.upperBound ?? `—`}
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-foreground break-words">
                                <Users className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {clusterScoreAnalytics.employeesCount ??
                                        `—`}
                                </span>
                                <span className="text-muted-foreground">
                                    {clusterScoreAnalytics.employeesCount === 1
                                        ? ' ratee'
                                        : ' ratees'}
                                </span>
                            </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex flex-wrap items-center gap-1 text-muted-foreground break-words">
                                {'Rating '}
                                <TrendingDown className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {clusterScoreAnalytics.minScore ?? `—`}
                                </span>
                                {' max, '}
                                <TrendingUp className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {clusterScoreAnalytics.maxScore ?? `—`}
                                </span>
                                {' min, '}
                                <SeparatorHorizontal className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {clusterScoreAnalytics.averageScore ?? `—`}
                                </span>
                                {' avg'}
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
                        {clusterScoreAnalytics.map((clusterScoreAnalytics) => (
                            <TableRow key={clusterScoreAnalytics.id}>
                                {columnOrder.map((id) => {
                                    const col = COLUMNS[id];
                                    return (
                                        <TableCell
                                            key={id}
                                            className={col.cellClassName}
                                        >
                                            {col.cell(clusterScoreAnalytics)}
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
