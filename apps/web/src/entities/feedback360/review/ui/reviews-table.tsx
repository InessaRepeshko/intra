'use client';

import { format } from 'date-fns';
import {
    Award,
    Calendar,
    Eye,
    FileQuestionMark,
    FileText,
    MoreHorizontal,
    Pencil,
    RefreshCcw,
    StopCircle,
    Trash2,
    Users,
} from 'lucide-react';

import { Review } from '@entities/feedback360/review/model/mappers';
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
import { ReviewStage, SortDirection } from '../model/types';
import { StageBadge } from './stage-badge';

interface ReviewsTableProps {
    reviews: Review[];
    cycleTitles: Record<number, string>;
    respondentCounts: Record<number, number>;
    reviewerCounts: Record<number, number>;
    answerCounts: Record<number, number>;
    questionCounts: Record<number, number>;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    onForceFinish?: (review: Review) => void;
    onDelete?: (review: Review) => void;
    resetTrigger?: number;
}

function ReviewActionsMenu({
    review,
    onForceFinish,
    onDelete,
}: {
    review: Review;
    onForceFinish?: (review: Review) => void;
    onDelete?: (review: Review) => void;
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
                {review.stage === ReviewStage.IN_PROGRESS && (
                    <DropdownMenuItem
                        className="text-amber-700 focus:bg-amber-50 focus:text-amber-800"
                        onClick={() => onForceFinish?.(review)}
                    >
                        <StopCircle className="mr-2 h-4 w-4" />
                        Force Finish
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => onDelete?.(review)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function ReviewsTable({
    reviews,
    cycleTitles,
    respondentCounts,
    reviewerCounts,
    answerCounts,
    questionCounts,
    sortField,
    sortDirection,
    onSort,
    onForceFinish,
    onDelete,
    resetTrigger,
}: ReviewsTableProps) {
    const {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    } = useDraggableColumns<
        | 'ratee'
        | 'cycle'
        | 'date'
        | 'questions'
        | 'stage'
        | 'respondents'
        | 'answers'
        | 'reviewers'
        | 'actions'
    >('reviews-table', [
        'ratee',
        'cycle',
        'date',
        'questions',
        'stage',
        'respondents',
        'answers',
        'reviewers',
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
        | 'questions'
        | 'stage'
        | 'respondents'
        | 'answers'
        | 'reviewers'
        | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (review: Review) => React.ReactNode;
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
                'min-w-[250px] w-[300px] cursor-grab active:cursor-grabbing',
            cell: (review) => (
                <div className="flex flex-col gap-0.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {review.rateeFullName}
                    </span>
                    {review.rateePositionTitle ||
                        (review.teamTitle && (
                            <span className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-1 gap-y-1">
                                {review.rateePositionTitle && (
                                    <span className="break-words overflow-wrap-anywhere">
                                        {review.rateePositionTitle}
                                        {review.teamTitle && ','}
                                    </span>
                                )}
                                {review.teamTitle && (
                                    <span className="break-words overflow-wrap-anywhere">
                                        {review.teamTitle}
                                    </span>
                                )}
                            </span>
                        ))}
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
                'min-w-[200px] w-[250px] whitespace-nowrap cursor-grab active:cursor-grabbing',
            cell: (review) => (
                <div className="flex items-center justify-start gap-1.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {review.cycleId
                            ? (cycleTitles[review.cycleId] ?? `None`)
                            : 'None'}
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
                'min-w-[150px] w-[150px] whitespace-nowrap cursor-grab active:cursor-grabbing',
            cell: (review) => (
                <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                    <span className="text-foreground">
                        {format(review.createdAt, 'MMM dd, yyyy')}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap',
        },
        questions: {
            header: (
                <SortableHeader
                    label="Questions"
                    field="questionCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (review) => (
                <div className="flex items-center justify-center gap-1.5">
                    <FileQuestionMark className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {questionCounts[review.id] ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        stage: {
            header: (
                <SortableHeader
                    label="Stage"
                    field="stage"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[100px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (review) => (
                <StageBadge key={review.stage} stage={review.stage} />
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
                'min-w-[120px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (review) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {respondentCounts[review.id] ?? `—`}
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
                'min-w-[100px] w-[120px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (review) => (
                <div className="flex items-center justify-center gap-1.5">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {answerCounts[review.id] ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        reviewers: {
            header: (
                <SortableHeader
                    label="Reviewers"
                    field="reviewerCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (review) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {reviewerCounts[review.id] ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        actions: {
            header: <span className="text-muted-foreground">Actions</span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center pb-1',
            cell: (review) => (
                <ReviewActionsMenu
                    review={review}
                    onForceFinish={onForceFinish}
                    onDelete={onDelete}
                />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (reviews.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No reviews found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or create a new review.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile card layout (hidden on md+) */}
            <div className="flex flex-col gap-3 lg:hidden">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-x-2 gap-y-1 font-medium text-foreground flex-wrap">
                                    <span className="break-words">
                                        {review.rateeFullName}
                                    </span>
                                    <span className="whitespace-nowrap">
                                        {review.stage ? (
                                            <StageBadge
                                                key={review.stage}
                                                stage={review.stage}
                                            />
                                        ) : (
                                            `None`
                                        )}
                                    </span>
                                </p>
                                {review.rateePositionTitle && (
                                    <p className="mt-0.5 flex flex-row gap-x-4 gap-y-2 text-sm text-muted-foreground flex-wrap">
                                        <span className="flex items-center gap-1 break-words">
                                            <Award className="h-3.5 w-3.5 shrink-0" />
                                            {review.rateePositionTitle}
                                        </span>
                                        <span className="flex items-center gap-1 break-words">
                                            <Users className="h-3.5 w-3.5 shrink-0" />
                                            {review.teamTitle}
                                        </span>
                                    </p>
                                )}
                            </div>
                            <ReviewActionsMenu
                                review={review}
                                onForceFinish={onForceFinish}
                                onDelete={onDelete}
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <RefreshCcw className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {review.cycleId
                                        ? (cycleTitles[review.cycleId] ??
                                          `None`)
                                        : 'None'}
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {format(review.createdAt, 'MMM dd, yyyy')}
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <FileQuestionMark className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {questionCounts[review.id] ?? `—`}
                                </span>
                                {' questions'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {respondentCounts[review.id] ?? `—`}
                                </span>
                                {' respondents'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <FileText className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {answerCounts[review.id] ?? `—`}
                                </span>
                                {' answers'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {reviewerCounts[review.id] ?? `—`}
                                </span>
                                {' reviewers'}
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
                        {reviews.map((review) => (
                            <TableRow key={review.id}>
                                {columnOrder.map((id) => {
                                    const col = COLUMNS[id];
                                    return (
                                        <TableCell
                                            key={id}
                                            className={col.cellClassName}
                                        >
                                            {col.cell(review)}
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
