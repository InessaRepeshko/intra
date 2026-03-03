'use client';

import { format } from 'date-fns';
import {
    BookmarkCheck,
    Calendar,
    CirclePercent,
    Eye,
    MoreHorizontal,
    Star,
    Triangle,
    UserRoundPen,
    Users,
    // XLineTop,
} from 'lucide-react';

import { EntityTypeBadge } from '@entities/reporting/analytics/ui/entity-type-badge';
import { Button } from '@shared/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { ReportAnalytics } from '../model/mappers';
import { EntityType, SortDirection } from '../model/types';

interface AnalyticsTableProps {
    analytics: ReportAnalytics[];
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    resetTrigger?: number;
}

function AnalyticsActionsMenu({ analytics }: { analytics: ReportAnalytics }) {
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
                    View Report
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function AnalyticsTable({
    analytics,
    sortField,
    sortDirection,
    onSort,
    resetTrigger,
}: AnalyticsTableProps) {
    const {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    } = useDraggableColumns<
        | 'title'
        | 'entity_type'
        | 'average_self'
        | 'average_team'
        | 'average_others'
        | 'percent_self'
        | 'percent_team'
        | 'percent_others'
        | 'delta_team'
        | 'delta_others'
        | 'date'
        | 'actions'
    >('reports-table', [
        'title',
        'entity_type',
        'average_self',
        'average_team',
        'average_others',
        'percent_self',
        'percent_team',
        'percent_others',
        'delta_team',
        'delta_others',
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
        | 'entity_type'
        | 'average_self'
        | 'average_team'
        | 'average_others'
        | 'percent_self'
        | 'percent_team'
        | 'percent_others'
        | 'delta_team'
        | 'delta_others'
        | 'date'
        | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (analytics: ReportAnalytics) => React.ReactNode;
            cellClassName: string;
        }
    > = {
        title: {
            header: (
                <SortableHeader
                    label="Title"
                    field="title"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[250px] w-[300px] align-bottom cursor-grab active:cursor-grabbing rounded-full',
            cell: (analytics) => (
                <div className="flex flex-col items-center justify-start gap-0.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {analytics.entityType === EntityType.QUESTION
                            ? analytics.questionTitle
                            : analytics.entityType === EntityType.COMPETENCE
                              ? analytics.competenceTitle
                              : `None`}
                    </span>
                </div>
            ),
            cellClassName: 'min-w-[200px] whitespace-normal',
        },
        entity_type: {
            header: (
                <SortableHeader
                    label="Type"
                    field="entityType"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (analytics) =>
                analytics.entityType ? (
                    <EntityTypeBadge
                        key={analytics.id}
                        entityType={analytics.entityType}
                    />
                ) : (
                    `None`
                ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        average_self: {
            header: (
                <SortableHeader
                    label="Average by self"
                    wrapLabelText={true}
                    field="averageBySelfAssessment"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (analytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-sky-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(analytics.averageBySelfAssessment)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        average_team: {
            header: (
                <SortableHeader
                    label="Average by team"
                    wrapLabelText={true}
                    field="averageByTeamAssessment"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (analytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-sky-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(analytics.averageByTeam)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        average_others: {
            header: (
                <SortableHeader
                    label="Average by others"
                    wrapLabelText={true}
                    field="averageByOthers"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (analytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-sky-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(analytics.averageByOther)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        percent_self: {
            header: (
                <SortableHeader
                    label="Score % by self"
                    wrapLabelText={true}
                    field="percentageBySelfAssessment"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (analytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-sky-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(analytics.percentageBySelfAssessment)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        percent_team: {
            header: (
                <SortableHeader
                    label="Score % by team"
                    wrapLabelText={true}
                    field="percentageByTeam"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (analytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-sky-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(analytics.percentageByTeam)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        percent_others: {
            header: (
                <SortableHeader
                    label="Score % by others"
                    wrapLabelText={true}
                    field="percentageByOther"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (analytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-sky-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(analytics.percentageByOther)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        delta_team: {
            header: (
                <SortableHeader
                    label="Delta % by team"
                    wrapLabelText={true}
                    field="deltaByTeam"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (analytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-sky-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(analytics.deltaPercentageByTeam)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        delta_others: {
            header: (
                <SortableHeader
                    label="Delta % by others"
                    wrapLabelText={true}
                    field="deltaPercentageByOther"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (analytics) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-sky-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(analytics.deltaPercentageByOther)}
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
                'min-w-[150px] w-[150px] whitespace-nowrap align-bottom cursor-grab active:cursor-grabbing',
            cell: (analytics) => (
                <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                    <span className="text-foreground">
                        {format(analytics.createdAt, 'MMM dd, yyyy')}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap',
        },
        actions: {
            header: <span className="text-muted-foreground">Actions</span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center align-bottom pb-2',
            cell: (analytics) => <AnalyticsActionsMenu analytics={analytics} />,
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (analytics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No report analytics found
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
                {analytics.map((analytics) => (
                    <div
                        key={analytics.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-x-2 gap-y-1 font-medium text-foreground flex-wrap">
                                    <span className="break-words">
                                        {analytics.entityType ===
                                        EntityType.QUESTION
                                            ? analytics.questionTitle
                                            : analytics.entityType ===
                                                EntityType.COMPETENCE
                                              ? analytics.competenceTitle
                                              : `None`}
                                    </span>
                                    <span className="whitespace-nowrap">
                                        {analytics.entityType ? (
                                            <EntityTypeBadge
                                                key={analytics.id}
                                                entityType={
                                                    analytics.entityType
                                                }
                                            />
                                        ) : (
                                            `None`
                                        )}
                                    </span>
                                </p>
                            </div>
                            <AnalyticsActionsMenu analytics={analytics} />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-medium text-muted-foreground break-words">
                                    {format(analytics.createdAt, 'MMM dd, yyyy')}
                                </span>
                            </span>

                            {(analytics.averageBySelfAssessment ||
                                analytics.averageByTeam ||
                                analytics.averageByOther) && (
                                <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        Average by
                                    </span>
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <Star className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {formatNumber(analytics.averageBySelfAssessment)}
                                        </span>
                                        {'self'}
                                    </span>
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <Star className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {formatNumber(analytics.averageByTeam)}
                                        </span>
                                        {'team'}
                                    </span>
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <Star className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {formatNumber(analytics.averageByOther)}
                                        </span>
                                        {'others'}
                                    </span>
                                </span>
                            )}

                            {(analytics.percentageBySelfAssessment || analytics.percentageByTeam || analytics.percentageByOther) && (
                                <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        Percentage by
                                    </span>
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <CirclePercent className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {formatNumber(analytics.percentageBySelfAssessment)}
                                        </span>
                                        {'% self'}
                                    </span>

                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <BookmarkCheck className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {formatNumber(analytics.percentageByTeam)}
                                        </span>
                                        {'% team'}
                                    </span>

                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <BookmarkCheck className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {formatNumber(analytics.percentageByOther)}
                                        </span>
                                        {'% others'}
                                    </span>
                                </span>
                            )}

                            {(analytics.deltaPercentageByTeam || analytics.deltaPercentageByOther) && (
                                <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        Delta percentage by
                                    </span>

                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <Triangle className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {formatNumber(analytics.deltaPercentageByTeam)}
                                        </span>
                                        {'% team'}
                                    </span>

                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <Triangle className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {formatNumber(analytics.deltaPercentageByOther)}
                                        </span>
                                        {'% others'}
                                    </span>
                                </span>
                            )}
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
                        {analytics.map((report) => (
                            <TableRow key={report.id}>
                                {columnOrder.map((id) => {
                                    const col = COLUMNS[id];
                                    return (
                                        <TableCell
                                            key={id}
                                            className={col.cellClassName}
                                        >
                                            {col.cell(report)}
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
