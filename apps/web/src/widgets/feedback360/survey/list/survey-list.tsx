'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { useReviewsQuery } from '@entities/feedback360/review/api/review.queries';
import {
    useAllSurveyQuestionsQuery,
    useSurveyCycleTitlesQuery,
} from '@entities/feedback360/survey/api/review-question-relation.queries';
import {
    SurveyData,
    SurveyQuestion,
} from '@entities/feedback360/survey/model/mappers';
import {
    AnswerType,
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
    SortDirection,
    ResponseStatus,
    RespondentCategory
} from '@entities/feedback360/survey/model/types';
import { SurveysFilters } from '@entities/feedback360/survey/ui/surveys-filters';
import { SurveysTable } from '@entities/feedback360/survey/ui/surveys-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { TablePagination } from '@shared/ui/table-pagination';
import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import { Review } from '@entities/feedback360/review/model/mappers';
import { useReviewRespondentsQuery, useAllReviewsRespondentsQuery } from '@entities/feedback360/respondent/api/respondent.queries';
import { Respondent } from '@entities/feedback360/respondent/model/mappers';
import { CycleStage } from '@entities/feedback360/cycle/model/types';
import { StatisticsCard } from '@shared/ui/statistics-card';
import { formatNumber } from '@shared/lib/utils/format-number';
import { AlarmClock, Check, Hourglass, Pencil, SquareCheck, UserRound } from 'lucide-react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import Link from "next/link";
import { format } from 'date-fns';
import { ClipboardList, CheckCircle, Clock, User } from "lucide-react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@shared/components/ui/tabs"
import { CategoryBadge } from '@entities/feedback360/respondent/ui/category-badge';
import { useUsersByUserIdsQuery } from '@entities/identity/user/api/user.queries';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';

const ITEMS_PER_PAGE = 6;

export enum SurveyListTab {
    PENDING = 'pending',
    COMPLETED = 'completed',
}

