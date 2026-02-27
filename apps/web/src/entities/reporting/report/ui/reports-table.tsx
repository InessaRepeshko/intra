'use client';

import { format } from 'date-fns';
import {
    Award,
    BookmarkCheck,
    Calendar,
    Eye,
    Flag,
    MoreHorizontal,
    RefreshCcw,
    UserRoundPen,
    Users,
} from 'lucide-react';

import { CategoryBadge } from '@entities/feedback360/respondent/ui/category-badge';
import { StageBadge } from '@entities/feedback360/review/ui/stage-badge';
import { Button } from '@shared/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { useDraggableColumns } from '@shared/lib/hooks/use-draggable-columns';
import { SortableHeader } from '@shared/ui/sortable-table-column-header';
import { Report } from '../model/mappers';
import { RespondentCategory, ReviewStage, SortDirection } from '../model/types';
import { useEffect } from 'react';

interface ReportsTableProps {
    reports: Report[];
    rateeFullNames: Record<number, string>;
    rateePositionTitles: Record<number, string>;
    rateeTeamTitles: Record<number, string | null>;
    cycleTitles: Record<number, string>;
    reviewStages: Record<number, ReviewStage>;
    respondentCategories: Record<number, RespondentCategory[]>;
    answerCounts: Record<number, number>;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    resetTrigger?: number;
}

