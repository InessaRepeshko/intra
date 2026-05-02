'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, CheckCircle, Megaphone, PanelLeft, RotateCcw, Send, Trash, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';
import {
    AnswerType,
    RespondentCategory,
} from '@entities/feedback360/answer/model/types';
import { StageBadge } from '@entities/feedback360/review/ui/stage-badge';
import { CategoryBadge } from '@entities/feedback360/respondent/ui/category-badge';
import {
    useSurveyQuestionsQuery,
    useSurveyReviewQuery,
} from '@entities/feedback360/survey/api/review-question-relation.queries';
import type { SurveyQuestion } from '@entities/feedback360/survey/model/mappers';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Label } from '@shared/components/ui/label';
import {
    RadioGroup,
    RadioGroupItem,
} from '@shared/components/ui/radio-group';
import { Skeleton } from '@shared/components/ui/skeleton';
import { Textarea } from '@shared/components/ui/textarea';
import { cn } from '@shared/lib/utils/cn';
import { toast } from 'sonner';

import { useSubmitSurveyMutation } from '../api/submit-survey-form';
import {
    submitSurveySchema,
    type SubmitSurveyFormValues,
} from '../model/submit-survey-schema';
import { useUserQuery } from '@entities/identity/user/api/user.queries';
import { useSidebar } from '@shared/ui/app-sidebar';
import { Progress } from '@shared/components/ui/progress';
import { formatNumber } from '@shared/lib/utils/format-number';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';

interface SubmitSurveyFormProps {
    reviewId: number;
    respondentCategory: RespondentCategory;
}

interface CompetenceGroup {
    id: number;
    title: string;
    description: string | null;
    code: string | null;
    questions: SurveyQuestion[];
}

const SURVEY_DRAFT_STORAGE_PREFIX = 'intra.feedback360.surveyDraft';

function surveyDraftStorageKey(
    answersShapeKey: string,
    category: RespondentCategory,
): string {
    return `${SURVEY_DRAFT_STORAGE_PREFIX}:${category}:${answersShapeKey}`;
}

function buildEmptyAnswersFromSurveyQuestions(
    ordered: SurveyQuestion[],
): SubmitSurveyFormValues['answers'] {
    return ordered.map((question) =>
        question.answerType === AnswerType.NUMERICAL_SCALE
            ? {
                questionId: question.questionId,
                answerType: AnswerType.NUMERICAL_SCALE,
                numericalValue: undefined as unknown as number,
            }
            : {
                questionId: question.questionId,
                answerType: AnswerType.TEXT_FIELD,
                textValue: '',
            },
    );
}

function mergeDraftIntoAnswers(
    next: SubmitSurveyFormValues['answers'],
    draftRaw: string | null,
): SubmitSurveyFormValues['answers'] {
    if (!draftRaw) return next;
    try {
        const parsed: unknown = JSON.parse(draftRaw);
        if (!Array.isArray(parsed)) return next;

        const byId = new Map<
            number,
            SubmitSurveyFormValues['answers'][number]
        >();
        for (const row of parsed) {
            if (
                row &&
                typeof row === 'object' &&
                'questionId' in row &&
                'answerType' in row
            ) {
                const r = row as SubmitSurveyFormValues['answers'][number];
                byId.set(Number(r.questionId), r);
            }
        }

        return next.map((item) => {
            const d = byId.get(item.questionId);
            if (!d || d.answerType !== item.answerType) return item;

            if (
                item.answerType === AnswerType.NUMERICAL_SCALE &&
                typeof d.numericalValue === 'number'
            ) {
                return { ...item, numericalValue: d.numericalValue };
            }
            if (
                item.answerType === AnswerType.TEXT_FIELD &&
                typeof d.textValue === 'string'
            ) {
                return { ...item, textValue: d.textValue };
            }
            return item;
        });
    } catch {
        return next;
    }
}

const likertScale: Array<{
    value: number;
    label: string;
    description: string;
}> = [
        { value: 0, label: 'N/A', description: 'No info' },
        { value: 1, label: '1', description: 'Never' },
        { value: 2, label: '2', description: 'Rarely' },
        { value: 3, label: '3', description: 'Often' },
        { value: 4, label: '4', description: 'Usually' },
        { value: 5, label: '5', description: 'Always' },
    ];

function groupByCompetence(questions: SurveyQuestion[]): CompetenceGroup[] {
    const map = new Map<number, CompetenceGroup>();

    for (const question of questions) {
        const existing = map.get(question.competenceId);
        if (existing) {
            existing.questions.push(question);
            continue;
        }

        map.set(question.competenceId, {
            id: question.competenceId,
            title: question.competenceTitle,
            description: question.competenceDescription ?? null,
            code: question.competenceCode ?? null,
            questions: [question],
        });
    }

    return Array.from(map.values());
}

