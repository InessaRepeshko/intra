'use client';

import type { Answer } from '@entities/feedback360/answer/model/mappers';
import {
    AnswerType,
    type RespondentCategory,
} from '@entities/feedback360/answer/model/types';
import { CategoryBadge } from '@entities/feedback360/respondent/ui/category-badge';
import { useSurveyQuestionsQuery } from '@entities/feedback360/survey/api/review-question-relation.queries';
import { useUserQuery } from '@entities/identity/user/api/user.queries';
import {
    useCommentReportQuery,
    useCommentReviewQuery,
    useReviewAnswersQuery,
} from '@entities/reporting/individual-report-comment/api/individual-report-comment.queries';
import { usePublishReviewMutation } from '@features/feedback360/review/publish/api/publish-review.mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommentSentiment } from '@intra/shared-kernel';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Input } from '@shared/components/ui/input';
import { Label } from '@shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@shared/components/ui/radio-group';
import { Skeleton } from '@shared/components/ui/skeleton';
import { Spinner } from '@shared/components/ui/spinner';
import { Textarea } from '@shared/components/ui/textarea';
import { cn } from '@shared/lib/utils/cn';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';
import { useSidebar } from '@shared/ui/app-sidebar';
import {
    PanelLeft,
    Plus,
    RotateCcw,
    ShieldCheck,
    Trash2,
    X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useProcessReportCommentsMutation } from '../api/process-report-comments';
import {
    processReportCommentsSchema,
    type ProcessReportCommentsValues,
} from '../model/process-comments-schema';

interface ProcessReportCommentsFormProps {
    reportId: number;
}

interface QuestionGroup {
    questionId: number;
    questionTitle: string;
    answers: Answer[];
    respondentCategories: RespondentCategory[];
}

const SENTIMENT_OPTIONS: Array<{
    value: CommentSentiment;
    label: string;
}> = [
    { value: CommentSentiment.NEGATIVE, label: 'Negative' },
    { value: CommentSentiment.POSITIVE, label: 'Positive' },
];

