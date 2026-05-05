'use client';

import { format } from 'date-fns';
import {
    AlarmClock,
    Eye,
    Hourglass,
    Pencil,
    PencilIcon,
    SquareCheck,
    UserRound,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
    ResponseStatusBadge,
    responseStatusConfig,
} from '@/entities/feedback360/respondent/ui/response-status-badge';
import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import { useAllReviewsRespondentsQuery } from '@entities/feedback360/respondent/api/respondent.queries';
import { CategoryBadge } from '@entities/feedback360/respondent/ui/category-badge';
import { useReviewsQuery } from '@entities/feedback360/review/api/review.queries';
import { useAllReviewsReviewersQuery } from '@entities/feedback360/reviewer/api/reviewer.queries';
import { type SurveyInfo } from '@entities/feedback360/survey/model/mappers';
import {
    RespondentCategory,
    RESPONSE_STATUS_ENUM_VALUES,
    ResponseStatus,
    ReviewStage,
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

type CycleTabType = {
    value: number;
    label: string;
};

export function SurveyDashboard({
    currentUser,
    isMySurveys = false,
    isMyTeamSurveys = false,
}: {
    currentUser: AuthContextType;
    isMySurveys?: boolean;
    isMyTeamSurveys?: boolean;
}) {
    const [activeResponseStatusTab, setActiveResponseStatusTab] = useState<
        ResponseStatus | 'ALL'
    >('ALL');
    const responseStatusTabOptions = ['ALL', ...RESPONSE_STATUS_ENUM_VALUES];

    const { data: allReviewsData = [] } = useReviewsQuery();
    const { data: allCyclesData = [] } = useCyclesQuery();

    const cycleTabOptions: CycleTabType[] = useMemo(() => {
        return [
            {
                value: -1,
                label: 'All cycles',
            },
            ...allCyclesData.map((cycle) => ({
                value: cycle.id,
                label: cycle.title,
            })),
            {
                value: 0,
                label: 'No cycle',
            },
        ];
    }, [allCyclesData]);
    const [activeCycleTab, setActiveCycleTab] = useState<CycleTabType>(
        cycleTabOptions[0],
    );

    const allReviewIds = useMemo(
        () => allReviewsData.map((r) => r.id),
        [allReviewsData],
    );

    const { data: reviewRespondentsData } =
        useAllReviewsRespondentsQuery(allReviewIds);
    const { data: reviewReviewersData } =
        useAllReviewsReviewersQuery(allReviewIds);

    const rateeIds = useMemo(
        () => Array.from(new Set(allReviewsData.map((r) => r.rateeId))),
        [allReviewsData],
    );

    const { data: reviewRatees } = useUsersByUserIdsQuery(rateeIds);

    const displayedSurveysData = useMemo(() => {
        return reviewRespondentsData.flatMap((r) => {
            const review = allReviewsData.find((rev) => rev.id === r.reviewId);
            if (!review) return [];

            const matchingRespondents = isMyTeamSurveys
                ? review.managerId === currentUser.user.id
                    ? r.respondents
                    : []
                : isMySurveys
                  ? r.respondents.filter(
                        (re) => re.respondentId === currentUser.user.id,
                    )
                  : [];

            if (matchingRespondents.length === 0) return [];

            const cycle = allCyclesData?.find((c) => c.id === review.cycleId);
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
        allReviewsData,
        allCyclesData,
        reviewRatees,
        reviewReviewersData,
        currentUser.user.id,
        isMyTeamSurveys,
        isMySurveys,
    ]);

    // Bucket all surveys by stage for the dashboard
    const surveysByStatus = useMemo(() => {
        const surveys = displayedSurveysData.sort(
            (a, b) => (b.review?.id ?? 0) - (a.review?.id ?? 0),
        );
        const buckets = Object.fromEntries(
            RESPONSE_STATUS_ENUM_VALUES.map((s) => [s, [] as SurveyInfo[]]),
        ) as Record<ResponseStatus | 'ALL', SurveyInfo[]>;
        buckets['ALL'] = surveys;
        buckets['NONE'] = surveys.filter(
            (r) => r.review.cycleId === null || r.review.cycleId === undefined,
        );
        surveys.forEach((r) => {
            if (
                r.respondent?.responseStatus &&
                buckets[r.respondent?.responseStatus]
            ) {
                buckets[r.respondent?.responseStatus].push(r);
            }
        });

        return buckets;
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
                            {surveysByStatus[
                                ResponseStatus.PENDING
                            ]?.length.toString() ?? '0'}
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
                    title={`Pending`}
                    value={
                        surveysByStatus[
                            ResponseStatus.PENDING
                        ]?.length.toString() ?? '0'
                    }
                    icon={Hourglass}
                    color="text-yellow-300"
                    width={250}
                />
                <StatisticsCard
                    title={`In Progress`}
                    value={
                        surveysByStatus[
                            ResponseStatus.IN_PROGRESS
                        ]?.length.toString() ?? '0'
                    }
                    icon={PencilIcon}
                    color="text-orange-300"
                    width={250}
                />
                <StatisticsCard
                    title={`Completed`}
                    value={
                        surveysByStatus[
                            ResponseStatus.COMPLETED
                        ]?.length.toString() ?? '0'
                    }
                    icon={SquareCheck}
                    color="text-green-300"
                    width={250}
                />
                <StatisticsCard
                    title={`Self-Assessment`}
                    value={selfAssessmentSurveysCount.toString() ?? '0'}
                    icon={UserRound}
                    color="text-indigo-300"
                    width={250}
                />
            </div>

            <div>
                {/* Cycles Tabs */}
                <Tabs
                    value={activeCycleTab.label}
                    onValueChange={(v) =>
                        setActiveCycleTab(
                            cycleTabOptions.find(
                                (c) => c.label === v,
                            ) as CycleTabType,
                        )
                    }
                    className="w-full overflow-hidden mb-2"
                >
                    <TabsList
                        className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto rounded-xl p-1"
                        variant="default"
                    >
                        {cycleTabOptions.map((cycle) => (
                            <TabsTrigger
                                key={cycle.value}
                                value={cycle.label}
                                className="rounded-xl text-sm whitespace-nowrap text-center"
                            >
                                {cycle.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* Response Statuses Tabs */}
                <Tabs
                    value={activeResponseStatusTab}
                    onValueChange={(v) =>
                        setActiveResponseStatusTab(v as ResponseStatus | 'ALL')
                    }
                    className="w-full overflow-hidden"
                >
                    <TabsList
                        variant="default"
                        className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto rounded-xl p-1"
                    >
                        {responseStatusTabOptions.map((status) => (
                            <TabsTrigger
                                key={status}
                                value={status}
                                className="rounded-xl text-sm whitespace-nowrap text-center"
                            >
                                {status === 'ALL'
                                    ? 'All statuses'
                                    : responseStatusConfig[status].label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {responseStatusTabOptions.map((status) => {
                        const statusLabel =
                            status === 'ALL'
                                ? 'All statuses'
                                : responseStatusConfig[status].label;
                        const surveys = surveysByStatus[status]
                            .filter((r) =>
                                activeResponseStatusTab === 'ALL'
                                    ? r
                                    : r.respondent?.responseStatus ===
                                      activeResponseStatusTab,
                            )
                            .filter((r) =>
                                activeCycleTab.value === -1
                                    ? r
                                    : activeCycleTab.value === 0
                                      ? r.review?.cycleId === null ||
                                        r.review?.cycleId === undefined
                                      : r.review?.cycleId ===
                                          activeCycleTab.value
                                        ? r
                                        : null,
                            )
                            .filter(
                                (r): r is SurveyInfo =>
                                    r !== null && r !== undefined,
                            );

                        return (
                            <TabsContent value={status} key={status}>
                                <Card className="border-[0px] shadow-none">
                                    <CardHeader className="px-2">
                                        <CardTitle className="text-foreground text-lg break-words">
                                            {statusLabel} Surveys
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            A total of{' '}
                                            <span className="font-semibold text-foreground">
                                                {formatNumber(surveys.length)}
                                            </span>{' '}
                                            {surveys.length !== 1
                                                ? 'surveys are'
                                                : 'survey is'}{' '}
                                            currently {statusLabel} for the{' '}
                                            {activeCycleTab.label}.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="space-y-6">
                                            {surveys.length === 0 ? (
                                                <div className="py-12 text-center text-muted-foreground">
                                                    No surveys in this status
                                                    for the selected cycle
                                                </div>
                                            ) : (
                                                surveys.map((survey) => {
                                                    const isCurrentUserRespondent =
                                                        survey.respondent
                                                            ?.respondentId ===
                                                        currentUser.user?.id;
                                                    return (
                                                        <div
                                                            key={`${survey.cycle?.id}-${survey.review?.id}-${survey.respondent?.respondentId}`}
                                                            className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 p-4 rounded-2xl border border-border shadow-sm w-full overflow-hidden"
                                                        >
                                                            <div className="flex flex-col sm:flex-row items-center gap-4 text-center min-w-[100px] w-full">
                                                                <Avatar className="h-20 w-20 border bg-muted shrink-0">
                                                                    <AvatarImage
                                                                        className="object-cover"
                                                                        src={
                                                                            survey
                                                                                .ratee
                                                                                ?.avatarUrl ||
                                                                            ''
                                                                        }
                                                                        alt={
                                                                            survey
                                                                                .review
                                                                                ?.rateeFullName
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                                                        {getUserInitialsFromFullName(
                                                                            survey
                                                                                .review
                                                                                ?.rateeFullName,
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="space-y-1 flex-1 min-w-0 w-full">
                                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                                        <p className="font-medium text-lg text-foreground break-words">
                                                                            <span className="text-muted-foreground border border-border rounded-xl px-1 bg-neutral-100">
                                                                                #
                                                                                {
                                                                                    survey
                                                                                        .review
                                                                                        ?.id
                                                                                }
                                                                                -
                                                                                {
                                                                                    survey
                                                                                        .respondent
                                                                                        ?.id
                                                                                }
                                                                            </span>{' '}
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
                                                                                    ?.category
                                                                            }
                                                                        />
                                                                        <ResponseStatusBadge
                                                                            status={
                                                                                survey
                                                                                    .respondent
                                                                                    ?.responseStatus
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
                                                                        {survey
                                                                            .review
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
                                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-muted-foreground text-base">
                                                                        {survey
                                                                            .review
                                                                            .cycleId && (
                                                                            <>
                                                                                <span className="break-words">
                                                                                    {
                                                                                        survey
                                                                                            .cycle
                                                                                            ?.title
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
                                                                        {survey
                                                                            .review
                                                                            .cycleId &&
                                                                        survey
                                                                            .respondent
                                                                            .responseStatus ===
                                                                            ResponseStatus.COMPLETED
                                                                            ? 'Completed'
                                                                            : !survey
                                                                                    .review
                                                                                    .cycleId
                                                                              ? 'Created'
                                                                              : 'Due'}
                                                                    </span>
                                                                    <span className="font-medium text-foreground whitespace-nowrap">
                                                                        {survey
                                                                            .review
                                                                            .cycleId
                                                                            ? format(
                                                                                  survey
                                                                                      .cycle
                                                                                      ?.responseDeadline ||
                                                                                      survey
                                                                                          .cycle
                                                                                          ?.reviewDeadline ||
                                                                                      survey
                                                                                          .cycle
                                                                                          ?.endDate ||
                                                                                      '',
                                                                                  'MMM dd, yyyy',
                                                                              )
                                                                            : format(
                                                                                  survey
                                                                                      .review
                                                                                      .createdAt,
                                                                                  'MMM dd, yyyy',
                                                                              )}
                                                                    </span>
                                                                </div>
                                                                <Button
                                                                    asChild
                                                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full md:w-auto min-w-[120px]"
                                                                >
                                                                    {isCurrentUserRespondent &&
                                                                    survey
                                                                        .review
                                                                        .stage ===
                                                                        ReviewStage.IN_PROGRESS &&
                                                                    (survey
                                                                        .respondent
                                                                        .responseStatus ===
                                                                        ResponseStatus.PENDING ||
                                                                        survey
                                                                            .respondent
                                                                            .responseStatus ===
                                                                            ResponseStatus.IN_PROGRESS) ? (
                                                                        <Link
                                                                            href={`/feedback360/surveys/${survey.review?.id}`}
                                                                        >
                                                                            <Pencil className="h-4 w-4" />
                                                                            Review
                                                                        </Link>
                                                                    ) : (
                                                                        <Link
                                                                            href={`/feedback360/surveys/${survey.review?.id}`}
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                            View
                                                                        </Link>
                                                                    )}
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
                        );
                    })}
                </Tabs>
            </div>
        </Card>
    );
}