function ReportActionsMenu({ report }: { report: Report }) {
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

export function ReportsTable({
    reports,
    rateeFullNames,
    rateePositionTitles,
    rateeTeamTitles,
    cycleTitles,
    reviewStages,
    respondentCategories,
    answerCounts,
    sortField,
    sortDirection,
    onSort,
    resetTrigger,
}: ReportsTableProps) {
    const { columnOrder, handleDragStart, handleDragEnter, handleDragEnd, resetOrder } =
        useDraggableColumns<
            | 'ratee'
            | 'cycle'
            | 'date'
            | 'stage'
            | 'respondents'
            | 'categories'
            | 'answers'
            | 'turnout_team'
            | 'turnout_others'
            | 'self_competence'
            | 'team_competence'
            | 'others_competence'
            | 'actions'
        >('reports-table', [
            'ratee',
            'cycle',
            'date',
            'stage',
            'respondents',
            'categories',
            'answers',
            'turnout_team',
            'turnout_others',
            'self_competence',
            'team_competence',
            'others_competence',
            'actions',
        ]);

    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetOrder();
        }
    }, [resetTrigger, resetOrder]);

    const COLUMNS: Record<
        | 'ratee'
        | 'cycle'
        | 'date'
        | 'stage'
        | 'respondents'
        | 'categories'
        | 'answers'
        | 'turnout_team'
        | 'turnout_others'
        | 'self_competence'
        | 'team_competence'
        | 'others_competence'
        | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (report: Report) => React.ReactNode;
            cellClassName: string;
        }
    > = {
        ratee: {
            header: (
                <SortableHeader
                    label="Ratee"
                    field="title"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[250px] w-[300px] align-bottom cursor-grab active:cursor-grabbing rounded-full',
            cell: (report) => (
                <div className="flex flex-col gap-0.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {rateeFullNames[report.reviewId]}
                    </span>
                    {(rateePositionTitles[report.reviewId] ||
                        rateeTeamTitles[report.reviewId]) && (
                            <span className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-1 gap-y-1">
                                {rateePositionTitles[report.reviewId] && (
                                    <span className="break-words overflow-wrap-anywhere">
                                        {rateePositionTitles[report.reviewId] ?? (
                                            `None`
                                        )}{' '}
                                        {rateeTeamTitles[report.reviewId]
                                            ? `,`
                                            : ''}
                                    </span>
                                )}
                                {rateeTeamTitles[report.reviewId] && (
                                    <span className="break-words overflow-wrap-anywhere">
                                        {rateeTeamTitles[report.reviewId] ?? (
                                            `None`
                                        )}
                                    </span>
                                )}
                            </span>
                        )}
                </div>
            ),
            cellClassName: 'min-w-[200px] whitespace-normal',
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
                'min-w-[200px] w-[250px] whitespace-nowrap align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start gap-1.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {report.cycleId
                            ? (cycleTitles[report.cycleId] ?? `None`)
                            : `None`}
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
                'min-w-[150px] w-[150px] whitespace-nowrap align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                    <span className="text-foreground">
                        {format(report.createdAt, 'MMM dd, yyyy')}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap',
        },
        stage: {
            header: (
                <SortableHeader
                    label="Stage"
                    field="reviewStage"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) =>
                reviewStages[report.reviewId] ? (
                    <StageBadge
                        key={report.reviewId}
                        stage={reviewStages[report.reviewId]}
                    />
                ) : (
                    `None`
                ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        respondents: {
            header: (
                <SortableHeader
                    label="Respondents"
                    field="respondentCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {report.respondentCount ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        categories: {
            header: (
                <SortableHeader
                    label="Categories"
                    field="respondentCategories"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) =>
                respondentCategories[report.reviewId] ? (
                    respondentCategories[report.reviewId].map((category) => (
                        <CategoryBadge key={category} category={category} />
                    ))
                ) : (
                    `None`
                ),
            cellClassName:
                'whitespace-nowrap text-center gap-x-1 gap-y-1 flex flex-wrap',
        },
        answers: {
            header: (
                <SortableHeader
                    label="Answers"
                    field="answerCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) =>
                answerCounts[report.reviewId] ? (
                    <div className="flex items-center justify-center gap-1.5">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                            {answerCounts[report.reviewId]}
                        </span>
                    </div>
                ) : (
                    `—`
                ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        turnout_team: {
            header: (
                <SortableHeader
                    label="Turnout % of team"
                    wrapLabelText={true}
                    field="turnoutPctOfTeam"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-sky-700" />
                    <span className="font-medium text-foreground">
                        {report.turnoutPctOfTeam ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        turnout_others: {
            header: (
                <SortableHeader
                    label="Turnout % of others"
                    wrapLabelText={true}
                    field="turnoutPctOfOther"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[140px] w-[140px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <UserRoundPen className="h-4 w-4 text-indigo-700" />
                    <span className="font-medium text-foreground">
                        {report.turnoutPctOfOther ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        self_competence: {
            header: (
                <SortableHeader
                    label="Competence % by self"
                    wrapLabelText={true}
                    field="competenceTotPctBySelf"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[130px] w-[130px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <BookmarkCheck className="h-4 w-4 text-lime-700" />
                    <span className="font-medium text-foreground">
                        {report.competenceSummaryTotals
                            ?.percentageBySelfAssessment ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        team_competence: {
            header: (
                <SortableHeader
                    label="Competence % by team"
                    wrapLabelText={true}
                    field="competenceTotPctByTeam"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[130px] w-[130px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <BookmarkCheck className="h-4 w-4 text-sky-700" />
                    <span className="font-medium text-foreground">
                        {report.competenceSummaryTotals?.percentageByTeam ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        others_competence: {
            header: (
                <SortableHeader
                    label="Competence % by others"
                    wrapLabelText={true}
                    field="competenceTotPctByOthers"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[130px] w-[130px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-start pl-3 gap-1.5">
                    <BookmarkCheck className="h-4 w-4 text-indigo-700" />
                    <span className="font-medium text-foreground">
                        {report.competenceSummaryTotals?.percentageByOther ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        actions: {
            header: <span className="text-muted-foreground">Actions</span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center align-bottom pb-2',
            cell: (report) => <ReportActionsMenu report={report} />,
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No reports found
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
                {reports.map((report) => (
                    <div
                        key={report.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-x-2 gap-y-1 font-medium text-foreground flex-wrap">
                                    <span className="break-words">
                                        {rateeFullNames[report.reviewId] ?? (
                                            `None`
                                        )}
                                    </span>
                                    <span className="whitespace-nowrap">
                                        {reviewStages[report.reviewId] ? (
                                            <StageBadge
                                                key={report.reviewId}
                                                stage={
                                                    reviewStages[
                                                    report.reviewId
                                                    ]
                                                }
                                            />
                                        ) : (
                                            `None`
                                        )}
                                    </span>
                                </p>
                                {(rateePositionTitles[report.reviewId] ||
                                    rateeTeamTitles[report.reviewId]) && (
                                        <p className="mt-0.5 flex flex-row gap-x-4 gap-y-2 text-sm text-muted-foreground flex-wrap">
                                            {rateePositionTitles[
                                                report.reviewId
                                            ] && (
                                                    <span className="flex items-center gap-1 break-words">
                                                        <Award className="h-3.5 w-3.5 shrink-0" />
                                                        {rateePositionTitles[
                                                            report.reviewId
                                                        ] ?? `None`}
                                                    </span>
                                                )}
                                            {rateeTeamTitles[report.reviewId] && (
                                                <span className="flex items-center gap-1 break-words">
                                                    <Users className="h-3.5 w-3.5 shrink-0" />
                                                    {rateeTeamTitles[
                                                        report.reviewId
                                                    ] ?? `None`}
                                                </span>
                                            )}
                                        </p>
                                    )}
                            </div>
                            <ReportActionsMenu report={report} />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <RefreshCcw className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {report.cycleId
                                        ? (cycleTitles[report.cycleId] ?? `None`)
                                        : `None`}
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-medium text-foreground break-words">
                                    {format(report.createdAt, 'MMM dd, yyyy')}
                                </span>
                            </span>

                            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="flex items-center gap-1 text-muted-foreground flex-wrap">
                                    <Users className="h-3.5 w-3.5 shrink-0" />
                                    {answerCounts[report.reviewId] ? (
                                        <span className="font-medium text-foreground">
                                            {answerCounts[report.reviewId]}
                                        </span>
                                    ) : (
                                        `—`
                                    )}
                                    <span className="font-medium text-foreground">
                                        {' of '}
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {report.respondentCount ?? `—`}
                                    </span>
                                    <span className="whitespace-nowrap">
                                        {' respondents in '}
                                    </span>
                                    <Flag className="flex h-3.5 w-3.5 shrink-0 gap-x-1" />
                                    {respondentCategories[report.reviewId] ? (
                                        respondentCategories[
                                            report.reviewId
                                        ].map((category) => (
                                            <CategoryBadge
                                                key={category}
                                                category={category}
                                            />
                                        ))
                                    ) : (
                                        `None`
                                    )}
                                    {' categories'}
                                </span>
                            </span>

                            {report.turnoutPctOfTeam &&
                                report.turnoutPctOfOther && (
                                    <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            Turnout
                                        </span>
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <UserRoundPen className="h-3.5 w-3.5 shrink-0" />
                                            <span className="font-medium text-foreground">
                                                {report.turnoutPctOfTeam ?? 0}
                                            </span>
                                            {'% team'}
                                        </span>

                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <UserRoundPen className="h-3.5 w-3.5 shrink-0" />
                                            <span className="font-medium text-foreground">
                                                {report.turnoutPctOfOther ?? 0}
                                            </span>
                                            {'% others'}
                                        </span>
                                    </span>
                                )}

                            {report.competenceSummaryTotals && (
                                <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        Competence
                                    </span>
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <BookmarkCheck className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {report.competenceSummaryTotals
                                                ?.percentageBySelfAssessment ?? `—`}
                                        </span>
                                        {'% self'}
                                    </span>

                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <BookmarkCheck className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {report.competenceSummaryTotals
                                                ?.percentageByTeam ?? `—`}
                                        </span>
                                        {'% team'}
                                    </span>

                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <BookmarkCheck className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {report.competenceSummaryTotals
                                                ?.percentageByOther ?? `—`}
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
                        {reports.map((report) => (
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