function SurveyHeaderSkeleton() {
    return (
        <div className="sticky top-0 z-10 shrink-0 border-b border-border bg-background/95 px-8 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-9" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
        </div>
    );
}

function SurveyContentSkeleton() {
    return (
        <div className="mx-auto max-w-4xl space-y-6 p-8">
            {Array.from({ length: 3 }).map((_, idx) => (
                <Card key={idx} className="border-border bg-card">
                    <CardHeader>
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="mt-2 h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {Array.from({ length: 2 }).map((_, qIdx) => (
                            <div key={qIdx} className="space-y-3">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function SubmitSurveyForm({
    reviewId,
    respondentCategory,
}: SubmitSurveyFormProps) {
    const router = useRouter();
    const { toggle } = useSidebar();
    const isSelfAssessment =
        respondentCategory === RespondentCategory.SELF_ASSESSMENT;

    const reviewQuery = useSurveyReviewQuery(reviewId);
    const questionsQuery = useSurveyQuestionsQuery(reviewId);
    const submitMutation = useSubmitSurveyMutation();
    const rateeQuery = useUserQuery(reviewQuery.data?.rateeId!);

    /** Stable key for the set of questions - without duplicate reset when the same list of ids (new array with React Query). */
    const answersShapeKey = useMemo(() => {
        const all = questionsQuery.data ?? [];
        const visible = isSelfAssessment
            ? all.filter((q) => q.isForSelfassessment)
            : all;
        const numerical = visible.filter(
            (q) => q.answerType === AnswerType.NUMERICAL_SCALE,
        );
        const text = visible.filter(
            (q) => q.answerType === AnswerType.TEXT_FIELD,
        );
        const ids = [...numerical, ...text].map((q) => q.questionId).join(',');
        return `${reviewId}:${ids}`;
    }, [reviewId, questionsQuery.data, isSelfAssessment]);

    const visibleQuestions = useMemo<SurveyQuestion[]>(() => {
        const all = questionsQuery.data ?? [];
        if (isSelfAssessment) {
            return all.filter((q) => q.isForSelfassessment);
        }
        return all;
    }, [questionsQuery.data, isSelfAssessment]);

    const numericalQuestions = useMemo(
        () =>
            visibleQuestions.filter(
                (q) => q.answerType === AnswerType.NUMERICAL_SCALE,
            ),
        [visibleQuestions],
    );

    const textQuestions = useMemo(
        () =>
            visibleQuestions.filter(
                (q) => q.answerType === AnswerType.TEXT_FIELD,
            ),
        [visibleQuestions],
    );

    const orderedQuestions = useMemo(
        () => [...numericalQuestions, ...textQuestions],
        [numericalQuestions, textQuestions],
    );

    const indexByQuestionId = useMemo(() => {
        const map = new Map<number, number>();
        orderedQuestions.forEach((q, index) => {
            map.set(q.questionId, index);
        });
        return map;
    }, [orderedQuestions]);

    const competenceGroups = useMemo(
        () => groupByCompetence(numericalQuestions),
        [numericalQuestions],
    );

    const form = useForm<SubmitSurveyFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(submitSurveySchema) as any,
        defaultValues: {
            answers: [],
        },
        mode: 'onChange',
    });

    const { reset, control, clearErrors } = form;
    const lastShapeKeyRef = useRef<string | null>(null);
    const draftSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    useEffect(() => {
        if (answersShapeKey === lastShapeKeyRef.current) {
            return;
        }
        lastShapeKeyRef.current = answersShapeKey;

        const colonIdx = answersShapeKey.indexOf(':');
        const idsOnly =
            colonIdx >= 0 ? answersShapeKey.slice(colonIdx + 1) : '';

        if (!idsOnly) {
            reset({ answers: [] });
            return;
        }

        const all = questionsQuery.data ?? [];
        const visible = isSelfAssessment
            ? all.filter((q) => q.isForSelfassessment)
            : all;
        const numerical = visible.filter(
            (q) => q.answerType === AnswerType.NUMERICAL_SCALE,
        );
        const text = visible.filter(
            (q) => q.answerType === AnswerType.TEXT_FIELD,
        );
        const ordered = [...numerical, ...text];

        const next = buildEmptyAnswersFromSurveyQuestions(ordered);

        const draftKey = surveyDraftStorageKey(
            answersShapeKey,
            respondentCategory,
        );
        const merged =
            typeof window === 'undefined'
                ? next
                : mergeDraftIntoAnswers(
                    next,
                    localStorage.getItem(draftKey),
                );

        reset({ answers: merged });
    }, [
        answersShapeKey,
        isSelfAssessment,
        questionsQuery.data,
        reset,
        reviewId,
        respondentCategory,
    ]);

    const watchedAnswers =
        useWatch({ control, name: 'answers', defaultValue: [] }) ?? [];

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const colonIdx = answersShapeKey.indexOf(':');
        const idsOnly =
            colonIdx >= 0 ? answersShapeKey.slice(colonIdx + 1) : '';
        if (!idsOnly) return;

        if (
            watchedAnswers.length === 0 ||
            watchedAnswers.length !== orderedQuestions.length
        ) {
            return;
        }

        const draftKey = surveyDraftStorageKey(
            answersShapeKey,
            respondentCategory,
        );

        if (draftSaveTimerRef.current) {
            clearTimeout(draftSaveTimerRef.current);
        }
        draftSaveTimerRef.current = setTimeout(() => {
            try {
                localStorage.setItem(
                    draftKey,
                    JSON.stringify(watchedAnswers),
                );
            } catch {
                /* ignore quota / private mode */
            }
        }, 400);

        return () => {
            if (draftSaveTimerRef.current) {
                clearTimeout(draftSaveTimerRef.current);
            }
        };
    }, [
        watchedAnswers,
        answersShapeKey,
        respondentCategory,
        orderedQuestions.length,
    ]);

    const completedCount = useMemo(() => {
        return watchedAnswers.reduce((acc, answer) => {
            if (!answer) return acc;
            if (
                answer.answerType === AnswerType.NUMERICAL_SCALE &&
                typeof answer.numericalValue === 'number'
            ) {
                return acc + 1;
            }
            if (
                answer.answerType === AnswerType.TEXT_FIELD &&
                typeof answer.textValue === 'string' &&
                answer.textValue.trim().length > 0
            ) {
                return acc + 1;
            }
            return acc;
        }, 0);
    }, [watchedAnswers]);

    const totalQuestions = orderedQuestions.length;
    const progress =
        totalQuestions > 0
            ? Math.round((completedCount / totalQuestions) * 100)
            : 0;
    const isComplete =
        totalQuestions > 0 && completedCount === totalQuestions;

    const onSubmit = (values: SubmitSurveyFormValues) => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.removeItem(
                    surveyDraftStorageKey(
                        answersShapeKey,
                        respondentCategory,
                    ),
                );
            } catch {
                /* ignore */
            }
        }

        submitMutation.mutate(
            { reviewId, respondentCategory, values },
            {
                onSuccess: () => {
                    router.push('/feedback360/surveys');
                },
            },
        );
    };

    const handleClearForm = useCallback(() => {
        if (orderedQuestions.length === 0) {
            return;
        }
        reset({
            answers: buildEmptyAnswersFromSurveyQuestions(orderedQuestions),
        });
        clearErrors();
        if (typeof window !== 'undefined') {
            try {
                localStorage.removeItem(
                    surveyDraftStorageKey(
                        answersShapeKey,
                        respondentCategory,
                    ),
                );
            } catch {
                /* ignore */
            }
        }
        toast.success('All answers cleared');
    }, [
        orderedQuestions,
        reset,
        clearErrors,
        answersShapeKey,
        respondentCategory,
    ]);

    if (reviewQuery.isLoading || questionsQuery.isLoading) {
        return (
            <div className="flex min-h-full flex-col bg-background">
                <SurveyHeaderSkeleton />
                <SurveyContentSkeleton />
            </div>
        );
    }

    if (reviewQuery.isError || !reviewQuery.data) {
        return (
            <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-background p-8 text-center">
                <h1 className="text-2xl font-semibold text-foreground">
                    Survey not found
                </h1>
                <p className="text-muted-foreground">
                    We could not load this review. It may have been deleted or
                    you do not have access.
                </p>
                <Button asChild>
                    <Link href="/feedback360/surveys">Back to surveys</Link>
                </Button>
            </div>
        );
    }

    const review = reviewQuery.data;

    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md min-w-[400px] w-full">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex min-h-full flex-col bg-background rounded-xl"
            >
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background rounded-t-xl px-4 py-4 flex-wrap">
                    <div className="flex items-center gap-4 min-w-[100px]">
                        <button
                            onClick={toggle}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-accent-foreground transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            <PanelLeft className="h-6 w-6" />
                        </button>
                        <div className="h-6 w-px bg-border" />
                        <div className="text-xl font-semibold tracking-tight text-foreground gap-2 flex items-center whitespace-wrap">
                            <span className="hidden md:flex">
                                {`360° Feedback`}
                            </span>
                            <span>
                                {`Review #${review.id}`}
                            </span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center gap-4 flex-1">
                        <div>
                            {rateeQuery.data && (
                                <Avatar className="h-12 w-12 border bg-muted">
                                    <AvatarImage
                                        className="object-cover"
                                        src={rateeQuery.data.avatarUrl?.toString()}
                                        alt={rateeQuery.data.fullName}
                                    />
                                    <AvatarFallback className="text-xl font-medium text-muted-foreground bg-neutral-100">
                                        {getUserInitialsFromFullName(rateeQuery.data.fullName ?? `${rateeQuery.data.lastName} ${rateeQuery.data.firstName}`)}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                        <div>
                            <p className="text-base text-foreground font-semibold gap-1 flex whitespace-nowrap">
                                {review.rateeFullName}
                            </p>
                            <p className="text-sm text-muted-foreground gap-1 flex">
                                {review.rateePositionTitle && (
                                    <>
                                        {review.rateePositionTitle}
                                    </>
                                )}
                                {review.teamTitle && (
                                    <>
                                        <span className="mx-1">·</span>
                                        {review.teamTitle}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className={`flex items-center justify-end gap-3 overflow-hidden grow-0 m-auto ${totalQuestions === 0 ? 'invisible' : ''}`}>
                        <div className="hidden md:flex items-center justify-end gap-2">
                            <Progress
                                value={progress}
                                id={review.id.toString()}
                                indicatorClassName="bg-primary"
                                className="h-2 w-[100px]"
                                aria-label={`Progress ${progress}%`}
                            />
                            <span className="text-sm text-muted-foreground flex whitespace-nowrap flex justify-center w-[100px] gap-1">
                                <span>{completedCount}/{totalQuestions}</span>
                                <span>·</span>
                                <span>{progress}%</span>
                            </span>
                        </div>
                        <Button
                            type="submit"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                            disabled={!isComplete || submitMutation.isPending}
                        >
                            <Send className="mr-2 h-4 w-4" />
                            {submitMutation.isPending
                                ? 'Submitting...'
                                : 'Submit'}
                        </Button>
                    </div>
                </header>

                <div className="mx-auto min-w-[350px] w-full max-w-4xl p-8">
                    {totalQuestions === 0 ? (
                        <div className="border-border bg-card py-12 text-center">
                            <h3 className="text-lg font-semibold text-foreground">
                                No questions to answer
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                This review does not have any questions
                                {isSelfAssessment ? ' for self-assessment' : ''}{' '}
                                yet or you have already answered all the questions.
                            </p>
                        </div>
                    ) : (
                        <>
                            {competenceGroups.map((group, compIndex) => (
                                <Card
                                    key={group.id}
                                    className="mb-6 border-border bg-card min-w-[350px] w-full overflow-hidden"
                                >
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                                                {compIndex + 1}
                                            </span>
                                            <div>
                                                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                                    {group.title}
                                                </CardTitle>
                                                {group.description && (
                                                    <CardDescription>
                                                        {group.description}
                                                    </CardDescription>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {group.questions.map((question) => {
                                            const formIndex =
                                                indexByQuestionId.get(
                                                    question.questionId,
                                                );
                                            if (formIndex === undefined)
                                                return null;
                                            const numericalIndex =
                                                numericalQuestions.findIndex(
                                                    (q) =>
                                                        q.questionId ===
                                                        question.questionId,
                                                ) + 1;
                                            const fieldError =
                                                form.formState.errors.answers?.[
                                                formIndex
                                                ];
                                            return (
                                                <div
                                                    key={question.id}
                                                    className="space-y-3"
                                                >
                                                    <Label className="text-foreground">
                                                        <span className="mr-2 text-muted-foreground">
                                                            {numericalIndex}.
                                                        </span>
                                                        {question.questionTitle}
                                                    </Label>
                                                    <Controller
                                                        control={form.control}
                                                        name={`answers.${formIndex}.numericalValue`}
                                                        render={({ field }) => {
                                                            const currentValue =
                                                                typeof field.value ===
                                                                    'number'
                                                                    ? field.value
                                                                    : undefined;
                                                            return (
                                                                <RadioGroup
                                                                    value={
                                                                        currentValue !==
                                                                            undefined
                                                                            ? String(
                                                                                currentValue,
                                                                            )
                                                                            : ''
                                                                    }
                                                                    onValueChange={(
                                                                        value,
                                                                    ) => {
                                                                        field.onChange(
                                                                            Number(
                                                                                value,
                                                                            ),
                                                                        );
                                                                    }}
                                                                    className="flex gap-2"
                                                                >
                                                                    {likertScale.map(
                                                                        (option) => {
                                                                            const inputId = `${question.questionId}-${option.value}`;
                                                                            const isSelected =
                                                                                currentValue ===
                                                                                option.value;
                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        option.value
                                                                                    }
                                                                                    className="relative flex-1"
                                                                                >
                                                                                    <RadioGroupItem
                                                                                        value={String(
                                                                                            option.value,
                                                                                        )}
                                                                                        id={
                                                                                            inputId
                                                                                        }
                                                                                        title={
                                                                                            option.description
                                                                                        }
                                                                                        className={cn(
                                                                                            'peer absolute inset-0 z-10 h-full w-full cursor-pointer',
                                                                                            'border-0 bg-transparent opacity-0',
                                                                                            'focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                                                                                        )}
                                                                                    />
                                                                                    <div
                                                                                        className={cn(
                                                                                            'pointer-events-none flex h-12 flex-col items-center justify-center rounded-xl border text-sm font-medium transition-all',
                                                                                            'peer-focus-visible:border-ring peer-focus-visible:ring-2 peer-focus-visible:ring-ring/25',
                                                                                            isSelected
                                                                                                ? 'border-primary bg-primary/15 text-primary shadow-sm ring-1 ring-primary/25'
                                                                                                : 'border-border bg-secondary/30 text-muted-foreground',
                                                                                        )}
                                                                                        aria-hidden
                                                                                    >
                                                                                        {
                                                                                            option.label
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        },
                                                                    )}
                                                                </RadioGroup>
                                                            );
                                                        }}
                                                    />
                                                    <div className="flex justify-around gap-3 text-xs text-muted-foreground">
                                                        {likertScale.map((option) => (
                                                            <span className="truncate" key={option.value}>{option.description}</span>
                                                        ))}
                                                    </div>
                                                    {fieldError &&
                                                        'numericalValue' in
                                                        fieldError && (
                                                            <p className="text-sm text-destructive">
                                                                {fieldError
                                                                    .numericalValue
                                                                    ?.message ??
                                                                    'Please select a value'}
                                                            </p>
                                                        )}
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            ))}

                            {textQuestions.length > 0 && (
                                <Card className="mb-6 border-border bg-card min-w-[400px] w-full overflow-hidden">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                                                <Megaphone className="h-6 w-6" />
                                            </span>
                                            <div>
                                                <CardTitle className="text-lg text-foreground">
                                                    Qualitative Feedback
                                                </CardTitle>
                                                <CardDescription>
                                                    Share your thoughts and
                                                    observations
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {textQuestions.map((question) => {
                                            const formIndex =
                                                indexByQuestionId.get(
                                                    question.questionId,
                                                );
                                            if (formIndex === undefined)
                                                return null;
                                            const fieldError =
                                                form.formState.errors.answers?.[
                                                formIndex
                                                ];
                                            const numericalIndex =
                                                textQuestions.findIndex(
                                                    (q) =>
                                                        q.questionId ===
                                                        question.questionId,
                                                ) + 1;
                                            return (
                                                <div
                                                    key={question.id}
                                                    className="space-y-3"
                                                >
                                                    <Label
                                                        htmlFor={String(
                                                            question.questionId,
                                                        )}
                                                        className="text-foreground"
                                                    >
                                                        <span className="mr-2 text-muted-foreground">
                                                            {numericalIndex}.
                                                        </span>
                                                        {question.questionTitle}
                                                    </Label>
                                                    <Textarea
                                                        id={String(
                                                            question.questionId,
                                                        )}
                                                        placeholder="Enter your response..."
                                                        className="min-h-32 resize-none border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground"
                                                        {...form.register(
                                                            `answers.${formIndex}.textValue`,
                                                        )}
                                                    />
                                                    {fieldError &&
                                                        'textValue' in
                                                        fieldError && (
                                                            <p className="text-sm text-destructive">
                                                                {fieldError
                                                                    .textValue
                                                                    ?.message ??
                                                                    'Please provide a response'}
                                                            </p>
                                                        )}
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            )}

                            <div className="flex flex-wrap justify-end gap-4 pb-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-secondary rounded-xl"
                                    disabled={submitMutation.isPending}
                                    onClick={handleClearForm}
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Clear
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-border text-foreground hover:bg-secondary rounded-xl"
                                    onClick={() =>
                                        router.push('/feedback360/surveys')
                                    }
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                                    disabled={
                                        !isComplete || submitMutation.isPending
                                    }
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    {submitMutation.isPending
                                        ? 'Submitting...'
                                        : 'Submit'}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