export function SurveysList({ currentUserId }: { currentUserId: number }) {
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [stages, setStages] = useState<string[]>([]);
    const [cycles, setCycles] = useState<string[]>([]);
    const [teams, setTeams] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);
    const [activeTab, setActiveTab] = useState<SurveyListTab>(SurveyListTab.PENDING);

    // fetch all data for survey table
    const {
        data: initialAllReviewsData = [],
        isLoading: isReviewsLoading,
        isError: isReviewsError,
    } = useReviewsQuery();

    const reviewIds = initialAllReviewsData.map((r) => r.id);

    const {
        surveyQuestions: allSurveyQuestions,
        isLoading: isAllSurveyQuestionsLoading,
        isError: isAllSurveyQuestionsError,
    } = useAllSurveyQuestionsQuery(reviewIds);
    const surveyReviews = Array.from(
        Object.values(allSurveyQuestions).flatMap((q) =>
            q.map((q) => q.reviewId),
        ),
    );
    const allReviewsData = initialAllReviewsData.filter((r) =>
        surveyReviews.includes(r.id),
    );

    const cycleIds = allReviewsData
        .map((r) => r.cycleId)
        .filter((id) => id !== null && id !== undefined);

    const {
        cycleTitles: allCycleTitles,
        isLoading: isAllCycleTitlesLoading,
        isError: isAllCycleTitlesError,
    } = useSurveyCycleTitlesQuery(cycleIds);

    // fetch all data for survey dashboard
    const {
        data: activeCyclesData = [],
        isLoading: isActiveCyclesLoading,
        isError: isActiveCyclesError,
    } = useCyclesQuery({ stage: CycleStage.ACTIVE, isActive: true });

    const activeCycleIds = activeCyclesData.map((c) => c.id);

    const activeReviewsData = useMemo(() => {
        return activeCycleIds.map(cycleId => ({
            cycleId,
            reviews: initialAllReviewsData.filter(r => r.cycleId === cycleId)
        }));
    }, [activeCycleIds, initialAllReviewsData]);

    const activeReviewIds = useMemo(() => {
        return [...new Set(activeReviewsData.flatMap(d => d.reviews.map(r => r.id)))];
    }, [activeReviewsData]);

    // Fetch respondents for all active reviews in one go (using useQueries internally)
    const {
        data: reviewRespondentsData,
        isLoading: isReviewRespondentsLoading
    } = useAllReviewsRespondentsQuery(activeReviewIds);

    const rateeIds = useMemo(() => {
        return activeReviewsData.flatMap((d) => d.reviews.map((r) => r.rateeId));
    }, [activeReviewsData]);

    const { data: reviewRatees } = useUsersByUserIdsQuery(rateeIds);

    // const currentUserSurveysData = useMemo(() => {
    //     return reviewRespondentsData.map((r) =>
    //         r.respondents.some((re) => re.respondentId === currentUserId) ?
    //             r.respondents.filter((re) => re.respondentId === currentUserId)
    //             : []
    //     )
    //         .flat();
    // }, [reviewRespondentsData, currentUserId]);

    let surveysData = useMemo(() => {
        return reviewRespondentsData.map((r) =>
            r.respondents.some((re) => re.respondentId === currentUserId) ? r : undefined)
            .filter((r) => r);
    }, [reviewRespondentsData, currentUserId]);


    const currentUserSurveysData = useMemo(() => {
        return surveysData.map((r) => {
            const respondent = r?.respondents.filter((re) => re.respondentId === currentUserId)[0];
            const review = activeReviewsData.flatMap((re) => re.reviews.filter(r => r.id === respondent?.reviewId))[0];
            const cycle = activeCyclesData?.find((c) => c.id === review?.cycleId);
            const ratee = reviewRatees?.find((re) => re.id === review?.rateeId);
            return { cycle, review, respondent, ratee }
        });
    }, [surveysData, activeCyclesData, activeReviewsData, currentUserId]);


    console.log("currentUserId", currentUserId);
    console.log("activeCyclesData", activeCyclesData);
    console.log("activeReviewsData", activeReviewsData);
    console.log("reviewRespondentsData", reviewRespondentsData);
    console.log("currentUserSurveysData", currentUserSurveysData);


    // Filter unique teams, positions and cycle titles
    const teamOptions = useMemo(() => {
        const uniqueTeams = new Map<number, { id: number; title: string }>();

        allReviewsData.forEach((r) => {
            if (r.teamId && r.teamTitle && r.teamTitle.trim() !== '') {
                uniqueTeams.set(r.teamId, {
                    id: r.teamId,
                    title: r.teamTitle,
                });
            }
        });

        return Array.from(uniqueTeams.values()).sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }, [allReviewsData]);

    const positionOptions = useMemo(() => {
        const uniquePositions = new Map<
            number,
            { id: number; title: string }
        >();

        allReviewsData.forEach((r) => {
            if (
                r.rateePositionId &&
                r.rateePositionTitle &&
                r.rateePositionTitle.trim() !== ''
            ) {
                uniquePositions.set(r.rateePositionId, {
                    id: r.rateePositionId,
                    title: r.rateePositionTitle,
                });
            }
        });

        return Array.from(uniquePositions.values()).sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }, [allReviewsData]);

    const cycleOptions = useMemo(() => {
        const titles = new Set(
            Object.values(allCycleTitles).filter(
                (title) => title && title.trim() !== '',
            ),
        );

        const hasNoCycleReviews = allReviewsData.some(
            (r) => r.cycleId === null || r.cycleId === undefined,
        );

        const sortedTitles = Array.from(titles).sort();
        if (hasNoCycleReviews) {
            sortedTitles.push('None');
        }

        return sortedTitles;
    }, [allCycleTitles, allReviewsData]);

    const stageOptions = useMemo(() => {
        const stages = new Set(
            allReviewsData.map((r) => r.stage).filter(Boolean),
        );

        const sortedStages = Array.from(stages).sort((a, b) => {
            return (
                REVIEW_STAGE_ENUM_VALUES.indexOf(a) -
                REVIEW_STAGE_ENUM_VALUES.indexOf(b)
            ); // ascending order
        });

        return sortedStages;
    }, [allReviewsData]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection((prev) =>
                prev === SortDirection.ASC
                    ? SortDirection.DESC
                    : SortDirection.ASC,
            );
        } else {
            setSortField(field);
            setSortDirection(SortDirection.ASC);
        }
        setCurrentPage(1);
    };

    const handleReset = () => {
        setSearch('');
        setDateRange(undefined);
        setStages([]);
        setCycles([]);
        setTeams([]);
        setPositions([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range and cycle title
    const filteredSurveys = useMemo(() => {
        let result = allReviewsData.map((review) => {
            const questions = allSurveyQuestions[review.id] ?? [];
            const competenceIds = questions
                .map((q) => q.competenceId)
                .filter((id) => id !== null);
            const uniqueCompetenceIds = [...new Set(competenceIds)];
            const createdAt = questions
                .map((q) => q.createdAt)
                .sort((a, b) => b.getTime() - a.getTime())[0];
            return SurveyData.create({
                reviewId: review.id,
                rateeFullName: review.rateeFullName,
                stage: review.stage,
                cycleId: review.cycleId ?? null,
                cycleTitle: review.cycleId
                    ? allCycleTitles[review.cycleId]
                    : null,
                teamId: review.teamId ?? null,
                teamTitle: review.teamTitle ?? null,
                positionId: review.rateePositionId ?? null,
                positionTitle: review.rateePositionTitle,
                competenceCount: uniqueCompetenceIds.length,
                questionCount: questions.length,
                numericalQuestionCount: questions.filter(
                    (q) => q.answerType === AnswerType.NUMERICAL_SCALE,
                )?.length,
                textQuestionCount: questions.filter(
                    (q) => q.answerType === AnswerType.TEXT_FIELD,
                )?.length,
                createdAt: new Date(createdAt),
            });
        });

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.reviewId.toString().includes(lowerSearch) ||
                    (c.rateeFullName &&
                        c.rateeFullName.toLowerCase().includes(lowerSearch)),
            );
        }

        if (stages.length > 0) {
            result = result.filter((c) => c.stage && stages.includes(c.stage));
        }

        if (dateRange?.from) {
            const from = dateRange.from.getTime();
            result = result.filter((c) => c.createdAt.getTime() >= from);
        }
        if (dateRange?.to) {
            const to = dateRange.to.getTime();
            result = result.filter((c) => c.createdAt.getTime() <= to);
        }

        if (cycles.length > 0) {
            result = result.filter((c) => {
                const title =
                    c.cycleId === null || c.cycleId === undefined
                        ? 'None'
                        : (allCycleTitles[c.cycleId!] ?? '');
                return cycles.includes(title);
            });
        }

        if (teams.length > 0) {
            result = result.filter(
                (c) => c.teamId !== null && teams.includes(String(c.teamId)),
            );
        }

        if (positions.length > 0) {
            result = result.filter(
                (c) =>
                    c.positionId !== null &&
                    positions.includes(String(c.positionId)),
            );
        }

        return result;
    }, [
        allReviewsData,
        search,
        stages,
        dateRange,
        cycles,
        allCycleTitles,
        teams,
        positions,
    ]);

    // Client-side sorting for all fields
    const sortedSurveys = useMemo(() => {
        return [...filteredSurveys].sort((a, b) => {
            switch (sortField) {
                case 'reviewId':
                    return sortDirection === SortDirection.ASC
                        ? a.reviewId - b.reviewId
                        : b.reviewId - a.reviewId;
                case 'ratee':
                    return sortDirection === SortDirection.ASC
                        ? (a.rateeFullName ?? '').localeCompare(
                            b.rateeFullName ?? '',
                        )
                        : (b.rateeFullName ?? '').localeCompare(
                            a.rateeFullName ?? '',
                        );
                case 'stage': {
                    const indexA = REVIEW_STAGE_ENUM_VALUES.indexOf(a.stage);
                    const indexB = REVIEW_STAGE_ENUM_VALUES.indexOf(b.stage);
                    return sortDirection === SortDirection.ASC
                        ? indexA - indexB
                        : indexB - indexA;
                }
                case 'cycle': {
                    const titleA = a.cycleId
                        ? (allCycleTitles[a.cycleId] ?? '')
                        : '';
                    const titleB = b.cycleId
                        ? (allCycleTitles[b.cycleId] ?? '')
                        : '';
                    return sortDirection === SortDirection.ASC
                        ? titleA.localeCompare(titleB)
                        : titleB.localeCompare(titleA);
                }
                case 'competenceCount': {
                    const countA = a.competenceCount ?? 0;
                    const countB = b.competenceCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'questionCount': {
                    const countA = a.questionCount ?? 0;
                    const countB = b.questionCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'numericalQuestionCount': {
                    const countA = a.numericalQuestionCount ?? 0;
                    const countB = b.numericalQuestionCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'textQuestionCount': {
                    const countA = a.textQuestionCount ?? 0;
                    const countB = b.textQuestionCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'date':
                    return sortDirection === SortDirection.ASC
                        ? a.createdAt?.getTime() - b.createdAt?.getTime()
                        : b.createdAt?.getTime() - a.createdAt?.getTime();
                default:
                    return 0;
            }
        });
    }, [filteredSurveys, sortField, sortDirection, allCycleTitles]);

    const totalPages = Math.ceil(sortedSurveys.length / ITEMS_PER_PAGE);
    const paginatedReviews = sortedSurveys.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const activeReviews = allReviewsData.filter(
        (c) =>
            c.stage === ReviewStage.SELF_ASSESSMENT ||
            c.stage === ReviewStage.WAITING_TO_START ||
            c.stage === ReviewStage.IN_PROGRESS ||
            c.stage === ReviewStage.PREPARING_REPORT ||
            c.stage === ReviewStage.PROCESSING_BY_HR,
    ).length;
    const totalReviews = allReviewsData.length;

    const currentUserPendingSurveys = useMemo(() => {
        return currentUserSurveysData.filter((c) =>
            c.respondent?.responseStatus === ResponseStatus.PENDING || c.respondent?.responseStatus === ResponseStatus.IN_PROGRESS)
            .sort((a, b) => a.review.id - b.review.id);
    }, [currentUserSurveysData]);

    const currentUserCompletedSurveys = useMemo(() => {
        return currentUserSurveysData.filter((c) =>
            c.respondent?.responseStatus === ResponseStatus.COMPLETED)
            .sort((a, b) => a.review.id - b.review.id);
    }, [currentUserSurveysData]);
    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl gap-8 flex flex-col">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            My 360° Feedback Surveys
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Complete feedback surveys for your colleagues within the current cycle. You have {' '}
                            <span className="font-medium text-foreground">
                                {currentUserPendingSurveys.length}
                            </span>{' '}active surveys to complete.
                        </p>
                    </div>
                </div>

                {/* Survey stats */}

                <div className="flex flex-row flex-wrap flex-1 min-w-[95px] w-full overflow-hidden gap-6 justify-around items-center">
                    <StatisticsCard
                        title={`Pending Surveys`}
                        value={formatNumber(currentUserPendingSurveys.length) ?? '-'}
                        icon={Hourglass}
                        textColor="text-indigo-300"
                        width={300}
                    />
                    <StatisticsCard
                        title={`Completed Surveys`}
                        value={
                            formatNumber(currentUserCompletedSurveys.length) ?? '-'}
                        icon={SquareCheck}
                        textColor="text-lime-300"
                        width={300}
                    />
                    <StatisticsCard
                        title={`Self-Assessment Surveys`}
                        value={
                            formatNumber(currentUserSurveysData.filter((c) =>
                                c.respondent?.category === RespondentCategory.SELF_ASSESSMENT).length) ?? '-'
                        }
                        icon={UserRound}
                        textColor="text-yellow-300"
                        width={300}
                    />
                </div>
                {/* Survey List Tabs */}
                <Tabs defaultValue={SurveyListTab.PENDING} className="w-full overflow-hidden">
                    <TabsList className="border rounded-xl">
                        <TabsTrigger value={SurveyListTab.PENDING} className="border rounded-xl">Pending</TabsTrigger>
                        <TabsTrigger value={SurveyListTab.COMPLETED} className="border rounded-xl">Completed</TabsTrigger>
                    </TabsList>
                    {/* Survey List */}
                    <TabsContent value={SurveyListTab.PENDING}>
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">
                                    Pending Surveys
                                </CardTitle>
                                <CardDescription>
                                    These {' '}
                                    <span className="font-semibold text-foreground">{formatNumber(currentUserPendingSurveys.length)}</span> {' '}
                                    {currentUserPendingSurveys.length !== 1 ? 'surveys are' : 'survey is'} awaiting your feedback.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {currentUserPendingSurveys.map((survey) => (
                                        <div
                                            key={survey.review.id}
                                            className="flex flex-row flex-wrap items-center justify-between gap-6 p-4 rounded-xl border border-border shadow-xs w-full overflow-hidden"
                                        >
                                            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left flex-1 min-w-[400px]">
                                                <Avatar className="h-20 w-20 border bg-muted shrink-0">
                                                    <AvatarImage
                                                        className="object-cover"
                                                        src={survey.ratee?.avatarUrl || ''}
                                                        alt={survey.review.rateeFullName}
                                                    />
                                                    <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                                        {getUserInitialsFromFullName(survey.review.rateeFullName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1 flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                        <p className="font-medium text-lg text-foreground break-words">{survey.review.rateeFullName}</p>
                                                        <CategoryBadge category={survey.respondent?.category || RespondentCategory.TEAM} />
                                                    </div>
                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-muted-foreground text-base">
                                                        <span className="break-words">{survey.review.rateePositionTitle}</span>
                                                        {survey.review.teamTitle && (
                                                            <>
                                                                <span className="sm:inline">•</span>
                                                                <span className="break-words">{survey.review.teamTitle}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shrink-0 w-full md:w-auto">
                                                <div className="flex items-center gap-x-2 text-base flex-wrap justify-center md:justify-end">
                                                    <AlarmClock className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground whitespace-nowrap">Due</span>
                                                    <span className="font-medium text-foreground whitespace-nowrap">
                                                        {format(survey.cycle?.responseDeadline || survey.cycle?.reviewDeadline || survey.cycle?.endDate || '', 'MMM dd, yyyy')}
                                                    </span>
                                                </div>
                                                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full sm:w-auto">
                                                    <Link href={`/feedback360/surveys/${survey.review.id}`}>
                                                        <Pencil className="h-4 w-4" />
                                                        Review
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value={SurveyListTab.COMPLETED}>
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-foreground">Completed Surveys
                                </CardTitle>
                                <CardDescription>
                                    Your submitted {' '}
                                    <span className="font-semibold text-foreground">{formatNumber(currentUserCompletedSurveys.length)}</span> {' '}
                                    {currentUserCompletedSurveys.length !== 1 ? 'feedback surveys' : 'feedback survey'}.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {currentUserCompletedSurveys.map((survey) => (
                                        <div
                                            key={survey.review.id}
                                            className="flex flex-row flex-wrap items-center justify-between gap-6 p-4 rounded-xl border border-border shadow-xs w-full overflow-hidden"
                                        >
                                            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left flex-1 min-w-[400px]">
                                                <Avatar className="h-20 w-20 border bg-muted shrink-0">
                                                    <AvatarImage
                                                        className="object-cover"
                                                        src={survey.ratee?.avatarUrl || ''}
                                                        alt={survey.review.rateeFullName}
                                                    />
                                                    <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                                        {getUserInitialsFromFullName(survey.review.rateeFullName)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1 flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                        <p className="font-medium text-lg text-foreground break-words">{survey.review.rateeFullName}</p>
                                                        <CategoryBadge category={survey.respondent?.category || RespondentCategory.TEAM} />
                                                    </div>
                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-muted-foreground text-base">
                                                        <span className="break-words">{survey.review.rateePositionTitle}</span>
                                                        {survey.review.teamTitle && (
                                                            <>
                                                                <span className="sm:inline">•</span>
                                                                <span className="break-words">{survey.review.teamTitle}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shrink-0 w-full md:w-auto">
                                                <div className="flex items-center gap-x-2 text-base flex-wrap justify-center md:justify-end">
                                                    <CheckCircle className="text-muted-foreground h-4 w-4 shrink-0" />
                                                    <span className="text-muted-foreground whitespace-nowrap">Completed</span>
                                                    <span className="text-foreground whitespace-nowrap">{format(survey.respondent?.respondedAt ?? '', 'MMM dd, yyyy')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>










                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            360° Feedback Surveys
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage and monitor surveys across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {activeReviews}
                            </span>{' '}
                            active of{' '}
                            <span className="font-medium text-foreground">
                                {totalReviews}
                            </span>{' '}
                            total surveys.
                        </p>
                    </div>
                    {/* <CreateReviewForm
                        trigger={
                            <Button size="lg" className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Review
                            </Button>
                        }
                    /> */}
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Surveys</CardTitle>
                        <CardDescription>
                            Search, filter, and manage surveys.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <SurveysFilters
                            search={search}
                            onSearchChange={(val) => {
                                setSearch(val);
                                setCurrentPage(1);
                            }}
                            stages={stages}
                            onStagesChange={(val) => {
                                setStages(val);
                                setCurrentPage(1);
                            }}
                            dateRange={dateRange}
                            onDateRangeChange={(range) => {
                                setDateRange(range);
                                setCurrentPage(1);
                            }}
                            cycles={cycles}
                            onCyclesChange={(val) => {
                                setCycles(val);
                                setCurrentPage(1);
                            }}
                            teams={teams}
                            onTeamsChange={(val) => {
                                setTeams(val);
                                setCurrentPage(1);
                            }}
                            positions={positions}
                            onPositionsChange={(val) => {
                                setPositions(val);
                                setCurrentPage(1);
                            }}
                            stageOptions={stageOptions}
                            cycleOptions={cycleOptions}
                            teamOptions={teamOptions}
                            positionOptions={positionOptions}
                            onReset={handleReset}
                        />

                        {/* Loading State */}
                        {(isReviewsLoading ||
                            isAllSurveyQuestionsLoading ||
                            isAllCycleTitlesLoading) && (
                                <div className="flex flex-col text-center items-center justify-center py-16 h-8 w-8 animate-spin text-muted-foreground">
                                    <Spinner />
                                </div>
                            )}

                        {/* Error State */}
                        {isReviewsError ||
                            isAllSurveyQuestionsError ||
                            (isAllCycleTitlesError && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <h3 className="text-lg font-semibold text-destructive">
                                        Failed to load surveys
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Please try refreshing the page.
                                    </p>
                                </div>
                            ))}

                        {/* Table */}
                        {!isReviewsLoading &&
                            !isAllSurveyQuestionsLoading &&
                            !isAllCycleTitlesLoading && (
                                <>
                                    <SurveysTable
                                        surveyQuestions={allSurveyQuestions}
                                        surveys={paginatedReviews}
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                        resetTrigger={resetTrigger}
                                    />

                                    {/* Pagination */}
                                    <TablePagination
                                        entityName="surveys"
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredSurveys.length}
                                        limit={ITEMS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                    />
                                </>
                            )}
                    </CardContent>
                </Card>
            </div>

            {/* Feature Dialogs */}
            {/* <ForceFinishCycleDialog
                cycle={forceFinishCycle}
                onClose={() => setForceFinishCycle(null)}
            />
            <DeleteCycleDialog
                cycle={deleteCycle}
                onClose={() => setDeleteCycle(null)}
            /> */}
        </main>
    );
}
