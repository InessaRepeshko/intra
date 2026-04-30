'use client';

import { format } from 'date-fns';
import {
    Award,
    Calendar,
    FileUser,
    Flag,
    MessageCircle,
    MessageSquareQuote,
    RefreshCcw,
    TextInitial,
    Users,
    UsersRound,
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
import { SortableHeader } from '@shared/ui/sortable-table-column-header';
import { useEffect } from 'react';
import { Answer, Report, ReportComment, Review } from '../model/mappers';
import { AnswerType, SortDirection } from '../model/types';

interface IndividualReportCommentsTableProps {
    reports: Report[];
    reportTextAnswers: Record<number, Answer[]>;
    reportComments: Record<number, ReportComment[]>;
    reportReviews: Record<number, Review>;
    cycleTitles: Record<number, string>;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    resetTrigger?: number;
}

function IndividualReportCommentActionsMenu({ report }: { report: Report }) {
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
                                `/reporting/individual-reports/${report.id}/comments`,
                            )
                        }
                    >
                        <MessageSquareQuote className=" h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                    <p>View Comments</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function IndividualReportCommentsTable({
    reports,
    reportTextAnswers,
    reportComments,
    reportReviews,
    cycleTitles,
    sortField,
    sortDirection,
    onSort,
    resetTrigger,
}: IndividualReportCommentsTableProps) {
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
        | 'stage'
        | 'cycle'
        | 'textAnswers'
        | 'comments'
        | 'answers'
        | 'categories'
        | 'date'
        | 'actions'
    >('reports-table', [
        'id',
        'ratee',
        'stage',
        'cycle',
        'textAnswers',
        'comments',
        'answers',
        'categories',
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
        | 'stage'
        | 'cycle'
        | 'textAnswers'
        | 'comments'
        | 'answers'
        | 'categories'
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
                    label="Report #"
                    field="reportId"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[75px] w-[100px] text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground text-center cursor-pointer hover:underline"
                        onClick={() =>
                            router.push(
                                `/reporting/individual-reports/${report.id}/comments`,
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
                    field="ratee"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[250px] w-[300px] align-bottom cursor-grab active:cursor-grabbing rounded-full',
            cell: (report) => {
                const rateeFullName = reportReviews[report.id]?.rateeFullName;
                const positionTitle =
                    reportReviews[report.id]?.rateePositionTitle;
                const teamTitle = reportReviews[report.id]?.teamTitle;
                return (
                    <div className="flex flex-col gap-0.5 w-full">
                        <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                            {rateeFullName}
                        </span>
                        {(positionTitle || teamTitle) && (
                            <span className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-1 gap-y-1">
                                {positionTitle && (
                                    <span className="break-words overflow-wrap-anywhere">
                                        {positionTitle ?? (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
                                        )}
                                        {teamTitle ? `,` : ''}
                                    </span>
                                )}
                                {teamTitle && (
                                    <span className="break-words overflow-wrap-anywhere">
                                        {teamTitle ?? (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
                                        )}
                                    </span>
                                )}
                            </span>
                        )}
                    </div>
                );
            },
            cellClassName: 'min-w-[200px] whitespace-normal',
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
            cell: (report) => {
                const stage = reportReviews[report.id]?.stage;
                return stage ? (
                    <StageBadge key={report.id} stage={stage} />
                ) : (
                    <span className="text-muted-foreground">None</span>
                );
            },
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
                'min-w-[200px] w-[300px] whitespace-nowrap align-bottom cursor-grab active:cursor-grabbing',
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
        textAnswers: {
            header: (
                <SortableHeader
                    label="Text Answers"
                    field="textAnswerCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => {
                const textAnswerCount = reportTextAnswers[report.id]?.filter(
                    (answer) => answer.answerType === AnswerType.TEXT_FIELD,
                ).length;
                return (
                    <div className="flex items-center justify-center gap-1.5">
                        <TextInitial className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                            {textAnswerCount ?? `—`}
                        </span>
                    </div>
                );
            },
            cellClassName: 'whitespace-nowrap text-center',
        },
        comments: {
            header: (
                <SortableHeader
                    label="Comments"
                    field="commentCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (report) => (
                <div className="flex items-center justify-center gap-1.5">
                    <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {reportComments[report.id]?.length ?? `—`}
                    </span>
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
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                            {report.answerCount}
                        </span>
                    </div>
                ) : (
                    `—`
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
            cell: (report) => {
                const textAnswers = reportTextAnswers[report.id]?.filter(
                    (answer) => answer.answerType === AnswerType.TEXT_FIELD);
                const categories = [...new Set(textAnswers?.map((answer) => answer.respondentCategory))];

                return (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {categories && categories.length > 0 ? (
                            categories.map((category) => (
                                <CategoryBadge key={category} category={category} />
                            ))
                        ) : (
                            <span className="text-muted-foreground">None</span>
                        )}
                    </div>
                )
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
            cell: (report) => {
                const createdAt = reportComments[report.id]
                    ?.map((comment) => comment.createdAt)
                    .sort(
                        (a, b) => new Date(b).getTime() - new Date(a).getTime(),
                    )[0];
                return (
                    <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                        <span className="text-foreground">
                            {createdAt
                                ? format(createdAt, 'MMM dd, yyyy')
                                : '—'}
                        </span>
                    </div>
                );
            },
            cellClassName: 'whitespace-nowrap',
        },
        actions: {
            header: <span className="text-muted-foreground">Comments</span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center align-bottom pb-2',
            cell: (report) => (
                <IndividualReportCommentActionsMenu report={report} />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <MessageSquareQuote className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No individual report comments found
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
                {reports.map((report) => {
                    const rateeFullName =
                        reportReviews[report.id]?.rateeFullName;
                    const positionTitle =
                        reportReviews[report.id]?.rateePositionTitle;
                    const teamTitle = reportReviews[report.id]?.teamTitle;
                    const reviewStage = reportReviews[report.id]?.stage;
                    const cycleTitle = report.cycleId
                        ? cycleTitles[report.cycleId]
                        : undefined;
                    const createdAt = reportComments[report.id]
                        ?.map((comment) => comment.createdAt)
                        .sort(
                            (a, b) =>
                                new Date(b).getTime() - new Date(a).getTime(),
                        )[0];
                    const textAnswerCount = reportTextAnswers[
                        report.id
                    ]?.filter(
                        (answer) => answer.answerType === AnswerType.TEXT_FIELD,
                    ).length;
                    const respondentCategories = report.respondentCategories;
                    const reportCommentsCount =
                        reportComments[report.id]?.length;
                    return (
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
                                            {rateeFullName ?? (
                                                <span className="text-muted-foreground">
                                                    None
                                                </span>
                                            )}
                                        </span>
                                        <span className="whitespace-nowrap">
                                            {reviewStage ? (
                                                <StageBadge
                                                    key={report.id}
                                                    stage={reviewStage}
                                                />
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    None
                                                </span>
                                            )}
                                        </span>
                                    </p>
                                    {(positionTitle || teamTitle) && (
                                        <p className="mt-0.5 flex flex-row gap-x-4 gap-y-2 text-sm text-muted-foreground flex-wrap">
                                            {positionTitle && (
                                                <span className="flex items-center gap-1 break-words">
                                                    <Award className="h-3.5 w-3.5 shrink-0" />
                                                    {positionTitle ?? (
                                                        <span className="text-muted-foreground">
                                                            None
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                            {teamTitle && (
                                                <span className="flex items-center gap-1 break-words">
                                                    <Users className="h-3.5 w-3.5 shrink-0" />
                                                    {teamTitle ?? (
                                                        <span className="text-muted-foreground">
                                                            None
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                        </p>
                                    )}
                                </div>
                                <IndividualReportCommentActionsMenu
                                    report={report}
                                />
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                    <RefreshCcw className="shrink-0 h-3.5 w-3.5" />
                                    <span className="font-medium text-foreground break-words">
                                        {cycleTitle ? (
                                            <span className="text-foreground">
                                                {cycleTitle}
                                            </span>
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
                                        {createdAt
                                            ? format(createdAt, 'MMM dd, yyyy')
                                            : '—'}
                                    </span>
                                </span>

                                <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <span className="flex items-center gap-1 text-muted-foreground flex-wrap">
                                        <span className='flex items-center gap-1 whitespace-nowrap flex-row'>
                                            <MessageSquareQuote className="h-3.5 w-3.5 shrink-0" />
                                            {reportCommentsCount ? (
                                                <span className="font-medium text-foreground">
                                                    {reportCommentsCount}
                                                </span>
                                            ) : (
                                                `—`
                                            )}
                                            {' report comments'}
                                        </span>
                                        {'based on '}
                                        <span className='flex items-center gap-1 whitespace-nowrap flex-row'>
                                        <TextInitial className="h-3.5 w-3.5 shrink-0" />
                                            {textAnswerCount ? (
                                                <span className="font-medium text-foreground">
                                                    {textAnswerCount}
                                                </span>
                                            ) : (
                                                `—`
                                            )}
                                            {' text answers'}
                                        </span>
                                        {'from '}
                                        <span className='flex items-center gap-1 whitespace-nowrap flex-row'>
                                        <UsersRound className="h-3.5 w-3.5 shrink-0" />
                                            <span className="font-medium text-foreground">
                                                {report.answerCount ?? `—`}
                                            </span>
                                            {' respondents'}
                                        </span>
                                        {'across '}
                                        <Flag className="flex h-3.5 w-3.5 shrink-0 gap-x-1" />
                                        {respondentCategories ? (
                                            respondentCategories.map(
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
                            </div>
                        </div>
                    );
                })}
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
