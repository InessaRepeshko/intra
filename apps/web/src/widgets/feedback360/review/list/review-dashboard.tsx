'use client';

import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    AlarmClock,
    Archive,
    Eye,
    FilePlus2,
    FileUser,
    Hourglass,
    MessageCircle,
    Pencil,
    SquareCheck,
    UserRound,
} from 'lucide-react';
import Link from 'next/link';

import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import { CycleStage } from '@entities/feedback360/cycle/model/types';
import {
    useReviewAnswersCountsQuery,
    useReviewCycleTitlesQuery,
    useReviewQuestionCountsQuery,
    useReviewRespondentCountsQuery,
    useReviewReviewerCountsQuery,
    useReviewsQuery,
} from '@entities/feedback360/review/api/review.queries';
import type { Review } from '@entities/feedback360/review/model/mappers';
import {
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
    SortDirection,
} from '@entities/feedback360/review/model/types';
import {
    StageBadge,
    stageConfig,
} from '@entities/feedback360/review/ui/stage-badge';
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
import { Progress } from '@shared/components/ui/progress';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@shared/components/ui/tabs';
import { formatNumber } from '@shared/lib/utils/format-number';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';
import { StatisticsCard } from '@shared/ui/statistics-card';

export function ReviewDashboard({
    currentUser,
    isMyReviews = false,
    isTeamReviews = false,
}: {
    currentUser: AuthContextType;
    isMyReviews?: boolean;
    isTeamReviews?: boolean;
}) {
    const [activeTab, setActiveTab] = useState<ReviewStage>(
        ReviewStage.IN_PROGRESS,
    );

    const { data: allReviewsData = [] } = useReviewsQuery();
    const { data: allCycles = [] } = useCyclesQuery();

    // Fetch question, answer, respondent and reviewer counts for all reviews
    const reviewIds = useMemo(
        () => allReviewsData.map((r) => r.id),
        [allReviewsData],
    );

    const { answerCounts, isLoading: isAnswerCountsLoading } =
        useReviewAnswersCountsQuery(reviewIds);
    const { respondentCounts, isLoading: isRespondentCountsLoading } =
        useReviewRespondentCountsQuery(reviewIds);

    // Ratee users for dashboard cards
    const rateeIds = useMemo(
        () => Array.from(new Set(allReviewsData.map((r) => r.rateeId))),
        [allReviewsData],
    );
    const { data: rateeUsers = [] } = useUsersByUserIdsQuery(rateeIds);
    const rateeUserById = useMemo(
        () => new Map(rateeUsers.map((u) => [u.id, u])),
        [rateeUsers],
    );

    const currentCycles = useMemo(() => {
        return allCycles.filter((c) => c.stage === CycleStage.ACTIVE);
    }, [allCycles]);

    const currentCycleIds = useMemo(() => {
        return currentCycles.map((c) => c.id);
    }, [currentCycles]);

    // Bucket all reviews by stage for the dashboard
    const reviewsByStage = useMemo(() => {
        const buckets = Object.fromEntries(
            REVIEW_STAGE_ENUM_VALUES.map((s) => [s, [] as Review[]]),
        ) as Record<ReviewStage, Review[]>;
        allReviewsData
            .filter((r) => currentCycleIds.includes(r.cycleId || -1))
            .filter((r) => {
                if (currentUser.isAdmin || currentUser.isHR) {
                    return r;
                }
                if (currentUser.isManager) {
                    return r.managerId === currentUser.user.id ||
                        r.rateeId === currentUser.user.id
                        ? r
                        : null;
                }
                if (currentUser.isEmployee) {
                    return r.rateeId === currentUser.user.id ? r : null;
                }
                return null;
            })
            .filter((r) => {
                if (isMyReviews) {
                    return r.rateeId === currentUser.user.id ? r : null;
                }
                if (isTeamReviews) {
                    return r.managerId === currentUser.user.id ? r : null;
                }
                return r;
            })
            .filter((r): r is Review => r !== null)
            .sort((a, b) => a.id - b.id)
            .forEach((r) => {
                if (r.stage && buckets[r.stage]) buckets[r.stage].push(r);
            });
        return buckets;
    }, [allReviewsData, currentCycleIds]);

    const dataExist = Object.values(reviewsByStage).some((reviews) => reviews.length > 0);

    return (
        <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Reviews Dashboard Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                        {isMyReviews
                            ? 'My Reviews Dashboard'
                            : isTeamReviews
                                ? 'My Team Reviews Dashboard'
                                : 'All Reviews Dashboard'}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Overview of reviews across all stages. You have{' '}
                        <span className="font-medium text-foreground">
                            {reviewsByStage[ReviewStage.WAITING_TO_START]
                                .length +
                                reviewsByStage[ReviewStage.IN_PROGRESS].length}
                        </span>{' '}
                        reviews in progress.
                    </p>
                </div>
            </div>

            {/* Review stats */}
            <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-4 md:gap-6 justify-around">
                <StatisticsCard
                    title={`New`}
                    value={
                        formatNumber(reviewsByStage[ReviewStage.NEW].length) ??
                        '-'
                    }
                    icon={FilePlus2}
                    textColor="text-blue-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Self-assessment`}
                    value={
                        formatNumber(
                            reviewsByStage[ReviewStage.SELF_ASSESSMENT].length,
                        ) ?? '-'
                    }
                    icon={UserRound}
                    textColor="text-teal-300"
                    width={250}
                />
                <StatisticsCard
                    title={`In Progress`}
                    value={
                        formatNumber(
                            reviewsByStage[ReviewStage.WAITING_TO_START]
                                .length +
                            reviewsByStage[ReviewStage.IN_PROGRESS].length,
                        ) ?? '-'
                    }
                    icon={Hourglass}
                    textColor="text-amber-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Finished`}
                    value={
                        formatNumber(
                            reviewsByStage[ReviewStage.FINISHED].length +
                            reviewsByStage[ReviewStage.PREPARING_REPORT]
                                .length +
                            reviewsByStage[ReviewStage.PROCESSING_BY_HR]
                                .length,
                        ) ?? '-'
                    }
                    icon={SquareCheck}
                    textColor="text-purple-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Published`}
                    value={
                        formatNumber(
                            reviewsByStage[ReviewStage.PUBLISHED].length +
                            reviewsByStage[ReviewStage.ANALYSIS].length,
                        ) ?? '-'
                    }
                    icon={FileUser}
                    textColor="text-lime-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Archived`}
                    value={
                        formatNumber(
                            reviewsByStage[ReviewStage.ARCHIVED].length +
                            reviewsByStage[ReviewStage.CANCELED].length,
                        ) ?? '-'
                    }
                    icon={Archive}
                    textColor="text-zinc-300"
                    width={200}
                />
            </div>

            {/* Review List Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as ReviewStage)}
                className="w-full overflow-hidden"
            >
                <TabsList className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto rounded-xl p-1" variant="default">
                    {REVIEW_STAGE_ENUM_VALUES.map((stage) => (
                        <TabsTrigger
                            key={stage}
                            value={stage}
                            className="rounded-xl text-sm whitespace-nowrap text-center"
                        >
                            {stageConfig[stage].label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {REVIEW_STAGE_ENUM_VALUES.map((stage) => (
                    <TabsContent key={stage} value={stage}>
                        <Card className="border-[0px]">
                            <CardHeader className="px-2">
                                <CardTitle className="text-foreground text-lg break-words">
                                    {stageConfig[stage].label} Reviews
                                </CardTitle>
                                <CardDescription className="text-base">
                                    A total of{' '}
                                    <span className="font-semibold text-foreground">
                                        {reviewsByStage[stage].length}
                                    </span>{' '}
                                    {reviewsByStage[stage].length !== 1
                                        ? 'reviews are'
                                        : 'review is'}{' '}
                                    currently at the {stageConfig[stage].label}{' '}
                                    stage.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="px-2 sm:px-6">
                                <div className="space-y-6">
                                    {reviewsByStage[stage].length === 0 ? (
                                        <div className="py-12 text-center text-muted-foreground">
                                            No reviews in this stage
                                        </div>
                                    ) : (
                                        reviewsByStage[stage].map((review) => {
                                            const ratee = rateeUserById.get(
                                                review.rateeId,
                                            );
                                            const cycle = currentCycles.find(
                                                (c) => c.id === review.cycleId,
                                            );
                                            return (
                                                <div
                                                    key={review.id}
                                                    className="flex flex-col lg:flex-row !flex-wrap items-stretch lg:items-center justify-between gap-6 p-4 rounded-2xl border border-border shadow-sm w-full overflow-hidden"
                                                >
                                                    <div className="flex flex-col sm:flex-row items-center gap-2 text-center min-w-[100px] w-full">
                                                        <Avatar className="h-20 w-20 border bg-muted shrink-0">
                                                            <AvatarImage
                                                                className="object-cover"
                                                                src={
                                                                    ratee?.avatarUrl ||
                                                                    ''
                                                                }
                                                                alt={
                                                                    review.rateeFullName
                                                                }
                                                            />
                                                            <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                                                {getUserInitialsFromFullName(
                                                                    review.rateeFullName,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="space-y-1 flex-1 min-w-0 w-full">
                                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                                <p className="font-medium text-lg text-foreground break-words">
                                                                    {
                                                                        review.rateeFullName
                                                                    }
                                                                </p>
                                                                <StageBadge
                                                                    stage={
                                                                        review.stage
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-muted-foreground text-base">
                                                                <span className="break-words">
                                                                    {
                                                                        review.rateePositionTitle
                                                                    }
                                                                </span>
                                                                {review.teamTitle && (
                                                                    <>
                                                                        <span className="hidden sm:inline">
                                                                            •
                                                                        </span>
                                                                        <span className="break-words">
                                                                            {
                                                                                review.teamTitle
                                                                            }
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row items-center gap-2 w-full flex-wrap justify-between lg:justify-end">
                                                        <Progress
                                                            value={
                                                                ((answerCounts[
                                                                    review.id
                                                                ] ?? 0) /
                                                                    (respondentCounts[
                                                                        review.id
                                                                    ] ?? 0)) *
                                                                100
                                                            }
                                                            className="w-[200px] max-w-full rounded-full self-center"
                                                        />
                                                        <div className="flex flex-row items-center gap-x-1 gap-y-0 text-base flex-wrap justify-center lg:justify-end">
                                                            <MessageCircle className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium text-foreground whitespace-nowrap flex gap-1">
                                                            {answerCounts[
                                                                review.id
                                                            ] ?? 0}
                                                            <span className="text-muted-foreground">
                                                                /
                                                            </span>
                                                            {respondentCounts[
                                                                review.id
                                                            ] ?? 0}
                                                            </span>
                                                            <span className="text-muted-foreground whitespace-nowrap">
                                                                answers
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-row items-center gap-x-1 gap-y-0 text-base flex-wrap justify-center lg:justify-end">
                                                            <AlarmClock className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground whitespace-nowrap">
                                                                Due
                                                            </span>
                                                            <span className="font-medium text-foreground whitespace-nowrap">
                                                                {format(
                                                                    cycle?.responseDeadline ||
                                                                    cycle?.reviewDeadline ||
                                                                    cycle?.endDate ||
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
                                                                href={`/feedback360/reviews/${review.id}`}
                                                            >
                                                                {currentUser.isAdmin ||
                                                                    currentUser.isHR ? (
                                                                    <Pencil className="h-4 w-4" />
                                                                ) : (
                                                                    <Eye className="h-4 w-4" />
                                                                )}
                                                                {currentUser.isAdmin ||
                                                                    currentUser.isHR
                                                                    ? 'Edit'
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
                ))}
            </Tabs>
        </Card>
    );
}
