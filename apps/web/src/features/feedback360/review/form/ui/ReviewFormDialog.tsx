'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
    Calendar as CalendarIcon,
    Check,
    ChevronsUpDown,
    Eye,
    Lock,
    Pencil,
    Plus,
    RotateCcw,
    Save,
    StopCircle,
    Trash2,
    X,
} from 'lucide-react';
import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { toast } from 'sonner';

import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import type { Cycle } from '@entities/feedback360/cycle/model/mappers';
import { CycleStage } from '@entities/feedback360/cycle/model/types';
import { useReviewRespondentsQuery } from '@entities/feedback360/respondent/api/respondent.queries';
import type { Review } from '@entities/feedback360/review/model/mappers';
import {
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
} from '@entities/feedback360/review/model/types';
import { StageBadge } from '@entities/feedback360/review/ui/stage-badge';
import { useReviewReviewersQuery } from '@entities/feedback360/reviewer/api/reviewer.queries';
import { fetchReviewQuestions } from '@entities/feedback360/survey/api/review-question-relation.api';
import {
    mapSurveyQuestionDtoToModel,
    type SurveyQuestion,
} from '@entities/feedback360/survey/model/mappers';
import {
    useUserQuery,
    useUsersByUserIdsQuery,
    useUsersQuery,
} from '@entities/identity/user/api/user.queries';
import { useAuth } from '@entities/identity/user/model/auth-context';
import type { User } from '@entities/identity/user/model/mappers';
import { fetchCompetenceTitlesByIds } from '@entities/library/competence/api/competence.api';
import { useQuestionTemplatesQuery } from '@entities/library/question-template/api/question-template.queries';
import {
    AnswerType,
    ForSelfassessmentType,
    QuestionTemplateStatus,
} from '@entities/library/question-template/model/types';
import { fetchPositionTitlesByIds } from '@entities/organisation/position/api/position.api';
import { fetchTeamTitlesByIds } from '@entities/organisation/team/api/team.api';
import { DeleteReviewDialog } from '@features/feedback360/review/delete/ui/DeleteReviewDialog';
import { ForceCompleteReviewDialog } from '@features/feedback360/review/force-complete/ui/ForceCompleteReviewDialog';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@shared/components/ui/command';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@shared/components/ui/dialog';
import { Label } from '@shared/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@shared/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shared/components/ui/select';
import { Textarea } from '@shared/components/ui/textarea';
import { cn } from '@shared/lib/utils/cn';

import { answerTypeConfig } from '@entities/library/question-template/ui/answer-type-badge';
import { forSelfAssessmentConfig } from '@entities/library/question-template/ui/is-for-self-assessment-badge';
import {
    useCreateReviewFormMutation,
    useUpdateReviewFormMutation,
} from '../api/review-form.mutation';
import {
    reviewFormSchema,
    type ReviewFormValues,
} from '../model/review-form.schema';

export type ReviewFormMode = 'create' | 'edit' | 'view';

interface ReviewFormDialogProps {
    mode: ReviewFormMode;
    review?: Review | null;
    open?: boolean;
    onClose: () => void;
}

const inputClassName =
    'border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground rounded-xl';

interface UserOption {
    id: number;
    fullName: string;
    email: string;
    positionTitle: string;
    teamTitle: string;
    managerId: number | null;
}

function userSearchHaystack(option: UserOption): string {
    return `${option.fullName} ${option.email} ${option.positionTitle} ${option.teamTitle}`.toLowerCase();
}

interface QuestionOption {
    id: number;
    title: string;
    competenceTitle: string;
    answerType: AnswerType;
    isForSelfassessment: boolean;
    positionIds: number[];
}

function questionSearchHaystack(option: QuestionOption): string {
    return `${option.title} ${option.competenceTitle} ${option.answerType}`.toLowerCase();
}

function forwardWheelToCommandList(e: React.WheelEvent<HTMLDivElement>) {
    const list = (e.currentTarget as HTMLElement).querySelector(
        '[cmdk-list]',
    ) as HTMLElement | null;
    if (!list) return;
    if (list.scrollHeight <= list.clientHeight) return;
    list.scrollTop += e.deltaY;
    e.preventDefault();
    e.stopPropagation();
}

function buildDefaults(
    review: Review | null | undefined,
    currentUserId: number,
): Partial<ReviewFormValues> {
    if (!review) {
        return {
            rateeId: undefined as unknown as number,
            hrId: currentUserId,
            hrNote: '',
            cycleId: undefined,
            stage: ReviewStage.NEW,
            respondentIds: [],
            reviewerIds: [],
            questionTemplateIds: [],
        };
    }
    return {
        rateeId: review.rateeId,
        hrId: review.hrId ?? currentUserId,
        hrNote: review.hrNote ?? '',
        cycleId: review.cycleId ?? undefined,
        stage: review.stage,
        respondentIds: [review.rateeId],
        reviewerIds: [review.rateeId],
        questionTemplateIds: [],
    };
}

function isStageDisabledFor(stage: ReviewStage, mode: ReviewFormMode): boolean {
    if (mode === 'create') {
        return stage !== ReviewStage.NEW;
    }
    if (mode === 'edit') {
        return (
            stage === ReviewStage.PREPARING_REPORT ||
            stage === ReviewStage.PROCESSING_BY_HR ||
            stage === ReviewStage.PUBLISHED ||
            stage === ReviewStage.ANALYSIS
        );
    }
    return true;
}

// =====================================================================
// User single-select combobox (search by name / position / team)
// =====================================================================

