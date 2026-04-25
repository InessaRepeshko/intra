'use client';

import { format } from 'date-fns';
import {
    Award,
    BookmarkCheck,
    Calendar,
    FileText,
    Flag,
    RefreshCcw,
    UserRoundPen,
    Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { CategoryBadge } from '@entities/feedback360/respondent/ui/category-badge';
import { StageBadge } from '@entities/feedback360/review/ui/stage-badge';
import { Button } from '@shared/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@shared/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@shared/components/ui/tooltip';
import { useDraggableColumns } from '@shared/lib/hooks/use-draggable-columns';
import { formatNumber } from '@shared/lib/utils/format-number';
import { SortableHeader } from '@shared/ui/sortable-table-column-header';
import { useEffect } from 'react';
import { Report } from '../model/mappers';
import { ReviewStage, SortDirection } from '../model/types';

interface IndividualReportsTableProps {
    reports: Report[];
    rateeFullNames: Record<number, string>;
    rateePositionTitles: Record<number, string>;
    rateeTeamTitles: Record<number, string | null>;
    cycleTitles: Record<number, string>;
    reviewStages: Record<number, ReviewStage>;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    resetTrigger?: number;
}

function IndividualReportActionsMenu({ report }: { report: Report }) {
    const router = useRouter();

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground text-center cursor-pointer"
                        onClick={() =>
                            router.push(
                                `/reporting/individual-reports/${report.id}`,
                            )
                        }
                    >
                        <FileText className=" h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                    <p>View Report</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function IndividualReportsTable({
    reports,
    rateeFullNames,
    rateePositionTitles,
    rateeTeamTitles,
    cycleTitles,
    reviewStages,
    sortField,
    sortDirection,
    onSort,
    resetTrigger,
}: IndividualReportsTableProps) {
    const router = useRouter();

    const {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    } = useDraggableColumns<
        | 'id'
        | 'ratee'
        | 'cycle'
        | 'stage'
        | 'respondents'
        | 'categories'
        | 'answers'
        | 'turnout_team'
        | 'turnout_others'
        | 'self_competence'
        | 'team_competence'
        | 'others_competence'
        | 'delta_team_competence'
        | 'delta_others_competence'
        | 'date'
        | 'actions'
    >('reports-table', [
        'id',
        'ratee',
        'cycle',
        'stage',
        'respondents',
        'categories',
        'answers',
        'turnout_team',
        'turnout_others',
        'self_competence',
        'team_competence',
        'others_competence',
        'delta_team_competence',
        'delta_others_competence',
        'date',
        'actions',
    ]);

    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetOrder();
        }
    }, [resetTrigger, resetOrder]);

    const COLUMNS: Record<
        | 'id'
        | 'ratee'
        | 'cycle'
        | 'stage'
        | 'respondents'
        | 'categories'
        | 'answers'
        | 'turnout_team'
        | 'turnout_others'
        | 'self_competence'
        | 'team_competence'
        | 'others_competence'
        | 'delta_team_competence'
        | 'delta_others_competence'
        | 'date'
        | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (report: Report) => React.ReactNode;
            cellClassName: string;
        }
    > = {
        id: {
            header: (
                <SortableHeader
                    label="#"
                    field="id"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[75px] w-[75px] text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground text-center cursor-pointer hover:underline"
                        onClick={() =>
                            router.push(
                                `/reporting/individual-reports/${report.id}`,
                            )
                        }
                    >
                        <span className="font-medium text-foreground">
                            {report.id}
                        </span>
                    </Button>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
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
                                        <span className="text-muted-foreground">
                                            None
                                        </span>
                                    )}
                                    {rateeTeamTitles[report.reviewId]
                                        ? `,`
                                        : ''}
                                </span>
                            )}
                            {rateeTeamTitles[report.reviewId] && (
                                <span className="break-words overflow-wrap-anywhere">
                                    {rateeTeamTitles[report.reviewId] ?? (
                                        <span className="text-muted-foreground">
                                            None
                                        </span>
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
                    <RefreshCcw className="shrink-0 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {report.cycleId ? (
                            (cycleTitles[report.cycleId] ?? (
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
                    <span className="text-muted-foreground">None</span>
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
            cell: (report) => (
                <div className="flex flex-wrap items-center justify-center gap-1">
                    {report.respondentCategories ? (
                        report.respondentCategories.map((category) => (
                            <CategoryBadge key={category} category={category} />
                        ))
                    ) : (
                        <span className="text-muted-foreground">None</span>
                    )}
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
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
                report.answerCount ? (
                    <div className="flex items-center justify-center gap-1.5">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                            {report.answerCount}
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
                    <UserRoundPen className="h-4 w-4 text-blue-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(report.turnoutPctOfTeam)}
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
                    <UserRoundPen className="h-4 w-4 text-violet-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(report.turnoutPctOfOther)}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        self_competence: {
            header: (
                <SortableHeader
                    label="Rating % by self"
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
                    <BookmarkCheck className="h-4 w-4 text-amber-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(
                            report.competenceSummaryTotals
                                ?.percentageBySelfAssessment,
                        )}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        team_competence: {
            header: (
                <SortableHeader
                    label="Rating % by team"
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
                    <BookmarkCheck className="h-4 w-4 text-blue-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(
                            report.competenceSummaryTotals?.percentageByTeam,
                        )}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        others_competence: {
            header: (
                <SortableHeader
                    label="Rating % by others"
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
                    <BookmarkCheck className="h-4 w-4 text-violet-700" />
                    <span className="font-medium text-foreground">
                        {formatNumber(
                            report.competenceSummaryTotals?.percentageByOther,
                        )}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        delta_team_competence: {
            header: (
                <SortableHeader
                    label="Delta % by team"
                    wrapLabelText={true}
                    field="deltaPercentageByTeam"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[130px] w-[130px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => {
                const numberValue =
                    report.competenceSummaryTotals?.deltaPercentageByTeam ??
                    null;
                const isPositive = numberValue !== null && numberValue > 0;
                const isNegative = numberValue !== null && numberValue < 0;
                const color = isPositive
                    ? 'text-green-800'
                    : isNegative
                      ? 'text-red-800'
                      : 'ml-5 text-muted-foreground';
                const stringValue = report.competenceSummaryTotals
                    ?.deltaPercentageByTeam
                    ? (isPositive ? '↑ +' : isNegative ? '↓ ' : '') +
                      formatNumber(
                          report.competenceSummaryTotals?.deltaPercentageByTeam,
                      )
                    : `0`;
                return (
                    <div className="flex items-center justify-start pl-3 gap-1.5">
                        <span className={`font-medium ${color}`}>
                            {stringValue}
                        </span>
                    </div>
                );
            },
            cellClassName: 'whitespace-nowrap text-center',
        },
        delta_others_competence: {
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
                'min-w-[130px] w-[130px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => {
                const numberValue =
                    report.competenceSummaryTotals?.deltaPercentageByOther ??
                    null;
                const isPositive = numberValue !== null && numberValue > 0;
                const isNegative = numberValue !== null && numberValue < 0;
                const color = isPositive
                    ? 'text-green-800'
                    : isNegative
                      ? 'text-red-800'
                      : 'ml-5 text-muted-foreground';
                const stringValue = report.competenceSummaryTotals
                    ?.deltaPercentageByOther
                    ? (isPositive ? '↑ +' : isNegative ? '↓ ' : '') +
                      formatNumber(
                          report.competenceSummaryTotals
                              ?.deltaPercentageByOther,
                      )
                    : `0`;
                return (
                    <div className="flex items-center justify-start pl-3 gap-1.5">
                        <span className={`font-medium ${color}`}>
                            {stringValue}
                        </span>
                    </div>
                );
            },
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
            cell: (report) => (
                <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                    <span className="text-foreground">
                        {format(report.createdAt, 'MMM dd, yyyy')}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap',
        },
        actions: {
            header: <span className="text-muted-foreground">Report</span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center align-bottom pb-2',
            cell: (report) => <IndividualReportActionsMenu report={report} />,
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
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
                                    <span className="text-muted-foreground">
                                        #{report.id}
                                    </span>
                                    <span className="break-words">
                                        {rateeFullNames[report.reviewId] ?? (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
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
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
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
                                                ] ?? (
                                                    <span className="text-muted-foreground">
                                                        None
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                        {rateeTeamTitles[report.reviewId] && (
                                            <span className="flex items-center gap-1 break-words">
                                                <Users className="h-3.5 w-3.5 shrink-0" />
                                                {rateeTeamTitles[
                                                    report.reviewId
                                                ] ?? (
                                                    <span className="text-muted-foreground">
                                                        None
                                                    </span>
                                                )}
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                            <IndividualReportActionsMenu report={report} />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <RefreshCcw className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {report.cycleId ? (
                                        (cycleTitles[report.cycleId] ?? (
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
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-medium text-muted-foreground break-words">
                                    {format(report.createdAt, 'MMM dd, yyyy')}
                                </span>
                            </span>

                            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="flex items-center gap-1 text-muted-foreground flex-wrap">
                                    <span className="flex items-center gap-1 text-foreground mr-2">
                                        Participation Stats
                                    </span>
                                    <Users className="h-3.5 w-3.5 shrink-0" />
                                    {report.answerCount ? (
                                        <span className="font-medium text-foreground">
                                            {report.answerCount}
                                        </span>
                                    ) : (
                                        `—`
                                    )}
                                    <span className="font-medium text-muted-foreground">
                                        {' of '}
                                    </span>
                                    <span className="font-medium text-foreground">
                                        {report.respondentCount ?? `—`}
                                    </span>
                                    <span className="whitespace-nowrap">
                                        {' respondents in '}
                                    </span>
                                    <Flag className="flex h-3.5 w-3.5 shrink-0 gap-x-1" />
                                    {report.respondentCategories ? (
                                        report.respondentCategories.map(
                                            (category) => (
                                                <CategoryBadge
                                                    key={category}
                                                    category={category}
                                                />
                                            ),
                                        )
                                    ) : (
                                        <span className="text-muted-foreground">
                                            None
                                        </span>
                                    )}
                                    {' categories'}
                                </span>
                            </span>

                            {report.turnoutPctOfTeam &&
                                report.turnoutPctOfOther && (
                                    <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <span className="flex items-center gap-1 text-foreground">
                                            Turnout
                                        </span>
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <UserRoundPen className="h-3.5 w-3.5 shrink-0" />
                                            <span className="font-medium text-foreground">
                                                {formatNumber(
                                                    report.turnoutPctOfTeam,
                                                )}
                                            </span>
                                            {'% team'}
                                        </span>

                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <UserRoundPen className="h-3.5 w-3.5 shrink-0" />
                                            <span className="font-medium text-foreground">
                                                {formatNumber(
                                                    report.turnoutPctOfOther,
                                                )}
                                            </span>
                                            {'% others'}
                                        </span>
                                    </span>
                                )}

                            {report.competenceSummaryTotals && (
                                <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <span className="flex items-center gap-1 text-foreground">
                                        Rating
                                    </span>
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <BookmarkCheck className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {formatNumber(
                                                report.competenceSummaryTotals
                                                    ?.percentageBySelfAssessment,
                                            )}
                                        </span>
                                        {'% self'}
                                    </span>

                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <BookmarkCheck className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {formatNumber(
                                                report.competenceSummaryTotals
                                                    ?.percentageByTeam,
                                            )}
                                        </span>
                                        {'% team'}
                                    </span>

                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <BookmarkCheck className="h-3.5 w-3.5 shrink-0" />
                                        <span className="font-medium text-foreground">
                                            {formatNumber(
                                                report.competenceSummaryTotals
                                                    ?.percentageByOther,
                                            )}
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
