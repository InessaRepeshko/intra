'use client';

import { format } from 'date-fns';
import {
    AlarmClock,
    CheckCircle,
    Eye,
    Hourglass,
    Pencil,
    SquareCheck,
    UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import { CycleStage } from '@entities/feedback360/cycle/model/types';
import { useAllReviewsRespondentsQuery } from '@entities/feedback360/respondent/api/respondent.queries';
import { CategoryBadge } from '@entities/feedback360/respondent/ui/category-badge';
import { useReviewsQuery } from '@entities/feedback360/review/api/review.queries';
import { useAllReviewsReviewersQuery } from '@entities/feedback360/reviewer/api/reviewer.queries';
import {
    RespondentCategory,
    ResponseStatus,
} from '@entities/feedback360/survey/model/types';
import { useUsersByUserIdsQuery } from '@entities/identity/user/api/user.queries';
import { type AuthContextType } from '@entities/identity/user/model/types';
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@shared/components/ui/tabs';
import { formatNumber } from '@shared/lib/utils/format-number';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';
import { StatisticsCard } from '@shared/ui/statistics-card';

export enum SurveyListTab {
    PENDING = 'pending',
    COMPLETED = 'completed',
}

export function SurveyDashboard({
    currentUser,
    isMySurveys = false,
    isMyTeamSurveys = false,
}: {
    currentUser: AuthContextType;
    isMySurveys?: boolean;
    isMyTeamSurveys?: boolean;
}) {
    const { data: initialAllReviewsData = [] } = useReviewsQuery();
    const { data: activeCyclesData = [] } = useCyclesQuery({
        stage: CycleStage.ACTIVE,
        isActive: true,
    });

    const activeCycleIds = useMemo(
        () => activeCyclesData.map((c) => c.id),
        [activeCyclesData],
    );

    const activeReviewsData = useMemo(() => {
        return activeCycleIds.map((cycleId) => ({
            cycleId,
            reviews: initialAllReviewsData.filter((r) => r.cycleId === cycleId),
        }));
    }, [activeCycleIds, initialAllReviewsData]);

    const activeReviewIds = useMemo(() => {
        return [
            ...new Set(
                activeReviewsData.flatMap((d) => d.reviews.map((r) => r.id)),
            ),
        ];
    }, [activeReviewsData]);

    const { data: reviewRespondentsData } =
        useAllReviewsRespondentsQuery(activeReviewIds);
    const { data: reviewReviewersData } =
        useAllReviewsReviewersQuery(activeReviewIds);

    const rateeIds = useMemo(() => {
        return activeReviewsData.flatMap((d) =>
            d.reviews.map((r) => r.rateeId),
        );
    }, [activeReviewsData]);

    const { data: reviewRatees } = useUsersByUserIdsQuery(rateeIds);

    const displayedSurveysData = useMemo(() => {
        const allActiveReviews = activeReviewsData.flatMap((re) => re.reviews);

        return reviewRespondentsData.flatMap((r) => {
            const review = allActiveReviews.find(
                (rev) => rev.id === r.reviewId,
            );
            if (!review) return [];

            const matchingRespondents = isMyTeamSurveys
                ? review.managerId === currentUser.user.id
                    ? r.respondents
                    : []
                : r.respondents.filter(
                      (re) => re.respondentId === currentUser.user.id,
                  );

            if (matchingRespondents.length === 0) return [];

            const cycle = activeCyclesData?.find(
                (c) => c.id === review.cycleId,
            );
            const ratee = reviewRatees?.find((re) => re.id === review.rateeId);
            const reviewers =
                reviewReviewersData.find((rr) => rr.reviewId === review.id)
                    ?.reviewers || [];

            return matchingRespondents.map((respondent) => ({
                cycle,
                review,
                respondent,
                ratee,
                reviewers,
            }));
        });
    }, [
        reviewRespondentsData,
        activeReviewsData,
        activeCyclesData,
        reviewRatees,
        reviewReviewersData,
        currentUser.user.id,
        isMyTeamSurveys,
    ]);

    const pendingSurveys = useMemo(() => {
        return displayedSurveysData
            .filter(
                (c) =>
                    c.respondent?.responseStatus === ResponseStatus.PENDING ||
                    c.respondent?.responseStatus === ResponseStatus.IN_PROGRESS,
            )
            .sort((a, b) => (a.review?.id ?? 0) - (b.review?.id ?? 0));
    }, [displayedSurveysData]);

    const completedSurveys = useMemo(() => {
        return displayedSurveysData
            .filter(
                (c) =>
                    c.respondent?.responseStatus === ResponseStatus.COMPLETED,
            )
            .sort((a, b) => (a.review?.id ?? 0) - (b.review?.id ?? 0));
    }, [displayedSurveysData]);

    const selfAssessmentSurveysCount = useMemo(() => {
        return displayedSurveysData.filter(
            (c) =>
                c.respondent?.category === RespondentCategory.SELF_ASSESSMENT,
        ).length;
    }, [displayedSurveysData]);

    return (
        <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Surveys Dashboard Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                        {isMyTeamSurveys
                            ? 'My Team Surveys Dashboard'
                            : isMySurveys
                              ? 'My Surveys Dashboard'
                              : '360° Feedback Surveys Dashboard'}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {isMyTeamSurveys
                            ? 'Track feedback surveys for your team within the current cycle. There are '
                            : 'Complete feedback surveys for your colleagues within the current cycle. You have '}
                        <span className="font-medium text-foreground">
                            {pendingSurveys.length}
                        </span>{' '}
                        {isMyTeamSurveys
                            ? 'active surveys in progress.'
                            : 'active surveys to complete.'}
                    </p>
                </div>
            </div>

            {/* Survey stats */}
            <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-4 md:gap-6 justify-around">
                <StatisticsCard
                    title={`Pending Surveys`}
                    value={formatNumber(pendingSurveys.length) ?? '-'}
                    icon={Hourglass}
                    color="text-yellow-300"
                    width={300}
                />
                <StatisticsCard
                    title={`Completed Surveys`}
                    value={formatNumber(completedSurveys.length) ?? '-'}
                    icon={SquareCheck}
                    color="text-lime-300"
                    width={300}
                />
                <StatisticsCard
                    title={`Self-Assessment Surveys`}
                    value={formatNumber(selfAssessmentSurveysCount) ?? '-'}
                    icon={UserRound}
                    color="text-indigo-300"
                    width={300}
                />
            </div>

            {/* Survey List Tabs */}
            <Tabs
                defaultValue={SurveyListTab.PENDING}
                className="w-full overflow-hidden"
            >
                <TabsList
                    variant="default"
                    className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto rounded-xl p-1"
                >
                    <TabsTrigger
                        value={SurveyListTab.PENDING}
                        className="rounded-xl text-sm whitespace-nowrap text-center"
                    >
                        Pending
                    </TabsTrigger>
                    <TabsTrigger
                        value={SurveyListTab.COMPLETED}
                        className="rounded-xl text-sm whitespace-nowrap text-center"
                    >
                        Completed
                    </TabsTrigger>
                </TabsList>

                {/* Pending Surveys */}
                <TabsContent value={SurveyListTab.PENDING}>
                    <Card className="border-[0px]">
                        <CardHeader className="px-2">
                            <CardTitle className="text-foreground text-lg break-words">
                                Pending Surveys
                            </CardTitle>
                            <CardDescription className="text-base">
                                These{' '}
                                <span className="font-semibold text-foreground">
                                    {formatNumber(pendingSurveys.length)}
                                </span>{' '}
                                {pendingSurveys.length !== 1
                                    ? 'surveys are'
                                    : 'survey is'}{' '}
                                awaiting your feedback.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-6">
                                {pendingSurveys.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground">
                                        No pending surveys
                                    </div>
                                ) : (
                                    pendingSurveys.map((survey) => {
                                        const isCurrentUserRespondent =
                                            survey.respondent?.respondentId ===
                                            currentUser.user?.id;
                                        return (
                                            <div
                                                key={survey.review?.id}
                                                className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 p-4 rounded-2xl border border-border shadow-sm w-full overflow-hidden"
                                            >
                                                <div className="flex flex-col sm:flex-row items-center gap-4 text-center min-w-[100px] w-full">
                                                    <Avatar className="h-20 w-20 border bg-muted shrink-0">
                                                        <AvatarImage
                                                            className="object-cover"
                                                            src={
                                                                survey.ratee
                                                                    ?.avatarUrl ||
                                                                ''
                                                            }
                                                            alt={
                                                                survey.review
                                                                    ?.rateeFullName
                                                            }
                                                        />
                                                        <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                                            {getUserInitialsFromFullName(
                                                                survey.review
                                                                    ?.rateeFullName ??
                                                                    '',
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1 flex-1 min-w-0 w-full">
                                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                            <p className="font-medium text-lg text-foreground break-words">
                                                                {
                                                                    survey
                                                                        .review
                                                                        ?.rateeFullName
                                                                }
                                                            </p>
                                                            <CategoryBadge
                                                                category={
                                                                    survey
                                                                        .respondent
                                                                        ?.category ||
                                                                    RespondentCategory.TEAM
                                                                }
                                                            />
                                                        </div>
                                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-muted-foreground text-base">
                                                            <span className="break-words">
                                                                {
                                                                    survey
                                                                        .review
                                                                        ?.rateePositionTitle
                                                                }
                                                            </span>
                                                            {survey.review
                                                                ?.teamTitle && (
                                                                <>
                                                                    <span className="hidden sm:inline">
                                                                        •
                                                                    </span>
                                                                    <span className="break-words">
                                                                        {
                                                                            survey
                                                                                .review
                                                                                .teamTitle
                                                                        }
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-row items-center gap-x-8 gap-y-2 w-full flex-wrap justify-center sm:justify-end">
                                                    <div className="flex items-center gap-x-1 gap-y-0 text-base flex-wrap justify-center lg:justify-end">
                                                        <AlarmClock className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                        <span className="text-muted-foreground whitespace-nowrap">
                                                            Due
                                                        </span>
                                                        <span className="font-medium text-foreground whitespace-nowrap">
                                                            {format(
                                                                survey.cycle
                                                                    ?.responseDeadline ||
                                                                    survey.cycle
                                                                        ?.reviewDeadline ||
                                                                    survey.cycle
                                                                        ?.endDate ||
                                                                    '',
                                                                'MMM dd, yyyy',
                                                            )}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        asChild
                                                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full md:w-auto min-w-[120px]"
                                                    >
                                                        <Link
                                                            href={`/feedback360/surveys/${survey.review?.id}`}
                                                        >
                                                            {isCurrentUserRespondent ? (
                                                                <Pencil className="h-4 w-4" />
                                                            ) : (
                                                                <Eye className="h-4 w-4" />
                                                            )}
                                                            {isCurrentUserRespondent
                                                                ? 'Review'
                                                                : 'View'}
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Completed Surveys */}
                <TabsContent value={SurveyListTab.COMPLETED}>
                    <Card className="border-[0px]">
                        <CardHeader className="px-2">
                            <CardTitle className="text-foreground text-lg break-words">
                                Completed Surveys
                            </CardTitle>
                            <CardDescription className="text-base">
                                Your submitted{' '}
                                <span className="font-semibold text-foreground">
                                    {formatNumber(completedSurveys.length)}
                                </span>{' '}
                                {completedSurveys.length !== 1
                                    ? 'feedback surveys'
                                    : 'feedback survey'}
                                .
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-2 sm:px-6">
                            <div className="space-y-6">
                                {completedSurveys.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground">
                                        No completed surveys yet
                                    </div>
                                ) : (
                                    completedSurveys.map((survey) => (
                                        <div
                                            key={`${survey.review?.id}-${survey.respondent?.id}`}
                                            className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 p-4 rounded-2xl border border-border shadow-sm w-full overflow-hidden"
                                        >
                                            <div className="flex flex-col sm:flex-row items-center gap-4 text-center min-w-[100px] w-full">
                                                <Avatar className="h-20 w-20 border bg-muted shrink-0">
                                                    <AvatarImage
                                                        className="object-cover"
                                                        src={
                                                            survey.ratee
                                                                ?.avatarUrl ||
                                                            ''
                                                        }
                                                        alt={
                                                            survey.review
                                                                ?.rateeFullName
                                                        }
                                                    />
                                                    <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                                        {getUserInitialsFromFullName(
                                                            survey.review
                                                                ?.rateeFullName ??
                                                                '',
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1 flex-1 min-w-0 w-full">
                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                        <p className="font-medium text-lg text-foreground break-words">
                                                            {
                                                                survey.review
                                                                    ?.rateeFullName
                                                            }
                                                        </p>
                                                        <CategoryBadge
                                                            category={
                                                                survey
                                                                    .respondent
                                                                    ?.category ||
                                                                RespondentCategory.TEAM
                                                            }
                                                        />
                                                    </div>
                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-muted-foreground text-base">
                                                        <span className="break-words">
                                                            {
                                                                survey.review
                                                                    ?.rateePositionTitle
                                                            }
                                                        </span>
                                                        {survey.review
                                                            ?.teamTitle && (
                                                            <>
                                                                <span className="hidden sm:inline">
                                                                    •
                                                                </span>
                                                                <span className="break-words">
                                                                    {
                                                                        survey
                                                                            .review
                                                                            .teamTitle
                                                                    }
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-row items-center gap-2 w-full flex-wrap justify-center sm:justify-end">
                                                <div className="flex items-center gap-x-1 gap-y-0 text-base flex-wrap justify-center lg:justify-end">
                                                    <CheckCircle className="text-muted-foreground h-4 w-4 shrink-0" />
                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                        Completed
                                                    </span>
                                                    <span className="text-foreground whitespace-nowrap">
                                                        {format(
                                                            survey.respondent
                                                                ?.respondedAt ??
                                                                '',
                                                            'MMM dd, yyyy',
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </Card>
    );
}