function FormHeaderSkeleton() {
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

function FormContentSkeleton() {
    return (
        <div className="mx-auto max-w-4xl space-y-6 p-8">
            {Array.from({ length: 2 }).map((_, idx) => (
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

export function ProcessReportCommentsForm({
    reportId,
}: ProcessReportCommentsFormProps) {
    const router = useRouter();
    const { toggle } = useSidebar();

    const reportQuery = useCommentReportQuery(reportId);
    const reviewQuery = useCommentReviewQuery(reportId);
    const reviewId = reviewQuery.data?.id ?? 0;
    const answersQuery = useReviewAnswersQuery(reviewId);
    const questionsQuery = useSurveyQuestionsQuery(reviewId);
    const rateeQuery = useUserQuery(reviewQuery.data?.rateeId!);
    const submitMutation = useProcessReportCommentsMutation();
    const publishMutation = usePublishReviewMutation();
    const [publishingId, setPublishingId] = useState<number | null>(null);

    const questionTitleMap = useMemo(() => {
        const map = new Map<number, string>();
        for (const question of questionsQuery.data ?? []) {
            map.set(question.questionId, question.questionTitle);
        }
        return map;
    }, [questionsQuery.data]);

    const textAnswers = useMemo<Answer[]>(() => {
        return (answersQuery.data ?? []).filter(
            (answer) => answer.answerType === AnswerType.TEXT_FIELD,
        );
    }, [answersQuery.data]);

    const questionGroups = useMemo<QuestionGroup[]>(() => {
        const groups = new Map<number, QuestionGroup>();
        for (const answer of textAnswers) {
            const existing = groups.get(answer.questionId);
            if (existing) {
                existing.answers.push(answer);
                if (
                    !existing.respondentCategories.includes(
                        answer.respondentCategory,
                    )
                ) {
                    existing.respondentCategories.push(
                        answer.respondentCategory,
                    );
                }
                continue;
            }
            groups.set(answer.questionId, {
                questionId: answer.questionId,
                questionTitle:
                    questionTitleMap.get(answer.questionId) ??
                    `Question #${answer.questionId}`,
                answers: [answer],
                respondentCategories: [answer.respondentCategory],
            });
        }
        return Array.from(groups.values());
    }, [textAnswers, questionTitleMap]);

    const respondentCategoriesByQuestion = useMemo(() => {
        const map = new Map<number, RespondentCategory[]>();
        for (const group of questionGroups) {
            map.set(group.questionId, group.respondentCategories);
        }
        return map;
    }, [questionGroups]);

    const questionsShapeKey = useMemo(() => {
        return `${reportId}:${questionGroups.map((g) => g.questionId).join(',')}`;
    }, [reportId, questionGroups]);

    const form = useForm<ProcessReportCommentsValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(processReportCommentsSchema) as any,
        defaultValues: { entries: [] },
        mode: 'onChange',
    });

    const { reset, control, clearErrors } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'entries',
    });

    const lastShapeKeyRef = useRef<string | null>(null);

    useEffect(() => {
        if (questionsShapeKey === lastShapeKeyRef.current) {
            return;
        }
        lastShapeKeyRef.current = questionsShapeKey;
        reset({ entries: [] });
    }, [questionsShapeKey, reset]);

    const watchedEntries =
        useWatch({ control, name: 'entries', defaultValue: [] }) ?? [];

    const completedCount = useMemo(() => {
        return watchedEntries.reduce((acc, entry) => {
            if (!entry) return acc;
            const hasComment =
                typeof entry.comment === 'string' &&
                entry.comment.trim().length > 0;
            const hasSentiment =
                entry.commentSentiment === CommentSentiment.POSITIVE ||
                entry.commentSentiment === CommentSentiment.NEGATIVE;
            const hasMentions =
                typeof entry.numberOfMentions === 'number' &&
                Number.isInteger(entry.numberOfMentions) &&
                entry.numberOfMentions >= 1;
            return hasComment && hasSentiment && hasMentions ? acc + 1 : acc;
        }, 0);
    }, [watchedEntries]);

    const totalEntries = watchedEntries.length;
    const isComplete = totalEntries > 0 && completedCount === totalEntries;

    const isInitialLoading =
        reportQuery.isLoading ||
        reviewQuery.isLoading ||
        (reviewId > 0 && (answersQuery.isLoading || questionsQuery.isLoading));

    const onSubmit = (values: ProcessReportCommentsValues) => {
        submitMutation.mutate(
            { reportId, values, respondentCategoriesByQuestion },
            {
                onSuccess: () => {
                    router.push(`/reporting/individual-reports/comments`);
                },
            },
        );
    };

    const onPublish = (values: ProcessReportCommentsValues) => {
        setPublishingId(reviewId);
        submitMutation.mutate(
            { reportId, values, respondentCategoriesByQuestion },
            {
                onSuccess: () => {
                    publishMutation.mutate(
                        { id: reviewId, reportId },
                        {
                            onSettled: () => {
                                setPublishingId(null);
                                router.push(
                                    `/reporting/individual-reports/comments`,
                                );
                            },
                        },
                    );
                },
                onError: () => {
                    setPublishingId(null);
                },
            },
        );
    };

    const handleClearForm = () => {
        reset({ entries: [] });
        clearErrors();
        toast.success('All comments cleared');
    };

    const handleAddComment = (group: QuestionGroup) => {
        append({
            questionId: group.questionId,
            questionTitle: group.questionTitle,
            comment: '',
            commentSentiment: undefined as unknown as CommentSentiment,
            numberOfMentions: 1,
        });
    };

    if (isInitialLoading) {
        return (
            <div className="flex min-h-full flex-col bg-background">
                <FormHeaderSkeleton />
                <FormContentSkeleton />
            </div>
        );
    }

    if (
        reportQuery.isError ||
        !reportQuery.data ||
        reviewQuery.isError ||
        !reviewQuery.data
    ) {
        return (
            <div className="flex min-h-full flex-col items-center justify-center gap-4 bg-background p-8 text-center">
                <h1 className="text-2xl font-semibold text-foreground">
                    Report Comments not found
                </h1>
                <p className="text-muted-foreground">
                    We could not load this report. It may have been deleted or
                    you do not have access.
                </p>
                <Button asChild>
                    <Link href="/reporting/individual-reports/comments">
                        Back to report comments
                    </Link>
                </Button>
            </div>
        );
    }

    const review = reviewQuery.data;
    const hasQuestions = questionGroups.length > 0;

    return (
        <div className="flex flex-col my-2 mx-2 rounded-xl shadow-md min-w-[400px] w-full">
            <form
                onSubmit={form.handleSubmit(onPublish)}
                className="flex min-h-full flex-col bg-background rounded-xl"
            >
                <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background rounded-t-xl px-4 py-4 flex-wrap">
                    <div className="flex items-center gap-4 min-w-[100px]">
                        <button
                            type="button"
                            onClick={toggle}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-accent-foreground transition-colors"
                            aria-label="Toggle sidebar"
                        >
                            <PanelLeft className="h-6 w-6" />
                        </button>
                        <div className="h-6 w-px bg-border" />
                        <div className="text-xl font-semibold tracking-tight text-foreground gap-2 flex items-center whitespace-wrap">
                            <span className="line-clamp-1">{`Individual Report #${reportId} Comments`}</span>
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
                                        {getUserInitialsFromFullName(
                                            rateeQuery.data.fullName ??
                                                `${rateeQuery.data.lastName} ${rateeQuery.data.firstName}`,
                                        )}
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
                                    <>{review.rateePositionTitle}</>
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

                    <div
                        className={`flex items-center justify-end gap-3 overflow-hidden grow-0 m-auto ${!hasQuestions ? 'invisible' : ''}`}
                    >
                        <div className="hidden md:flex items-center justify-end gap-2">
                            <span className="text-sm text-muted-foreground flex whitespace-nowrap justify-center gap-1">
                                <span>
                                    {completedCount}/{totalEntries}
                                </span>
                                <span>·</span>
                                <span>
                                    {totalEntries === 1
                                        ? 'comment'
                                        : 'comments'}
                                </span>
                            </span>
                        </div>
                        <Button
                            type="button"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                            disabled={
                                !isComplete ||
                                publishingId === reviewId ||
                                submitMutation.isPending ||
                                publishMutation.isPending
                            }
                            onClick={form.handleSubmit(onPublish)}
                        >
                            {publishingId === reviewId ||
                            publishMutation.isPending ? (
                                <Spinner className="h-4 w-4 text-primary-foreground" />
                            ) : (
                                <ShieldCheck className="h-4 w-4" />
                            )}
                            {publishMutation.isPending ||
                            submitMutation.isPending
                                ? 'Saving...'
                                : 'Submit & Publish'}
                        </Button>
                    </div>
                </header>

                <div className="mx-auto min-w-[350px] w-full max-w-4xl p-8">
                    {!hasQuestions ? (
                        <div className="border-border bg-card py-12 text-center">
                            <h3 className="text-lg font-semibold text-foreground">
                                No text responses to process
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                This report does not have any text-field answers
                                yet.
                            </p>
                        </div>
                    ) : (
                        <>
                            {questionGroups.map((group, groupIndex) => {
                                const groupEntryIndices: number[] = [];
                                fields.forEach((field, idx) => {
                                    if (field.questionId === group.questionId) {
                                        groupEntryIndices.push(idx);
                                    }
                                });

                                return (
                                    <Card
                                        key={group.questionId}
                                        className="mb-6 border-border bg-card min-w-[350px] w-full overflow-hidden"
                                    >
                                        <CardHeader>
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-semibold text-primary">
                                                    {groupIndex + 1}
                                                </span>
                                                <div>
                                                    <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                                                        {group.questionTitle}
                                                    </CardTitle>
                                                    <CardDescription>
                                                        {group.answers.length}{' '}
                                                        {group.answers
                                                            .length === 1
                                                            ? 'response'
                                                            : 'responses'}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-3">
                                                {group.answers.map(
                                                    (answer, answerIdx) => (
                                                        <div
                                                            key={answer.id}
                                                            className="space-y-2 rounded-xl border border-border bg-secondary/20 p-4"
                                                        >
                                                            <div className="flex items-center justify-start gap-2 flex-wrap">
                                                                <span className="text-sm text-foreground">
                                                                    #
                                                                    {answerIdx +
                                                                        1}
                                                                </span>
                                                                <span className="text-sm text-muted-foreground">
                                                                    {' '}
                                                                    answer in
                                                                    category
                                                                </span>
                                                                <CategoryBadge
                                                                    category={
                                                                        answer.respondentCategory
                                                                    }
                                                                />
                                                            </div>
                                                            <p className="text-foreground whitespace-pre-wrap text-sm p-3 bg-slate-100 border-l-4 border-l-slate-300">
                                                                {
                                                                    answer.textValue
                                                                }
                                                            </p>
                                                        </div>
                                                    ),
                                                )}
                                            </div>

                                            <div className="space-y-4 border-t border-border pt-5">
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                    <h4 className="text-sm font-semibold text-foreground">
                                                        Analyst comments
                                                    </h4>
                                                    <span className="text-xs text-muted-foreground">
                                                        {
                                                            groupEntryIndices.length
                                                        }{' '}
                                                        added
                                                    </span>
                                                </div>

                                                {groupEntryIndices.length ===
                                                0 ? (
                                                    <p className="text-sm text-muted-foreground">
                                                        No comments yet. Click
                                                        "Add comment" below to
                                                        create one.
                                                    </p>
                                                ) : (
                                                    groupEntryIndices.map(
                                                        (
                                                            entryIndex,
                                                            localIdx,
                                                        ) => {
                                                            const fieldId =
                                                                fields[
                                                                    entryIndex
                                                                ]?.id ??
                                                                `${group.questionId}-${localIdx}`;
                                                            const fieldError =
                                                                form.formState
                                                                    .errors
                                                                    .entries?.[
                                                                    entryIndex
                                                                ];
                                                            return (
                                                                <div
                                                                    key={
                                                                        fieldId
                                                                    }
                                                                    className="space-y-3 rounded-xl border border-border bg-background p-4"
                                                                >
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <Label
                                                                            htmlFor={`comment-${fieldId}`}
                                                                            className="text-foreground"
                                                                        >
                                                                            Comment
                                                                            #
                                                                            {localIdx +
                                                                                1}
                                                                        </Label>
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-muted-foreground hover:text-destructive"
                                                                            onClick={() =>
                                                                                remove(
                                                                                    entryIndex,
                                                                                )
                                                                            }
                                                                            aria-label="Remove comment"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                    <Textarea
                                                                        id={`comment-${fieldId}`}
                                                                        placeholder="Enter analyst comment..."
                                                                        className="min-h-32 resize-none border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground"
                                                                        {...form.register(
                                                                            `entries.${entryIndex}.comment`,
                                                                        )}
                                                                    />
                                                                    {fieldError &&
                                                                        'comment' in
                                                                            fieldError && (
                                                                            <p className="text-sm text-destructive">
                                                                                {fieldError
                                                                                    .comment
                                                                                    ?.message ??
                                                                                    'Please provide a comment'}
                                                                            </p>
                                                                        )}

                                                                    <Label className="text-foreground">
                                                                        Sentiment
                                                                    </Label>
                                                                    <Controller
                                                                        control={
                                                                            form.control
                                                                        }
                                                                        name={`entries.${entryIndex}.commentSentiment`}
                                                                        render={({
                                                                            field,
                                                                        }) => {
                                                                            const currentValue =
                                                                                field.value ??
                                                                                '';
                                                                            return (
                                                                                <RadioGroup
                                                                                    value={
                                                                                        currentValue
                                                                                    }
                                                                                    onValueChange={(
                                                                                        value,
                                                                                    ) =>
                                                                                        field.onChange(
                                                                                            value as CommentSentiment,
                                                                                        )
                                                                                    }
                                                                                    className="flex gap-2"
                                                                                >
                                                                                    {SENTIMENT_OPTIONS.map(
                                                                                        (
                                                                                            option,
                                                                                        ) => {
                                                                                            const inputId = `${fieldId}-${option.value}`;
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
                                                                                                        value={
                                                                                                            option.value
                                                                                                        }
                                                                                                        id={
                                                                                                            inputId
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
                                                                                                                ? 'border-primary bg-white/15 text-primary shadow-sm ring-1 ring-primary/25'
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
                                                                    {fieldError &&
                                                                        'commentSentiment' in
                                                                            fieldError && (
                                                                            <p className="text-sm text-destructive">
                                                                                {fieldError
                                                                                    .commentSentiment
                                                                                    ?.message ??
                                                                                    'Please select sentiment'}
                                                                            </p>
                                                                        )}

                                                                    <Label
                                                                        htmlFor={`mentions-${fieldId}`}
                                                                        className="text-foreground"
                                                                    >
                                                                        Number
                                                                        of
                                                                        mentions
                                                                    </Label>
                                                                    <Input
                                                                        id={`mentions-${fieldId}`}
                                                                        type="number"
                                                                        min={1}
                                                                        step={1}
                                                                        inputMode="numeric"
                                                                        defaultValue={
                                                                            1
                                                                        }
                                                                        className="w-32 border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground"
                                                                        {...form.register(
                                                                            `entries.${entryIndex}.numberOfMentions`,
                                                                            {
                                                                                valueAsNumber: true,
                                                                            },
                                                                        )}
                                                                    />
                                                                    {fieldError &&
                                                                        'numberOfMentions' in
                                                                            fieldError && (
                                                                            <p className="text-sm text-destructive">
                                                                                {fieldError
                                                                                    .numberOfMentions
                                                                                    ?.message ??
                                                                                    'Please enter a valid number of mentions'}
                                                                            </p>
                                                                        )}
                                                                </div>
                                                            );
                                                        },
                                                    )
                                                )}

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full border-dashed border-border text-foreground hover:bg-secondary rounded-xl"
                                                    onClick={() =>
                                                        handleAddComment(group)
                                                    }
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add comment
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}

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
                                        router.push(
                                            `/reporting/individual-reports/comments`,
                                        )
                                    }
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full md:w-auto min-w-[120px]"
                                    disabled={
                                        !isComplete ||
                                        publishingId === reviewId ||
                                        submitMutation.isPending ||
                                        publishMutation.isPending
                                    }
                                    onClick={form.handleSubmit(onPublish)}
                                >
                                    {publishingId === reviewId ||
                                    publishMutation.isPending ? (
                                        <Spinner className="h-4 w-4 text-primary-foreground" />
                                    ) : (
                                        <ShieldCheck className="h-4 w-4" />
                                    )}
                                    {publishMutation.isPending ||
                                    submitMutation.isPending
                                        ? 'Saving...'
                                        : 'Submit & Publish'}
                                </Button>
                                {/* <Button
                                    type="submit"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                                    disabled={
                                        !isComplete || submitMutation.isPending
                                    }
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    {submitMutation.isPending
                                        ? 'Saving...'
                                        : 'Submit'}
                                </Button> */}
                            </div>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
