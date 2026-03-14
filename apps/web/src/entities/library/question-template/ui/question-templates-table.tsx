'use client';

import { format } from 'date-fns';
import {
    Award,
    Bookmark,
    Calendar,
    Eye,
    FileQuestionMark,
    MoreHorizontal,
    Pencil,
    StopCircle,
    Trash2,
} from 'lucide-react';

import { cn } from '@/shared/lib/utils/cn';
import { QuestionTemplate } from '@entities/library/question-template/model/mappers';
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
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    ForSelfassessmentType,
    QuestionTemplateStatus,
    SortDirection,
} from '../model/types';
import { AnswerTypeBadge } from './answer-type-badge';
import { ForSelfAssessmentBadge } from './is-for-self-assessment-badge';
import { StatusBadge } from './status-badge';

interface QuestionTemplatesTableProps {
    questionTemplates: QuestionTemplate[];
    positionCounts: Record<number, number>;
    competenceTitles: Record<number, string>;
    positionTitles: Record<number, { id: number; title: string }[]>;
    sortField: string;
    sortDirection: SortDirection;
    onSort: (field: string) => void;
    onArchive?: (questionTemplate: QuestionTemplate) => void;
    onDelete?: (questionTemplate: QuestionTemplate) => void;
    resetTrigger?: number;
}

