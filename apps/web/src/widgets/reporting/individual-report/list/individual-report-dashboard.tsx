'use client';

import { format } from 'date-fns';
import {
    Archive,
    Calendar,
    Eye,
    FileUser,
    Hourglass,
    SquareCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import { CycleStage } from '@entities/feedback360/cycle/model/types';
import { useReviewsByIdsQuery } from '@entities/feedback360/review/api/review.queries';
import {
    StageBadge,
    stageConfig,
} from '@entities/feedback360/review/ui/stage-badge';
import { type AuthContextType } from '@entities/identity/user/model/types';
import {
    useRateeFullNamesQuery,
    useRateePositionTitlesQuery,
    useRateeTeamTitlesQuery,
    useReportsQuery,
    useReviewStagesQuery,
} from '@entities/reporting/individual-report/api/individual-report.queries';
import type { Report } from '@entities/reporting/individual-report/model/mappers';
import {
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
} from '@entities/reporting/individual-report/model/types';
import { Avatar, AvatarFallback, AvatarImage } from '@shared/components/ui/avatar';
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
import { useUsersByUserIdsQuery } from '@entities/identity/user/api/user.queries';

type CycleTabType = {
    value: number;
    label: string;
};

export function IndividualReportDashboard({
    currentUser,
    isMyReports = false,
    isTeamReports = false,
}: {
    currentUser: AuthContextType;
    isMyReports?: boolean;
    isTeamReports?: boolean;
}) {
    const [activeReviewStageTab, setActiveReviewStageTab] = useState<
        ReviewStage | 'ALL'
    >('ALL');
    const reviewStageOptions: (ReviewStage | 'ALL')[] = [
        'ALL',
        ...REVIEW_STAGE_ENUM_VALUES,
    ];

    const { data: allReportsData = [] } = useReportsQuery({});
    const { data: allCycles = [] } = useCyclesQuery();

    const cycleOptions: CycleTabType[] = useMemo(() => {
        return [
            {
                value: -1,
                label: 'All cycles',
            },
            ...allCycles.map((cycle) => ({
                value: cycle.id,
                label: cycle.title,
            })),
            {
                value: 0,
                label: 'No cycle',
            },
        ];
    }, [allCycles]);

    const [activeCycleTab, setActiveCycleTab] = useState<CycleTabType>(
        cycleOptions[0],
    );

    const allReviewIds = useMemo(
        () => allReportsData.map((r) => r.reviewId),
        [allReportsData],
    );

    const { reviews: allReportReviews } = useReviewsByIdsQuery(allReviewIds);

    const rateeIds = useMemo(
        () => Object.values(allReportReviews).map((r) => r.rateeId),
        [allReportReviews],
    );

    const { data: rateeUsers = [] } = useUsersByUserIdsQuery(rateeIds);
    const allReviewRateeUsers = useMemo(
        () => Object.fromEntries(rateeUsers.map((u) => [u.id, u])),
        [rateeUsers],
    );

    const reportsByStage = useMemo(() => {
        const buckets = Object.fromEntries(
            REVIEW_STAGE_ENUM_VALUES.map((s) => [s, [] as Report[]]),
        ) as Record<ReviewStage | 'ALL', Report[]>;

        const filteredReports = allReportsData
            .filter((r) => {
                const review = allReportReviews[r.reviewId];
                if (currentUser.isAdmin || currentUser.isHR) {
                    return r;
                }
                if (currentUser.isManager) {
                    return review?.managerId === currentUser.user.id ||
                        review?.rateeId === currentUser.user.id
                        ? r
                        : null;
                }
                if (currentUser.isEmployee) {
                    return review?.rateeId === currentUser.user.id ? r : null;
                }
                return null;
            })
            .filter((r) => {
                if (!r) return false;
                const review = allReportReviews[r.reviewId];
                if (isMyReports) {
                    return review?.rateeId === currentUser.user.id ? r : null;
                }
                if (isTeamReports) {
                    return review?.managerId === currentUser.user.id
                        ? r
                        : null;
                }
                return r;
            })
            .filter((r): r is Report => r !== null && r !== undefined)
            .sort((a, b) => b.id - a.id);

        buckets['ALL'] = filteredReports;
        buckets['NONE'] = filteredReports.filter((r) => r.cycleId === null || r.cycleId === undefined);
        filteredReports.forEach((r) => {
            const stage = allReportReviews[r.reviewId]?.stage;
            if (stage && buckets[stage]) buckets[stage].push(r);
        });
        return buckets;
    }, [
        allReportsData,
        allReportReviews,
        currentUser,
        isMyReports,
        isTeamReports,
    ]);

    const totalFilteredReports = reportsByStage['ALL']?.length ?? 0;

    const preparingCount =
        (reportsByStage[ReviewStage.FINISHED]?.length ?? 0) +
        (reportsByStage[ReviewStage.PREPARING_REPORT]?.length ?? 0);
    const processingCount =
        reportsByStage[ReviewStage.PROCESSING_BY_HR]?.length ?? 0;
    const publishedCount =
        (reportsByStage[ReviewStage.PUBLISHED]?.length ?? 0) +
        (reportsByStage[ReviewStage.ANALYSIS]?.length ?? 0);
    const archivedCount =
        (reportsByStage[ReviewStage.ARCHIVED]?.length ?? 0) +
        (reportsByStage[ReviewStage.CANCELED]?.length ?? 0);

    return (
        <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Reports Dashboard Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                        {isMyReports
                            ? 'My Reports Dashboard'
                            : isTeamReports
                              ? 'My Team Reports Dashboard'
                              : 'All Reports Dashboard'}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Overview of individual reports for active cycles. You
                        have{' '}
                        <span className="font-medium text-foreground">
                            {totalFilteredReports}
                        </span>{' '}
                        {totalFilteredReports === 1 ? 'report' : 'reports'} (
                        <span className="font-medium text-foreground">
                            {publishedCount}
                        </span>{' '}
                        published).
                    </p>
                </div>
            </div>

            {/* Report stats */}
            <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-4 md:gap-6 justify-around">
                <StatisticsCard
                    title={`Preparing`}
                    value={formatNumber(preparingCount) ?? '-'}
                    icon={Hourglass}
                    color="text-amber-300"
                    width={250}
                />
                <StatisticsCard
                    title={`Processing`}
                    value={formatNumber(processingCount) ?? '-'}
                    icon={SquareCheck}
                    color="text-purple-300"
                    width={250}
                />
                <StatisticsCard
                    title={`Published`}
                    value={formatNumber(publishedCount) ?? '-'}
                    icon={FileUser}
                    color="text-lime-300"
                    width={250}
                />
                <StatisticsCard
                    title={`Archived`}
                    value={formatNumber(archivedCount) ?? '-'}
                    icon={Archive}
                    color="text-zinc-300"
                    width={250}
                />
            </div>

            <div>
            {/* Cycles Tabs */}
            <Tabs
                value={activeCycleTab.label}
                onValueChange={(v) =>
                    setActiveCycleTab(
                        cycleOptions.find(
                            (c) => c.label === v,
                        ) as CycleTabType,
                    )
                }
                className="w-full overflow-hidden mb-2"
            >
                <TabsList
                    variant="default"
                    className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto rounded-xl p-1"
                >
                    {cycleOptions.map((cycle) => (
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

            {/* Review Stages Tabs */}
            <Tabs
                value={activeReviewStageTab}
                onValueChange={(v) =>
                    setActiveReviewStageTab(v as ReviewStage | 'ALL')
                }
                className="w-full overflow-hidden"
            >
                <TabsList
                    variant="default"
                    className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto rounded-xl p-1"
                >
                    {reviewStageOptions.map((stage) => (
                        <TabsTrigger
                            key={stage}
                            value={stage}
                            className="rounded-xl text-sm whitespace-nowrap text-center"
                        >
                            {stage === 'ALL'
                                ? 'All stages'
                                : stageConfig[stage].label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {reviewStageOptions.map((stage) => {
                    const stageLabel =
                        stage === 'ALL'
                            ? 'All stages'
                            : stageConfig[stage].label;
                    const reports = reportsByStage[stage]
                    .filter((r) =>
                            activeReviewStageTab === 'ALL' ? r : allReportReviews[r.reviewId]?.stage === activeReviewStageTab
                        )
                    .filter((r) =>
                        activeCycleTab.value === -1 ? r :
                            activeCycleTab.value === 0 ? (r.cycleId === null || r.cycleId === undefined) :
                                r.cycleId === activeCycleTab.value ? r : null
                    )
                    .filter((r): r is Report => r !== null && r !== undefined);

                    return (
                        <TabsContent key={stage} value={stage}>
                            <Card className="border-[0px]">
                                <CardHeader className="px-2">
                                    <CardTitle className="text-foreground text-lg break-words">
                                        {stageLabel} Reports
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        A total of{' '}
                                        <span className="font-semibold text-foreground">
                                            {reports.length}
                                        </span>{' '}
                                        {reports.length !== 1
                                            ? 'reports are'
                                            : 'report is'}{' '}
                                        currently at the {stageLabel}{' '}
                                        {stage === 'ALL' ? '' : 'stage'} for the{' '}
                                        {activeCycleTab.label}.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="space-y-6">
                                        {reports.length === 0 ? (
                                            <div className="py-12 text-center text-muted-foreground">
                                                No reports in this stage
                                            </div>
                                        ) : (
                                            reports.map((report) => {
                                                const rateeId = allReportReviews[report.reviewId].rateeId;
                                                const rateeFullName =
                                                    allReviewRateeUsers[rateeId]?.fullName ?? `${allReviewRateeUsers[rateeId]?.lastName} ${allReviewRateeUsers[rateeId]?.firstName}`;
                                                const teamTitle =
                                                    allReviewRateeUsers[rateeId]?.teamTitle ?? null;
                                                const positionTitle =
                                                    allReviewRateeUsers[rateeId]?.positionTitle ?? null;
                                                const cycleTitle = report.cycleId
                                                    ? allCycles.find((c) => c.id === report.cycleId)?.title
                                                    : null;
                                                const avatarUrl = allReviewRateeUsers[rateeId]?.avatarUrl ?? '';

                                                return (
                                                    <div
                                                        key={report.id}
                                                        className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 p-4 rounded-2xl border border-border shadow-sm w-full overflow-hidden"
                                                    >
                                                        <div className="flex flex-col sm:flex-row items-center gap-2 text-center min-w-[100px] w-full">
                                                            <Avatar className="h-20 w-20 border bg-muted shrink-0">
                                                                <AvatarImage
                                                                    className="object-cover"
                                                                    src={avatarUrl}
                                                                    alt={rateeFullName}
                                                                />
                                                                <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                                                    {getUserInitialsFromFullName(rateeFullName)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="space-y-1 flex-1 min-w-0 w-full">
                                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                                    <p className="font-medium text-lg text-foreground break-words">
                                                                        <span className="text-muted-foreground border border-border rounded-xl px-1 bg-neutral-100">
                                                                            #
                                                                            {report.id}
                                                                        </span>{' '}
                                                                        {rateeFullName}
                                                                    </p>
                                                                    <StageBadge
                                                                        stage={allReportReviews[report.reviewId]?.stage}
                                                                    />
                                                                </div>
                                                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-muted-foreground text-base">
                                                                    {positionTitle && (
                                                                        <span className="break-words">
                                                                            {
                                                                                positionTitle
                                                                            }
                                                                        </span>
                                                                    )}
                                                                    {teamTitle && (
                                                                        <>
                                                                            {positionTitle && (
                                                                                <span className="hidden sm:inline">
                                                                                    •
                                                                                </span>
                                                                            )}
                                                                            <span className="break-words">
                                                                                {
                                                                                    teamTitle
                                                                                }
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                {cycleTitle && (
                                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-muted-foreground text-base">
                                                                        <span className="break-words">
                                                                            {
                                                                                cycleTitle
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-row items-center gap-x-8 gap-y-2 w-full flex-wrap justify-between lg:justify-end">
                                                            <div className="flex flex-row items-center gap-x-1 gap-y-0 text-base flex-wrap justify-center lg:justify-end">
                                                                <Calendar className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                <span className="text-muted-foreground whitespace-nowrap">
                                                                    Generated
                                                                </span>
                                                                <span className="font-medium text-foreground whitespace-nowrap">
                                                                    {format(
                                                                        report.createdAt,
                                                                        'MMM dd, yyyy',
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <Button
                                                                asChild
                                                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full md:w-auto min-w-[120px]"
                                                            >
                                                                <Link
                                                                    href={`/reporting/individual-reports/${report.id}`}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                    View
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
                    );
                })}
            </Tabs>
            </div>
        </Card>
    );
}
