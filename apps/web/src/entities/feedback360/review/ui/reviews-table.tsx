'use client';

import { format } from 'date-fns';
import {
    ArrowUpDown,
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
}: ReviewsTableProps) {
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
                                        <StageBadge stage={review.stage} />
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
                                            'None')
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
                                    {questionCounts[review.id] ?? 0}
                                </span>
                                {' questions'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {respondentCounts[review.id] ?? 0}
                                </span>
                                {' respondents'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <FileText className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {answerCounts[review.id] ?? 0}
                                </span>
                                {' answers'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {reviewerCounts[review.id] ?? 0}
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
                            <TableHead className="min-w-[250px] w-[300px]">
                                <SortableHeader
                                    label="Ratee"
                                    field="title"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[200px] w-[250px] whitespace-nowrap">
                                <SortableHeader
                                    label="Cycle"
                                    field="cycleTitle"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[150px] w-[150px] whitespace-nowrap">
                                <SortableHeader
                                    label="Creation Date"
                                    field="createdAt"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[80px] w-[100px] whitespace-nowrap text-center">
                                <SortableHeader
                                    label="Questions"
                                    field="questionCount"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[100px] w-[150px] whitespace-nowrap text-center">
                                <SortableHeader
                                    label="Status"
                                    field="stage"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[120px] w-[150px] whitespace-nowrap text-center">
                                <SortableHeader
                                    label="Respondents"
                                    field="respondentCount"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[100px] w-[120px] whitespace-nowrap text-center">
                                <SortableHeader
                                    label="Answers"
                                    field="answerCount"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[80px] w-[100px] whitespace-nowrap text-center">
                                <SortableHeader
                                    label="Reviewers"
                                    field="reviewerCount"
                                    currentField={sortField}
                                    currentDirection={sortDirection}
                                    onSort={onSort}
                                />
                            </TableHead>
                            <TableHead className="min-w-[80px] w-[100px] whitespace-nowrap text-center">
                                <span className="">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map((review) => (
                            <TableRow key={review.id}>
                                <TableCell className="min-w-[200px] whitespace-normal">
                                    <div className="flex flex-col gap-0.5 w-full">
                                        <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                                            {review.rateeFullName}
                                        </span>
                                        {review.rateePositionTitle &&
                                            review.teamTitle && (
                                                <span className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-1 gap-y-1">
                                                    <span className="break-words overflow-wrap-anywhere">
                                                        {
                                                            review.rateePositionTitle
                                                        }
                                                        ,
                                                    </span>
                                                    <span className="break-words overflow-wrap-anywhere">
                                                        {review.teamTitle}
                                                    </span>
                                                </span>
                                            )}
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-normal">
                                    <div className="flex items-center justify-start gap-1.5 w-full">
                                        <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                                            {review.cycleId
                                                ? (cycleTitles[
                                                    review.cycleId
                                                ] ?? 'None')
                                                : 'None'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap">
                                    <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                                        <span className="text-foreground">
                                            {format(
                                                review.createdAt,
                                                'MMM dd, yyyy',
                                            )}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <FileQuestionMark className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-foreground">
                                            {questionCounts[review.id] ?? 0}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-center">
                                    <StageBadge stage={review.stage} />
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-foreground">
                                            {respondentCounts[review.id] ?? 0}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-foreground">
                                            {answerCounts[review.id] ?? 0}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium text-foreground">
                                            {reviewerCounts[review.id] ?? 0}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-center">
                                    <ReviewActionsMenu
                                        review={review}
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