function QuestionTemplateActionsMenu({
    questionTemplate,
    onArchive,
    onDelete,
}: {
    questionTemplate: QuestionTemplate;
    onArchive?: (questionTemplate: QuestionTemplate) => void;
    onDelete?: (questionTemplate: QuestionTemplate) => void;
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
                {questionTemplate.status === QuestionTemplateStatus.ACTIVE && (
                    <DropdownMenuItem
                        className="text-amber-700 focus:bg-amber-50 focus:text-amber-800"
                        onClick={() => onArchive?.(questionTemplate)}
                    >
                        <StopCircle className="mr-2 h-4 w-4" />
                        Archive
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => onDelete?.(questionTemplate)}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function QuestionTemplatesTable({
    questionTemplates,
    positionCounts,
    competenceTitles,
    positionTitles,
    sortField,
    sortDirection,
    onSort,
    onArchive,
    onDelete,
    resetTrigger,
}: QuestionTemplatesTableProps) {
    const {
        columnOrder,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        resetOrder,
    } = useDraggableColumns<
        | 'title'
        | 'isForSelfassessment'
        | 'answerType'
        | 'competence'
        | 'positions'
        | 'date'
        | 'status'
        | 'actions'
    >('reviews-table', [
        'title',
        'isForSelfassessment',
        'answerType',
        'competence',
        'positions',
        'date',
        'status',
        'actions',
    ]);

    useEffect(() => {
        if (resetTrigger && resetTrigger > 0) {
            resetOrder();
        }
    }, [resetTrigger, resetOrder]);

    const ExpandablePositions = ({
        positions,
    }: {
        positions: { id: number; title: string }[];
    }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        if (!positions?.length)
            return <span className="text-muted-foreground">None</span>;

        const firstPosition = positions[0].title;
        const extraCount = positions.length - 1;

        return (
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                }}
                className={cn(
                    'group flex flex-wrap items-center justify-start gap-1 cursor-pointer transition-all duration-200 p-1 rounded-md hover:bg-muted/50',
                    isExpanded ? 'bg-muted/30' : 'max-w-[220px]',
                )}
            >
                {isExpanded ? (
                    <div className="flex flex-row items-center justify-center gap-1">
                        <Award className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <div className="flex flex-wrap flex-col gap-1 items-start justify-start animate-in fade-in slide-in-from-top-1">
                            {positions.map((p, index) => (
                                <span
                                    key={p.id}
                                    className="text-sm font-medium text-foreground"
                                >
                                    {p.title}
                                    {index < positions.length - 1 ? ',' : ''}
                                </span>
                            ))}
                        </div>
                        <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-1">
                        <Award className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="text-sm font-medium truncate text-foreground">
                            {firstPosition}
                        </span>
                        {extraCount > 0 && (
                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full shrink-0">
                                +{extraCount}
                            </span>
                        )}
                        <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
            </div>
        );
    };

    const COLUMNS: Record<
        | 'title'
        | 'isForSelfassessment'
        | 'answerType'
        | 'competence'
        | 'positions'
        | 'date'
        | 'status'
        | 'actions',
        {
            header: React.ReactNode;
            headerClassName: string;
            cell: (questionTemplate: QuestionTemplate) => React.ReactNode;
            cellClassName: string;
        }
    > = {
        title: {
            header: (
                <SortableHeader
                    label="Question Template"
                    field="title"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[250px] w-[300px] whitespace-nowrap cursor-grab active:cursor-grabbing',
            cell: (questionTemplate) => (
                <div className="flex items-center justify-start gap-1.5 w-full">
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {questionTemplate.title}
                    </span>
                </div>
            ),
            cellClassName: 'whitespace-normal',
        },
        isForSelfassessment: {
            header: (
                <SortableHeader
                    label="For Self-assessment"
                    field="isForSelfassessment"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[180px] w-[180px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (questionTemplate) => (
                <ForSelfAssessmentBadge
                    key={questionTemplate.id}
                    forSelfassessment={
                        String(
                            questionTemplate.isForSelfassessment,
                        ).toUpperCase() as ForSelfassessmentType
                    }
                />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        answerType: {
            header: (
                <SortableHeader
                    label="Answer Type"
                    field="answerType"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[150px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (questionTemplate) => (
                <AnswerTypeBadge
                    key={questionTemplate.id}
                    answerType={questionTemplate.answerType}
                />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        competence: {
            header: (
                <SortableHeader
                    label="Competence"
                    field="competence"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[200px] whitespace-nowrap cursor-grab active:cursor-grabbing',
            cell: (questionTemplate) => (
                <div className="flex items-center justify-start gap-1.5 w-full">
                    <Bookmark className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="font-medium text-foreground break-words overflow-wrap-anywhere">
                        {questionTemplate.competenceId ? (
                            (competenceTitles[
                                questionTemplate.competenceId
                            ] ?? (
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
        positions: {
            header: (
                <SortableHeader
                    label="Positions"
                    field="positions"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[150px] w-[200px] whitespace-nowrap text-start align-bottom cursor-grab active:cursor-grabbing',
            cell: (questionTemplate) => (
                <ExpandablePositions
                    positions={positionTitles[questionTemplate.id] || []}
                />
            ),
            cellClassName: 'text-center',
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
        status: {
            header: (
                <SortableHeader
                    label="Status"
                    field="status"
                    currentField={sortField}
                    currentDirection={sortDirection}
                    onSort={onSort}
                />
            ),
            headerClassName:
                'min-w-[100px] w-[100px] whitespace-nowrap text-center cursor-grab active:cursor-grabbing',
            cell: (questionTemplate) => (
                <StatusBadge
                    key={questionTemplate.id}
                    status={questionTemplate.status}
                />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
        actions: {
            header: <span className="text-muted-foreground">Actions</span>,
            headerClassName:
                'min-w-[80px] w-[100px] whitespace-nowrap text-center pb-1',
            cell: (questionTemplate) => (
                <QuestionTemplateActionsMenu
                    questionTemplate={questionTemplate}
                    onArchive={onArchive}
                    onDelete={onDelete}
                />
            ),
            cellClassName: 'whitespace-nowrap text-center',
        },
    };

    if (questionTemplates.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                    <FileQuestionMark className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    No question templates found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or create a new question
                    template.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Mobile card layout (hidden on md+) */}
            <div className="flex flex-col gap-3 lg:hidden">
                {questionTemplates.map((questionTemplate) => (
                    <div
                        key={questionTemplate.id}
                        className="rounded-lg border bg-card p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                                <p className="flex items-center gap-x-2 gap-y-1 font-medium text-foreground flex-wrap">
                                    <span className="break-words">
                                        {questionTemplate.title}
                                    </span>
                                    <span className="whitespace-nowrap">
                                        {questionTemplate.status ? (
                                            <StatusBadge
                                                key={questionTemplate.id}
                                                status={questionTemplate.status}
                                            />
                                        ) : (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
                                        )}
                                    </span>
                                </p>
                            </div>
                            <QuestionTemplateActionsMenu
                                questionTemplate={questionTemplate}
                                onArchive={onArchive}
                                onDelete={onDelete}
                            />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center">
                                <AnswerTypeBadge
                                    key={questionTemplate.id}
                                    answerType={questionTemplate.answerType}
                                />
                            </span>
                            <span className="flex items-center justify-start">
                                <ForSelfAssessmentBadge
                                    key={questionTemplate.id}
                                    forSelfassessment={
                                        String(
                                            questionTemplate.isForSelfassessment,
                                        ).toUpperCase() as ForSelfassessmentType
                                    }
                                />
                                <span className="font-medium text-muted-foreground break-words">
                                    {questionTemplate.isForSelfassessment
                                        ? 'For self-assessment'
                                        : 'Not for self-assessment'}
                                </span>
                            </span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Bookmark className="shrink-0 h-3.5 w-3.5" />
                                <span className="font-medium text-foreground break-words">
                                    {questionTemplate.competenceId ? (
                                        (competenceTitles[
                                            questionTemplate.competenceId
                                        ] ?? (
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
                                <Award className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">
                                    {positionCounts[questionTemplate.id] ?? `—`}
                                </span>
                                {positionCounts[questionTemplate.id] === 1
                                    ? ' position'
                                    : ' positions'}
                            </span>

                            <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="font-medium text-muted-foreground break-words">
                                    {format(
                                        questionTemplate.createdAt,
                                        'MMM dd, yyyy',
                                    )}
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
                        {questionTemplates.map((questionTemplate) => (
                            <TableRow key={questionTemplate.id}>
                                {columnOrder.map((id) => {
                                    const col = COLUMNS[id];
                                    return (
                                        <TableCell
                                            key={id}
                                            className={col.cellClassName}
                                        >
                                            {col.cell(questionTemplate)}
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