function UserSingleCombobox({
    options,
    value,
    onChange,
    placeholder,
    disabled,
}: {
    options: UserOption[];
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    placeholder: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const selected = options.find((opt) => opt.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        'w-full justify-between text-left font-normal h-auto min-h-9 py-2',
                        inputClassName,
                        !selected && 'text-muted-foreground',
                    )}
                >
                    {selected ? (
                        <div className="flex flex-col items-start min-w-0 flex-1">
                            <span className="font-medium text-foreground truncate">
                                {selected.fullName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                                {[selected.positionTitle, selected.teamTitle]
                                    .filter(Boolean)
                                    .join(' · ') || selected.email}
                            </span>
                        </div>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0"
                align="start"
                style={{ width: 'var(--radix-popover-trigger-width)' }}
                onWheel={forwardWheelToCommandList}
                onTouchMove={(e) => e.stopPropagation()}
            >
                <Command
                    filter={(itemValue, search) =>
                        itemValue.toLowerCase().includes(search.toLowerCase())
                            ? 1
                            : 0
                    }
                >
                    <CommandInput placeholder="Search by name, position, team..." />
                    <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>
                        {options.map((option) => (
                            <CommandItem
                                key={option.id}
                                value={userSearchHaystack(option)}
                                onSelect={() => {
                                    onChange(option.id);
                                    setOpen(false);
                                }}
                            >
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="font-medium text-foreground truncate">
                                        {option.fullName}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate">
                                        {[
                                            option.positionTitle,
                                            option.teamTitle,
                                        ]
                                            .filter(Boolean)
                                            .join(' · ') || option.email}
                                    </span>
                                </div>
                                {value === option.id && (
                                    <Check className="ml-auto h-4 w-4 shrink-0" />
                                )}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

// =====================================================================
// User multi-select combobox (with locked chips for ratee)
// =====================================================================

function UserMultiCombobox({
    options,
    value,
    onChange,
    placeholder,
    disabled,
    lockedIds = [],
}: {
    options: UserOption[];
    value: number[];
    onChange: (value: number[]) => void;
    placeholder: string;
    disabled?: boolean;
    lockedIds?: number[];
}) {
    const [open, setOpen] = useState(false);
    const isLocked = (id: number) => lockedIds.includes(id);

    const selectedOptions = useMemo(
        () =>
            value
                .map((id) => options.find((opt) => opt.id === id))
                .filter((opt): opt is UserOption => Boolean(opt)),
        [value, options],
    );

    const toggle = (id: number) => {
        if (value.includes(id)) {
            if (isLocked(id)) return;
            onChange(value.filter((v) => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            'w-full justify-between text-left font-normal',
                            inputClassName,
                            value.length === 0 && 'text-muted-foreground',
                        )}
                    >
                        <span className="truncate">
                            {value.length === 0
                                ? placeholder
                                : `${value.length} selected`}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0"
                    align="start"
                    style={{ width: 'var(--radix-popover-trigger-width)' }}
                    onWheel={forwardWheelToCommandList}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <Command
                        filter={(itemValue, search) =>
                            itemValue
                                .toLowerCase()
                                .includes(search.toLowerCase())
                                ? 1
                                : 0
                        }
                    >
                        <CommandInput placeholder="Search by name, position, team..." />
                        <CommandList>
                            <CommandEmpty>No users found.</CommandEmpty>
                            {options.map((option) => {
                                const isSelected = value.includes(option.id);
                                const locked = isLocked(option.id);
                                return (
                                    <CommandItem
                                        key={option.id}
                                        value={userSearchHaystack(option)}
                                        onSelect={() => toggle(option.id)}
                                        disabled={isSelected && locked}
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'border-muted-foreground/40',
                                            )}
                                        >
                                            {isSelected && (
                                                <Check className="h-3 w-3" />
                                            )}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="font-medium text-foreground truncate">
                                                {option.fullName}
                                            </span>
                                            <span className="text-xs text-muted-foreground truncate">
                                                {[
                                                    option.positionTitle,
                                                    option.teamTitle,
                                                ]
                                                    .filter(Boolean)
                                                    .join(' · ') ||
                                                    option.email}
                                            </span>
                                        </div>
                                        {locked && isSelected && (
                                            <Lock className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((option) => {
                        const locked = isLocked(option.id);
                        const subline =
                            [option.positionTitle, option.teamTitle]
                                .filter(Boolean)
                                .join(' · ') || option.email;
                        return (
                            <div
                                key={option.id}
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 max-w-full w-full',
                                    locked ? 'bg-muted/80' : '',
                                )}
                            >
                                <div className="flex flex-col min-w-0 w-full">
                                    <span className="text-sm font-medium truncate">
                                        {option.fullName}
                                    </span>
                                    <span
                                        className={cn(
                                            'text-xs truncate',
                                            locked
                                                ? 'text-primary/70'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {subline}
                                    </span>
                                </div>
                                {locked ? (
                                    <Lock className="h-3.5 w-3.5 shrink-0" />
                                ) : (
                                    !disabled && (
                                        <button
                                            type="button"
                                            className="ml-0.5 rounded-full p-1 hover:bg-foreground/10 shrink-0"
                                            onClick={() =>
                                                onChange(
                                                    value.filter(
                                                        (v) => v !== option.id,
                                                    ),
                                                )
                                            }
                                            aria-label={`Remove ${option.fullName}`}
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// =====================================================================
// Cycle combobox (single, search by id/title)
// =====================================================================

function CycleCombobox({
    options,
    value,
    onChange,
    placeholder,
    disabled,
}: {
    options: Cycle[];
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    placeholder: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const selected = options.find((opt) => opt.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        'w-full justify-between text-left font-normal h-auto min-h-9 py-2',
                        inputClassName,
                        !selected && 'text-muted-foreground',
                    )}
                >
                    {selected ? (
                        <span className="font-medium text-foreground truncate">
                            <span className="border border-border rounded-full px-2 bg-secondary mr-1">
                                #{selected.id}
                            </span>
                            {selected.title}
                        </span>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0"
                align="start"
                style={{ width: 'var(--radix-popover-trigger-width)' }}
                onWheel={forwardWheelToCommandList}
                onTouchMove={(e) => e.stopPropagation()}
            >
                <Command
                    filter={(itemValue, search) =>
                        itemValue.toLowerCase().includes(search.toLowerCase())
                            ? 1
                            : 0
                    }
                >
                    <CommandInput placeholder="Search cycles..." />
                    <CommandList>
                        <CommandEmpty>No cycles found.</CommandEmpty>
                        <CommandItem
                            value="__none__ no cycle"
                            onSelect={() => {
                                onChange(undefined);
                                setOpen(false);
                            }}
                        >
                            <span className="text-muted-foreground">
                                No cycle
                            </span>
                            {value === undefined && (
                                <Check className="ml-auto h-4 w-4 shrink-0" />
                            )}
                        </CommandItem>
                        {options.map((cycle) => (
                            <CommandItem
                                key={cycle.id}
                                value={`${cycle.id} ${cycle.title} ${cycle.stage}`}
                                onSelect={() => {
                                    onChange(cycle.id);
                                    setOpen(false);
                                }}
                            >
                                <span className="font-medium text-foreground truncate">
                                    <span className="border border-border rounded-full px-2 bg-secondary mr-1">
                                        #{cycle.id}
                                    </span>
                                    {cycle.title}
                                </span>
                                {value === cycle.id && (
                                    <Check className="ml-auto h-4 w-4 shrink-0" />
                                )}
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

// =====================================================================
// Question multi combobox (search by competence title or question text)
// =====================================================================

function QuestionMultiCombobox({
    options,
    value,
    onChange,
    placeholder,
    disabled,
}: {
    options: QuestionOption[];
    value: number[];
    onChange: (value: number[]) => void;
    placeholder: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);

    const selectedOptions = useMemo(
        () =>
            value
                .map((id) => options.find((opt) => opt.id === id))
                .filter((opt): opt is QuestionOption => Boolean(opt)),
        [value, options],
    );

    const toggle = (id: number) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            'w-full justify-between text-left font-normal',
                            inputClassName,
                            value.length === 0 && 'text-muted-foreground',
                        )}
                    >
                        <span className="truncate">
                            {value.length === 0
                                ? placeholder
                                : `${value.length} question${value.length === 1 ? '' : 's'} selected`}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0"
                    align="start"
                    style={{ width: 'var(--radix-popover-trigger-width)' }}
                    onWheel={forwardWheelToCommandList}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    <Command
                        filter={(itemValue, search) =>
                            itemValue
                                .toLowerCase()
                                .includes(search.toLowerCase())
                                ? 1
                                : 0
                        }
                    >
                        <CommandInput placeholder="Search by competence or question text..." />
                        <CommandList className="max-h-[320px]">
                            <CommandEmpty>No questions found.</CommandEmpty>
                            {options.map((option) => {
                                const isSelected = value.includes(option.id);
                                return (
                                    <CommandItem
                                        key={option.id}
                                        value={questionSearchHaystack(option)}
                                        onSelect={() => toggle(option.id)}
                                        className="items-start"
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 mt-0.5 flex h-4 w-4 items-center justify-center rounded-sm border shrink-0',
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'border-muted-foreground/40',
                                            )}
                                        >
                                            {isSelected && (
                                                <Check className="h-3 w-3" />
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                                            <span className="font-medium text-foreground break-words whitespace-normal">
                                                {option.title}
                                            </span>
                                            <span className="flex flex-col gap-2 flex-1 min-w-0">
                                                <span className="flex flex-wrap gap-1.5 text-xs">
                                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-muted-foreground">
                                                        {option.competenceTitle}
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            'rounded-full px-2 py-0.5 text-muted-foreground',
                                                            option.answerType ===
                                                                AnswerType.NUMERICAL_SCALE
                                                                ? 'bg-cyan-100/60'
                                                                : 'bg-purple-100/80',
                                                        )}
                                                    >
                                                        {
                                                            answerTypeConfig[
                                                                option
                                                                    .answerType
                                                            ].label
                                                        }
                                                    </span>
                                                    <span
                                                        className={cn(
                                                            'rounded-full px-2 py-0.5 text-muted-foreground',
                                                            option.isForSelfassessment
                                                                ? 'bg-green-100/50'
                                                                : 'bg-red-100/50',
                                                        )}
                                                    >
                                                        {
                                                            forSelfAssessmentConfig[
                                                                option.isForSelfassessment
                                                                    ? ForSelfassessmentType.TRUE
                                                                    : ForSelfassessmentType.FALSE
                                                            ].label
                                                        }
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((option) => (
                        <div
                            key={option.id}
                            className="inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 max-w-full w-full text-sm"
                            title={option.competenceTitle}
                        >
                            <div className="flex flex-col gap-2 flex-1 min-w-0">
                                <span className="font-medium text-foreground break-words whitespace-normal">
                                    {option.title}
                                </span>
                                <span className="flex flex-wrap gap-1.5 text-xs">
                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-muted-foreground">
                                        {option.competenceTitle}
                                    </span>
                                    <span
                                        className={cn(
                                            'rounded-full px-2 py-0.5 text-muted-foreground',
                                            option.answerType ===
                                                AnswerType.NUMERICAL_SCALE
                                                ? 'bg-cyan-100/60'
                                                : 'bg-purple-100/80',
                                        )}
                                    >
                                        {
                                            answerTypeConfig[option.answerType]
                                                .label
                                        }
                                    </span>
                                    <span
                                        className={cn(
                                            'rounded-full px-2 py-0.5 text-muted-foreground',
                                            option.isForSelfassessment
                                                ? 'bg-green-100/50'
                                                : 'bg-red-100/50',
                                        )}
                                    >
                                        {
                                            forSelfAssessmentConfig[
                                                option.isForSelfassessment
                                                    ? ForSelfassessmentType.TRUE
                                                    : ForSelfassessmentType.FALSE
                                            ].label
                                        }
                                    </span>
                                </span>
                            </div>
                            {!disabled && (
                                <button
                                    type="button"
                                    className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                                    onClick={() =>
                                        onChange(
                                            value.filter(
                                                (v) => v !== option.id,
                                            ),
                                        )
                                    }
                                    aria-label={`Remove ${option.title}`}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// =====================================================================
// Main dialog
// =====================================================================

export function ReviewFormDialog({
    mode,
    review,
    open,
    onClose,
}: ReviewFormDialogProps) {
    const isCreate = mode === 'create';
    const isView = mode === 'view';
    const isEdit = mode === 'edit';

    const isOpen = isCreate ? !!open : review != null;

    const auth = useAuth();
    const createMutation = useCreateReviewFormMutation();
    const updateMutation = useUpdateReviewFormMutation();
    const mutation = isEdit ? updateMutation : createMutation;

    const [forceCompletingReview, setForceCompletingReview] =
        useState<Review | null>(null);
    const [deletingReview, setDeletingReview] = useState<Review | null>(null);

    const { data: users = [], isLoading: isUsersLoading } = useUsersQuery();
    const { data: cycles = [], isLoading: isCyclesLoading } = useCyclesQuery();
    const { data: questionTemplates = [], isLoading: isQuestionsLoading } =
        useQuestionTemplatesQuery();

    // Existing review-question relations for view/edit mode
    const { data: reviewSurveyQuestions = [] } = useQuery<SurveyQuestion[]>({
        queryKey: ['review-form-existing-questions', review?.id ?? 0],
        queryFn: async () => {
            const dtos = await fetchReviewQuestions(review!.id);
            return dtos.map(mapSurveyQuestionDtoToModel);
        },
        enabled: !!review?.id,
    });

    // Existing respondents / reviewers for view/edit mode
    const {
        data: existingRespondents = [],
        isLoading: isExistingRespondentsLoading,
    } = useReviewRespondentsQuery(review?.id ?? 0);
    const {
        data: existingReviewers = [],
        isLoading: isExistingReviewersLoading,
    } = useReviewReviewersQuery(review?.id ?? 0);

    // Position / team title lookups for users (for display in dropdowns)
    const positionIdsForUsers = useMemo(
        () =>
            Array.from(
                new Set(
                    users
                        .map((u) => u.positionId)
                        .filter((id): id is number => typeof id === 'number'),
                ),
            ),
        [users],
    );
    const teamIdsForUsers = useMemo(
        () =>
            Array.from(
                new Set(
                    users
                        .map((u) => u.teamId)
                        .filter((id): id is number => typeof id === 'number'),
                ),
            ),
        [users],
    );

    const { data: positionTitleEntries = [] } = useQuery({
        queryKey: ['review-form-position-titles', positionIdsForUsers],
        queryFn: () => fetchPositionTitlesByIds(positionIdsForUsers),
        enabled: positionIdsForUsers.length > 0,
    });
    const { data: teamTitleEntries = [] } = useQuery({
        queryKey: ['review-form-team-titles', teamIdsForUsers],
        queryFn: () => fetchTeamTitlesByIds(teamIdsForUsers),
        enabled: teamIdsForUsers.length > 0,
    });
    const positionTitlesMap = useMemo(() => {
        const map: Record<number, string> = {};
        positionTitleEntries.forEach((entry) => {
            map[entry.id] = entry.title;
        });
        return map;
    }, [positionTitleEntries]);
    const teamTitlesMap = useMemo(() => {
        const map: Record<number, string> = {};
        teamTitleEntries.forEach((entry) => {
            map[entry.id] = entry.title;
        });
        return map;
    }, [teamTitleEntries]);

    const userOptions: UserOption[] = useMemo(
        () =>
            users
                .filter((u) => u.positionId != null)
                .map<UserOption>((u) => ({
                    id: u.id,
                    fullName:
                        u.fullName ??
                        `${u.lastName ?? ''} ${u.firstName ?? ''}`.trim(),
                    email: u.email,
                    positionTitle: u.positionId
                        ? (positionTitlesMap[u.positionId] ?? '')
                        : '',
                    teamTitle: u.teamId ? (teamTitlesMap[u.teamId] ?? '') : '',
                    managerId: u.managerId ?? null,
                }))
                .sort((a, b) => a.fullName.localeCompare(b.fullName)),
        [users, positionTitlesMap, teamTitlesMap],
    );

    const eligibleCycles = useMemo(
        () =>
            cycles.filter(
                (cycle) =>
                    cycle.stage === CycleStage.NEW ||
                    cycle.stage === CycleStage.ACTIVE,
            ),
        [cycles],
    );

    // Combobox options: eligible cycles for selection PLUS the currently
    // attached cycle (even if it has progressed past NEW/ACTIVE) so view/edit
    // mode can display it correctly.
    const cycleComboboxOptions = useMemo(() => {
        if (!review?.cycleId) return eligibleCycles;
        if (eligibleCycles.some((c) => c.id === review.cycleId)) {
            return eligibleCycles;
        }
        const current = cycles.find((c) => c.id === review.cycleId);
        return current ? [current, ...eligibleCycles] : eligibleCycles;
    }, [eligibleCycles, cycles, review?.cycleId]);

    // Question competence title lookup
    const competenceIds = useMemo(
        () =>
            Array.from(
                new Set(
                    questionTemplates
                        .map((q) => q.competenceId)
                        .filter(Boolean),
                ),
            ),
        [questionTemplates],
    );
    const { data: competenceTitleEntries = [] } = useQuery({
        queryKey: ['review-form-competence-titles', competenceIds],
        queryFn: () => fetchCompetenceTitlesByIds(competenceIds),
        enabled: competenceIds.length > 0,
    });
    const competenceTitlesMap = useMemo(() => {
        const map: Record<number, string> = {};
        competenceTitleEntries.forEach((entry) => {
            map[entry.id] = entry.title;
        });
        return map;
    }, [competenceTitleEntries]);

    const form = useForm<ReviewFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(reviewFormSchema) as any,
        defaultValues: buildDefaults(review, auth.user.id),
        mode: 'onChange',
    });

    useEffect(() => {
        if (!isOpen) return;
        form.reset(buildDefaults(review, auth.user.id));
    }, [isOpen, review, form, auth.user.id]);

    // Seed respondentIds / reviewerIds from existing relations once per opened
    // review so view/edit shows the actual saved selection (not just the ratee).
    const initialRespondentsSeededFor = useRef<number | null>(null);
    useEffect(() => {
        if (!isOpen) {
            initialRespondentsSeededFor.current = null;
            return;
        }
        if (!review?.id) return;
        if (initialRespondentsSeededFor.current === review.id) return;
        if (isExistingRespondentsLoading || isExistingReviewersLoading) return;

        const respondentIds = existingRespondents.map((r) => r.respondentId);
        const reviewerIds = existingReviewers.map((r) => r.reviewerId);
        if (review.rateeId && !respondentIds.includes(review.rateeId)) {
            respondentIds.unshift(review.rateeId);
        }
        if (review.rateeId && !reviewerIds.includes(review.rateeId)) {
            reviewerIds.unshift(review.rateeId);
        }

        form.setValue('respondentIds', respondentIds, {
            shouldValidate: true,
        });
        form.setValue('reviewerIds', reviewerIds, { shouldValidate: true });
        initialRespondentsSeededFor.current = review.id;
    }, [
        isOpen,
        review?.id,
        review?.rateeId,
        existingRespondents,
        existingReviewers,
        isExistingRespondentsLoading,
        isExistingReviewersLoading,
        form,
    ]);

    const watchedRateeId = form.watch('rateeId');
    const watchedRespondentIds = form.watch('respondentIds') ?? [];
    const watchedReviewerIds = form.watch('reviewerIds') ?? [];
    const watchedQuestionIds = form.watch('questionTemplateIds') ?? [];
    const watchedCycleId = form.watch('cycleId');

    const { data: rateeUser } = useUserQuery(
        Number.isFinite(watchedRateeId) && watchedRateeId
            ? Number(watchedRateeId)
            : 0,
    );

    // Track previous ratee to detect changes
    const [prevRateeId, setPrevRateeId] = useState<number | undefined>(
        review?.rateeId,
    );
    const [prevManagerId, setPrevManagerId] = useState<number | null>(
        review?.managerId ?? null,
    );

    // Auto-add ratee + manager into respondents/reviewers when ratee changes
    useEffect(() => {
        if (!watchedRateeId) return;
        const newRateeId = Number(watchedRateeId);
        const newManagerId = rateeUser?.managerId ?? null;
        if (newRateeId === prevRateeId && newManagerId === prevManagerId) {
            return;
        }

        const isInitial = prevRateeId === undefined;

        const updateList = (current: number[]) => {
            // Remove previous ratee + manager (if not initial render)
            let next = current.filter((id) => {
                if (isInitial) return true;
                if (id === prevRateeId) return false;
                if (prevManagerId !== null && id === prevManagerId)
                    return false;
                return true;
            });
            // Add new ratee
            if (!next.includes(newRateeId)) {
                next = [newRateeId, ...next];
            } else {
                next = [newRateeId, ...next.filter((id) => id !== newRateeId)];
            }
            // Add manager (after ratee)
            if (newManagerId && !next.includes(newManagerId)) {
                const [first, ...rest] = next;
                next = [first, newManagerId, ...rest];
            }
            return next;
        };

        form.setValue(
            'respondentIds',
            updateList(form.getValues('respondentIds') ?? []),
            { shouldValidate: true },
        );
        form.setValue(
            'reviewerIds',
            updateList(form.getValues('reviewerIds') ?? []),
            { shouldValidate: true },
        );

        setPrevRateeId(newRateeId);
        setPrevManagerId(newManagerId);
    }, [
        watchedRateeId,
        rateeUser?.managerId,
        prevRateeId,
        prevManagerId,
        form,
    ]);

    // Question filtering by ratee position (active + general / position match)
    const filteredQuestionOptions: QuestionOption[] = useMemo(() => {
        const rateePositionId = rateeUser?.positionId ?? null;
        return questionTemplates
            .filter((q) => q.status === QuestionTemplateStatus.ACTIVE)
            .filter((q) => {
                if (!q.positionIds || q.positionIds.length === 0) return true;
                if (rateePositionId === null) return false;
                return q.positionIds.includes(rateePositionId);
            })
            .map<QuestionOption>((q) => ({
                id: q.id,
                title: q.title,
                competenceTitle: competenceTitlesMap[q.competenceId] ?? '',
                answerType: q.answerType,
                isForSelfassessment: q.isForSelfassessment,
                positionIds: q.positionIds ?? [],
            }))
            .sort((a, b) => a.title.localeCompare(b.title));
    }, [questionTemplates, rateeUser?.positionId, competenceTitlesMap]);

    // Need enriched user data (with title fields) for selected respondents/reviewers
    const selectedUserIds = useMemo(() => {
        const ids = new Set<number>();
        watchedRespondentIds.forEach((id) => ids.add(id));
        watchedReviewerIds.forEach((id) => ids.add(id));
        if (watchedRateeId) ids.add(Number(watchedRateeId));
        return Array.from(ids);
    }, [watchedRespondentIds, watchedReviewerIds, watchedRateeId]);
    const { data: enrichedUsers = [] } =
        useUsersByUserIdsQuery(selectedUserIds);
    const enrichedUsersMap = useMemo(() => {
        const map: Record<number, User> = {};
        enrichedUsers.forEach((u) => {
            map[u.id] = u;
        });
        return map;
    }, [enrichedUsers]);

    const lockedIds = useMemo(() => {
        const list: number[] = [];
        if (watchedRateeId) list.push(Number(watchedRateeId));
        return list;
    }, [watchedRateeId]);

    const selectedCycle = useMemo(
        () =>
            watchedCycleId
                ? cycles.find((c) => c.id === Number(watchedCycleId))
                : undefined,
        [cycles, watchedCycleId],
    );

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            onClose();
        }
    };

    const handleClose = () => {
        form.reset(buildDefaults(null, auth.user.id));
        setPrevRateeId(undefined);
        setPrevManagerId(null);
        onClose();
    };

    const onSubmit = (values: ReviewFormValues) => {
        if (isEdit && review) {
            updateMutation.mutate(
                { id: review.id, values, rateeUser },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                },
            );
            return;
        }
        if (isCreate) {
            if (!rateeUser) {
                toast.error('Please select a ratee.');
                return;
            }
            const respondentUsers = values.respondentIds
                .map((id) => enrichedUsersMap[id])
                .filter((u): u is User => Boolean(u));
            const reviewerUsers = values.reviewerIds
                .map((id) => enrichedUsersMap[id])
                .filter((u): u is User => Boolean(u));

            if (respondentUsers.length !== values.respondentIds.length) {
                toast.error(
                    'Loading respondent details... please wait a moment and try again.',
                );
                return;
            }
            if (reviewerUsers.length !== values.reviewerIds.length) {
                toast.error(
                    'Loading reviewer details... please wait a moment and try again.',
                );
                return;
            }

            createMutation.mutate(
                {
                    values,
                    rateeUser,
                    currentUser: auth.user,
                    respondentUsers,
                    reviewerUsers,
                    questionTemplateIds: values.questionTemplateIds ?? [],
                },
                {
                    onSuccess: () => {
                        handleClose();
                    },
                },
            );
        }
    };

    const onInvalid = (errors: FieldErrors<ReviewFormValues>) => {
        const firstField = Object.keys(errors)[0];
        const firstMessage =
            firstField &&
            (errors as Record<string, { message?: string } | undefined>)[
                firstField
            ]?.message;
        toast.error(
            firstMessage
                ? `Please fix: ${firstMessage}`
                : 'Please fill in all required fields correctly.',
        );
    };

    const titleText =
        mode === 'create'
            ? 'Create New Review'
            : mode === 'edit'
              ? 'Edit Review'
              : 'Review Details';

    const TitleIcon = isCreate ? Plus : isEdit ? Pencil : Eye;

    const submitLabel = isCreate
        ? mutation.isPending
            ? 'Creating...'
            : 'Create Review'
        : mutation.isPending
          ? 'Saving...'
          : 'Save Changes';

    // After a review leaves the NEW stage all fields except the stage selector
    // become read-only — only stage transitions remain editable.
    const isStageOnlyEdit =
        isEdit && !!review && review.stage !== ReviewStage.NEW;
    const fieldsDisabled = isView;
    const nonStageDisabled = fieldsDisabled || isStageOnlyEdit;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogContent
                    showCloseButton={false}
                    className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl p-0 gap-0"
                >
                    <DialogTitle className="sr-only">{titleText}</DialogTitle>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                        className="flex flex-col"
                    >
                        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background rounded-t-xl px-6 py-4 flex-wrap gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                                    <TitleIcon className="h-5 w-5" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-lg font-semibold tracking-tight text-foreground truncate">
                                        {titleText}
                                    </p>
                                    {review && (
                                        <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                            <span>#{review.id}</span>
                                            <span>·</span>
                                            <StageBadge stage={review.stage} />
                                        </p>
                                    )}
                                </div>
                            </div>
                            {!isView && (
                                <Button
                                    type="submit"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                                    disabled={mutation.isPending}
                                >
                                    <Save className="mr-2 h-4 w-4" />
                                    {submitLabel}
                                </Button>
                            )}
                        </header>

                        <div className="flex flex-col gap-6 p-6">
                            {/* General */}
                            <Card className="border-border bg-card">
                                <CardHeader>
                                    <CardTitle className="text-base text-foreground">
                                        General
                                    </CardTitle>
                                    <CardDescription>
                                        Who is being reviewed, the stage and HR
                                        comments.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="rateeId">
                                            Ratee{' '}
                                            {!isView && (
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            )}
                                        </Label>
                                        <UserSingleCombobox
                                            options={userOptions}
                                            value={
                                                watchedRateeId
                                                    ? Number(watchedRateeId)
                                                    : undefined
                                            }
                                            onChange={(id) =>
                                                form.setValue(
                                                    'rateeId',
                                                    id ??
                                                        (undefined as unknown as number),
                                                    { shouldValidate: true },
                                                )
                                            }
                                            placeholder={
                                                isUsersLoading
                                                    ? 'Loading users...'
                                                    : 'Select a ratee'
                                            }
                                            disabled={
                                                nonStageDisabled ||
                                                isUsersLoading
                                            }
                                        />
                                        {form.formState.errors.rateeId && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    form.formState.errors
                                                        .rateeId.message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    {(rateeUser || review) && (
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-xl border border-border bg-secondary/30 p-3 text-sm">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs text-muted-foreground">
                                                    Position
                                                </span>
                                                <span className="font-medium text-foreground break-words">
                                                    {rateeUser?.positionTitle ??
                                                        review?.rateePositionTitle ??
                                                        '—'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs text-muted-foreground">
                                                    Team
                                                </span>
                                                <span className="font-medium text-foreground break-words">
                                                    {rateeUser?.teamTitle ??
                                                        review?.teamTitle ??
                                                        '—'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs text-muted-foreground">
                                                    Manager
                                                </span>
                                                <span className="font-medium text-foreground break-words">
                                                    {rateeUser?.managerName ??
                                                        review?.managerFullName ??
                                                        '—'}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="stage">
                                            Stage{' '}
                                            {!isView && (
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            )}
                                        </Label>
                                        <Select
                                            value={form.watch('stage') ?? ''}
                                            onValueChange={(value) =>
                                                form.setValue(
                                                    'stage',
                                                    value as ReviewStage,
                                                    { shouldValidate: true },
                                                )
                                            }
                                            disabled={fieldsDisabled}
                                        >
                                            <SelectTrigger
                                                id="stage"
                                                className={cn(
                                                    'w-full',
                                                    inputClassName,
                                                )}
                                            >
                                                <SelectValue placeholder="Select stage" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {REVIEW_STAGE_ENUM_VALUES.map(
                                                    (stageOption) => (
                                                        <SelectItem
                                                            key={stageOption}
                                                            value={stageOption}
                                                            disabled={isStageDisabledFor(
                                                                stageOption as ReviewStage,
                                                                mode,
                                                            )}
                                                        >
                                                            <StageBadge
                                                                stage={
                                                                    stageOption as ReviewStage
                                                                }
                                                            />
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {form.formState.errors.stage && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    form.formState.errors.stage
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="hrNote">HR Note</Label>
                                        <Textarea
                                            id="hrNote"
                                            placeholder="Optional internal note from HR..."
                                            rows={3}
                                            disabled={nonStageDisabled}
                                            className={cn(
                                                'resize-none',
                                                inputClassName,
                                            )}
                                            {...form.register('hrNote')}
                                        />
                                        {form.formState.errors.hrNote && (
                                            <p className="text-sm text-destructive">
                                                {
                                                    form.formState.errors.hrNote
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Cycle */}
                            <Card className="border-border bg-card">
                                <CardHeader>
                                    <CardTitle className="text-base text-foreground">
                                        Cycle
                                    </CardTitle>
                                    <CardDescription>
                                        Optionally attach this review to an
                                        active or upcoming cycle.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="cycleId">Cycle</Label>
                                        <CycleCombobox
                                            options={cycleComboboxOptions}
                                            value={
                                                watchedCycleId
                                                    ? Number(watchedCycleId)
                                                    : undefined
                                            }
                                            onChange={(id) =>
                                                form.setValue('cycleId', id, {
                                                    shouldValidate: true,
                                                })
                                            }
                                            placeholder={
                                                isCyclesLoading
                                                    ? 'Loading cycles...'
                                                    : 'No cycle'
                                            }
                                            disabled={
                                                nonStageDisabled ||
                                                isCyclesLoading
                                            }
                                        />
                                    </div>

                                    {selectedCycle && (
                                        <div className="flex flex-row flex-wrap justify-between items-stretch gap-3 rounded-xl border border-border bg-secondary/30 p-3 text-sm w-full">
                                            <div className="flex flex-col flex-wrap gap-3 flex-1">
                                                <CycleDateInfo
                                                    label="Start date"
                                                    date={
                                                        selectedCycle.startDate
                                                    }
                                                />
                                                <CycleDateInfo
                                                    label="End date"
                                                    date={selectedCycle.endDate}
                                                />
                                            </div>
                                            <div className="flex flex-col flex-wrap gap-3 flex-1">
                                                <CycleDateInfo
                                                    label="Response deadline"
                                                    date={
                                                        selectedCycle.responseDeadline
                                                    }
                                                />
                                                <CycleDateInfo
                                                    label="Review deadline"
                                                    date={
                                                        selectedCycle.reviewDeadline
                                                    }
                                                />
                                                <CycleDateInfo
                                                    label="Approval deadline"
                                                    date={
                                                        selectedCycle.approvalDeadline
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Respondents */}
                            <Card className="border-border bg-card">
                                <CardHeader>
                                    <CardTitle className="text-base text-foreground">
                                        Respondents{' '}
                                        {!isView && (
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        People who will respond to this review.
                                        Ratee is locked. The ratee&apos;s
                                        manager is pre-selected but can be
                                        removed.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <UserMultiCombobox
                                        options={userOptions}
                                        value={watchedRespondentIds}
                                        onChange={(ids) =>
                                            form.setValue(
                                                'respondentIds',
                                                ids,
                                                {
                                                    shouldValidate: true,
                                                },
                                            )
                                        }
                                        placeholder={
                                            isUsersLoading
                                                ? 'Loading users...'
                                                : 'Select respondents'
                                        }
                                        disabled={
                                            nonStageDisabled || isUsersLoading
                                        }
                                        lockedIds={lockedIds}
                                    />
                                    {form.formState.errors.respondentIds && (
                                        <p className="mt-2 text-sm text-destructive">
                                            {
                                                form.formState.errors
                                                    .respondentIds.message
                                            }
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Reviewers */}
                            <Card className="border-border bg-card">
                                <CardHeader>
                                    <CardTitle className="text-base text-foreground">
                                        Reviewers{' '}
                                        {!isView && (
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        People who will read responses for this
                                        review. Ratee is locked. The
                                        ratee&apos;s manager is pre-selected but
                                        can be removed.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <UserMultiCombobox
                                        options={userOptions}
                                        value={watchedReviewerIds}
                                        onChange={(ids) =>
                                            form.setValue('reviewerIds', ids, {
                                                shouldValidate: true,
                                            })
                                        }
                                        placeholder={
                                            isUsersLoading
                                                ? 'Loading users...'
                                                : 'Select reviewers'
                                        }
                                        disabled={
                                            nonStageDisabled || isUsersLoading
                                        }
                                        lockedIds={lockedIds}
                                    />
                                    {form.formState.errors.reviewerIds && (
                                        <p className="mt-2 text-sm text-destructive">
                                            {
                                                form.formState.errors
                                                    .reviewerIds.message
                                            }
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Survey questions */}
                            <Card className="border-border bg-card">
                                <CardHeader>
                                    <CardTitle className="text-base text-foreground">
                                        Survey Questions{' '}
                                        {!isView && (
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Pick questions from the active library.
                                        Only questions matching the ratee&apos;s
                                        position or general (no position) are
                                        listed.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {isCreate && (
                                        <QuestionMultiCombobox
                                            options={filteredQuestionOptions}
                                            value={watchedQuestionIds}
                                            onChange={(ids) =>
                                                form.setValue(
                                                    'questionTemplateIds',
                                                    ids,
                                                    {
                                                        shouldValidate: true,
                                                    },
                                                )
                                            }
                                            placeholder={
                                                isQuestionsLoading
                                                    ? 'Loading questions...'
                                                    : !rateeUser
                                                      ? 'Pick a ratee first'
                                                      : 'Search & select questions'
                                            }
                                            disabled={
                                                fieldsDisabled ||
                                                isQuestionsLoading ||
                                                !rateeUser
                                            }
                                        />
                                    )}
                                    {!isCreate && review && (
                                        <>
                                            {reviewSurveyQuestions.length ===
                                            0 ? (
                                                <p className="text-sm text-muted-foreground">
                                                    No questions assigned to
                                                    this review yet.
                                                </p>
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    {reviewSurveyQuestions.map(
                                                        (q) => (
                                                            <div
                                                                key={q.id}
                                                                className="flex flex-col gap-1.5 rounded-xl border border-border bg-secondary/30 p-3"
                                                            >
                                                                <span className="font-medium text-foreground break-words whitespace-normal">
                                                                    {
                                                                        q.questionTitle
                                                                    }
                                                                </span>
                                                                <div className="flex flex-col gap-2 flex-1 min-w-0">
                                                                    <span className="flex flex-wrap gap-1.5 text-xs">
                                                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-muted-foreground">
                                                                            {
                                                                                q.competenceTitle
                                                                            }
                                                                        </span>
                                                                        <span
                                                                            className={cn(
                                                                                'rounded-full px-2 py-0.5 text-muted-foreground',
                                                                                q.answerType ===
                                                                                    AnswerType.NUMERICAL_SCALE
                                                                                    ? 'bg-cyan-100/60'
                                                                                    : 'bg-purple-100/80',
                                                                            )}
                                                                        >
                                                                            {
                                                                                answerTypeConfig[
                                                                                    q
                                                                                        .answerType
                                                                                ]
                                                                                    .label
                                                                            }
                                                                        </span>
                                                                        <span
                                                                            className={cn(
                                                                                'rounded-full px-2 py-0.5 text-muted-foreground',
                                                                                q.isForSelfassessment
                                                                                    ? 'bg-green-100/50'
                                                                                    : 'bg-red-100/50',
                                                                            )}
                                                                        >
                                                                            {
                                                                                forSelfAssessmentConfig[
                                                                                    q.isForSelfassessment
                                                                                        ? ForSelfassessmentType.TRUE
                                                                                        : ForSelfassessmentType.FALSE
                                                                                ]
                                                                                    .label
                                                                            }
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {review && (
                                <Card className="border-border bg-card">
                                    <CardHeader>
                                        <CardTitle className="text-base text-foreground">
                                            HR
                                        </CardTitle>
                                        <CardDescription>
                                            HR responsible for this review.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="rounded-xl border border-border bg-secondary/30 p-3 text-sm">
                                            <span className="text-xs text-muted-foreground">
                                                HR Owner
                                            </span>
                                            <p className="font-medium text-foreground break-words">
                                                {review.hrFullName ?? '—'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <div className="flex flex-wrap justify-end gap-3 pt-2">
                                {isEdit && review && (
                                    <>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="border-destructive/40 bg-red-50 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
                                            disabled={mutation.isPending}
                                            onClick={() =>
                                                setDeletingReview(review)
                                            }
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                        {(review.stage ===
                                            ReviewStage.SELF_ASSESSMENT ||
                                            review.stage ===
                                                ReviewStage.WAITING_TO_START ||
                                            review.stage ===
                                                ReviewStage.IN_PROGRESS) && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 hover:text-amber-900 rounded-xl"
                                                disabled={mutation.isPending}
                                                onClick={() =>
                                                    setForceCompletingReview(
                                                        review,
                                                    )
                                                }
                                            >
                                                <StopCircle className="mr-2 h-4 w-4" />
                                                Force Complete
                                            </Button>
                                        )}
                                    </>
                                )}
                                {isCreate && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-border text-foreground hover:bg-secondary rounded-xl"
                                        disabled={mutation.isPending}
                                        onClick={() => {
                                            form.reset(
                                                buildDefaults(
                                                    null,
                                                    auth.user.id,
                                                ),
                                            );
                                            setPrevRateeId(undefined);
                                            setPrevManagerId(null);
                                        }}
                                    >
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Clear
                                    </Button>
                                )}
                                {isEdit && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-border text-foreground hover:bg-secondary rounded-xl"
                                        disabled={mutation.isPending}
                                        onClick={() =>
                                            form.reset(
                                                buildDefaults(
                                                    review,
                                                    auth.user.id,
                                                ),
                                            )
                                        }
                                    >
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Reset
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-secondary rounded-xl"
                                    onClick={handleClose}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    {isView ? 'Close' : 'Cancel'}
                                </Button>
                                {!isView && (
                                    <Button
                                        type="submit"
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                                        disabled={mutation.isPending}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {submitLabel}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <ForceCompleteReviewDialog
                review={forceCompletingReview}
                onClose={() => setForceCompletingReview(null)}
                onSuccess={handleClose}
            />
            <DeleteReviewDialog
                review={deletingReview}
                onClose={() => setDeletingReview(null)}
                onSuccess={handleClose}
            />
        </>
    );
}

function CycleDateInfo({ label, date }: { label: string; date?: Date | null }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="font-medium text-foreground flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                {date ? format(date, 'MMM dd, yyyy') : '—'}
            </span>
        </div>
    );
}
