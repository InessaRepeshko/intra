'use client';

import { format } from 'date-fns';
import {
    Award,
    Bookmark,
    Calendar,
    Eye,
    File,
    FileQuestionMark,
    MoreHorizontal,
    RefreshCcw,
    Sigma,
    TextInitial,
    Users,
} from 'lucide-react';

import { StageBadge } from '@entities/feedback360/review/ui/stage-badge';
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
import { SortableHeader } from '@shared/ui/sortable-table-column-header';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SurveyData, SurveyQuestion } from '../model/mappers';
import { SortDirection } from '../model/types';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@shared/components/ui/tooltip';

interface SurveysTableProps {
    surveyQuestions: Record<number, SurveyQuestion[]>;
    surveys: SurveyData[];
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    resetTrigger?: number;
}

function SurveysActionsMenu({
    reviewId,
}: {
    reviewId: number;
}) {
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
                            router.push(`/feedback360/surveys/${reviewId}`)
                        }
                    >
                        <File className=" h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                    <p>View Survey</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function SurveysTable({
    surveyQuestions,
    surveys,
    sortField,
    sortDirection,
    onSort,
    resetTrigger,
}: SurveysTableProps) {
    const {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    } = useDraggableColumns<
        | 'reviewId'
        | 'ratee'
        | 'stage'
        | 'cycle'
        | 'competenceCount'
        | 'questionCount'
        | 'numericalQuestionCount'
        | 'textQuestionCount'
        | 'date'
        | 'actions'
    >('surveys-table', [
        'reviewId',
        'ratee',
        'stage',
        'cycle',
        'competenceCount',
        'questionCount',
        'numericalQuestionCount',
        'textQuestionCount',
        'date',
        'actions',
    ]);

    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetOrder();
        }
    }, [resetTrigger, resetOrder]);

    const router = useRouter();

    const COLUMNS: Record<
        | 'reviewId'
        | 'ratee'
        | 'stage'
        | 'cycle'
        | 'competenceCount'
        | 'questionCount'
        | 'numericalQuestionCount'
        | 'textQuestionCount'
        | 'date'
        | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (survey: SurveyData) => React.ReactNode;
            cellClassName: string;
        }
    > = {
        reviewId: {
            header: (
                <SortableHeader
                    label="Review #"
                    field="reviewId"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[75px] w-[100px] text-center align-bottom cursor-grab active:cursor-grabbing',
            cell: (survey) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground text-center cursor-pointer hover:underline"
                        onClick={() =>
                            router.push(
                                `/feedback360/surveys/${survey.reviewId}`,
                            )
                        }
                    >
                        <span className="font-medium text-foreground">
                            {survey.reviewId}
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
                'min-w-[200px] w-[250px] cursor-grab active:cursor-grabbing',
            cell: (survey) => (
                <div className="flex flex-col gap-0.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {survey?.rateeFullName}
                    </span>
                    {(survey?.positionTitle || survey?.teamTitle) && (
                        <span className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-1 gap-y-1">
                            {survey.positionTitle && (
                                <span className="break-words overflow-wrap-anywhere">
                                    {survey.positionTitle}
                                    {survey.teamTitle && ','}
                                </span>
                            )}
                            {survey.teamTitle && (
                                <span className="break-words overflow-wrap-anywhere">
                                    {survey.teamTitle}
                                </span>
                            )}
                        </span>
                    )}
                </div>
            ),
            cellClassName: 'min-w-[200px] whitespace-normal',
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
            cell: (survey) => (
                <StageBadge key={survey.reviewId} stage={survey.stage} />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        cycle: {
            header: (
                <SortableHeader
                    label="Cycle"
                    field="cycle"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[200px] w-[300px] whitespace-nowrap cursor-grab active:cursor-grabbing',
            cell: (survey) => (
                <div className="flex items-center justify-start gap-1.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {survey?.cycleId && survey.cycleTitle
                            ? survey.cycleTitle
                            : `None`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-normal',
        },
        competenceCount: {
            header: (
                <SortableHeader
                    label="Competences"
                    field="competenceCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[100px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (survey) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Bookmark className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {survey.competenceCount ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        questionCount: {
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
                'min-w-[100px] w-[120px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (survey) => (
                <div className="flex items-center justify-center gap-1.5">
                    <FileQuestionMark className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {survey.questionCount ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        numericalQuestionCount: {
            header: (
                <SortableHeader
                    label="Numerical Questions"
                    field="numericalQuestionCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[100px] w-[200px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (survey) => (
                <div className="flex items-center justify-center gap-1.5">
                    <Sigma className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {survey.numericalQuestionCount ?? `—`}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        textQuestionCount: {
            header: (
                <SortableHeader
                    label="Text Questions"
                    field="textQuestionCount"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[100px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (survey) => (
                <div className="flex items-center justify-center gap-1.5">
                    <TextInitial className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                        {survey.textQuestionCount ?? `—`}
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
                'min-w-[150px] w-[150px] whitespace-nowrap cursor-grab active:cursor-grabbing',
            cell: (survey) => (
                <div className="flex flex-col items-center justify-start gap-0.5 text-sm">
                    <span className="text-foreground">
                        {format(survey.createdAt, 'MMM dd, yyyy')}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-nowrap',
        },
        actions: {
            header: <span className="text-muted-foreground">Actions</span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center pb-1',
            cell: (survey) => (
                <SurveysActionsMenu
                    reviewId={survey.reviewId}
                />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (Object.values(surveyQuestions).flat().length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <FileQuestionMark className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No surveys found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or create a new survey.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile card layout (hidden on md+) */}
            <div className="flex flex-col gap-3 lg:hidden">
                {surveys.map((survey) => (
                    <div
                        key={survey.reviewId}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-x-2 gap-y-1 font-medium text-foreground flex-wrap">
                                    <span className="text-muted-foreground">
                                        #{survey.reviewId}
                                    </span>
                                    <span className="break-words">
                                        {survey.rateeFullName}
                                    </span>
                                    <span className="whitespace-nowrap">
                                        {survey.stage ? (
                                            <StageBadge
                                                key={survey.reviewId}
                                                stage={survey.stage}
                                            />
                                        ) : (
                                            `None`
                                        )}
                                    </span>
                                </p>
                                {survey.positionTitle && (
                                    <p className="mt-0.5 flex flex-row gap-x-4 gap-y-2 text-sm text-muted-foreground flex-wrap">
                                        <span className="flex items-center gap-1 break-words">
                                            <Award className="h-3.5 w-3.5 shrink-0" />
                                            {survey.positionTitle}
                                        </span>
                                        <span className="flex items-center gap-1 break-words">
                                            <Users className="h-3.5 w-3.5 shrink-0" />
                                            {survey.teamTitle}
                                        </span>
                                    </p>
                                )}
                            </div>
                            <SurveysActionsMenu
                                reviewId={survey.reviewId}
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <RefreshCcw className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {survey.cycleId
                                        ? (survey.cycleTitle ?? `None`)
                                        : 'None'}
                                </span>
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="text-muted-foreground break-words">
                                    {format(survey.createdAt, 'MMM dd, yyyy')}
                                </span>
                            </span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Bookmark className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {survey.competenceCount ?? `—`}
                                </span>
                                {' competences'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground flex-wrap">
                                <span className="flex items-center gap-1 whitespace-nowrap flex-row">
                                    <FileQuestionMark className="h-3.5 w-3.5 shrink-0" />
                                    <span className="font-medium text-foreground">
                                        {survey.questionCount ?? `—`}
                                    </span>
                                    {' total questions: '}
                                </span>
                                <span className="flex items-center gap-1 whitespace-nowrap flex-row">
                                    <Sigma className="h-3.5 w-3.5 shrink-0" />
                                    <span className="font-medium text-foreground">
                                        {survey.numericalQuestionCount ?? `—`}
                                    </span>
                                    {' numerical'}
                                </span>
                                {'and'}
                                <span className="flex items-center gap-1 whitespace-nowrap flex-row">
                                    <TextInitial className="h-3.5 w-3.5 shrink-0" />
                                    <span className="font-medium text-foreground">
                                        {survey.textQuestionCount ?? `—`}
                                    </span>
                                    {' text-based'}
                                </span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop table layout (visible on md+) */}
            <div className="hidden overflow-x-auto lg:block w-full min-w-0">
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
                        {surveys.map((review) => (
                            <TableRow key={review.reviewId}>
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
