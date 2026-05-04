'use client';

import { format } from 'date-fns';
import {
    Archive,
    Calendar,
    Eye,
    FileUser,
    Hourglass,
    MessageCircle,
    SquareCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import {
    StageBadge,
    stageConfig,
} from '@entities/feedback360/review/ui/stage-badge';
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
import {
    Avatar,
    AvatarFallback,
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
import { type AuthContextType } from '@entities/identity/user/model/types';
import { useReviewsByIdsQuery } from '@entities/feedback360/review/api/review.queries';
import { type Review } from '@entities/feedback360/review/model/mappers';

export function IndividualReportDashboard({
    currentUser,
    isMyReviews = false,
    isTeamReviews = false,
}: {
    currentUser: AuthContextType;
    isMyReviews?: boolean;
    isTeamReviews?: boolean;
}) {
    const [activeTab, setActiveTab] = useState<ReviewStage>(
        ReviewStage.PROCESSING_BY_HR,
    );

    const { data: allReportsData = [] } = useReportsQuery({});

    const allReviewIds = useMemo(
        () => allReportsData.map((r) => r.reviewId),
        [allReportsData],
    );

    const { 
        reviews: allReportReviews, 
        isError: isReportReviewsError, 
        isLoading: isReportReviewsLoading 
    } = useReviewsByIdsQuery(allReviewIds);
    const { rateeFullNames } = useRateeFullNamesQuery(allReviewIds);
    const { rateeTeamTitles } = useRateeTeamTitlesQuery(allReviewIds);
    const { rateePositionTitles } = useRateePositionTitlesQuery(allReviewIds);
    const { reviewStages } = useReviewStagesQuery(allReviewIds);

    const reportsByStage = useMemo(() => {
        const buckets = Object.fromEntries(
            REVIEW_STAGE_ENUM_VALUES.map((s) => [s, [] as Report[]]),
        ) as Record<ReviewStage, Report[]>;
        allReportsData
            // .filter((r) => currentCycleIds.includes(r.cycleId || -1))
            .filter((r) => {
                if (currentUser.isAdmin || currentUser.isHR) {
                    return r;
                }
                if (currentUser.isManager) {
                    return allReportReviews[r.reviewId]?.managerId === currentUser.user.id ||
                        allReportReviews[r.reviewId]?.rateeId === currentUser.user.id ? r : null;
                }
                if (currentUser.isEmployee) {
                    return allReportReviews[r.reviewId]?.rateeId === currentUser.user.id ? r : null;
                }
                return null;
            })
            .filter((r) => {
                if (isMyReviews) {
                    return allReportReviews[r.reviewId]?.rateeId === currentUser.user.id ? r : null;
                }
                if (isTeamReviews) {
                    return allReportReviews[r.reviewId]?.managerId === currentUser.user.id ? r : null;
                }
                return r;
            })
            .filter((r): r is Report => r !== null)
            .sort((a, b) => a.id - b.id)
            .forEach((r) => {
                const stage = reviewStages[r.reviewId];
                if (stage && buckets[stage]) buckets[stage].push(r);
            });
        return buckets;
    }, [allReportsData, reviewStages]);

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
                        360° Feedback Reports Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Overview of individual reports across all stages. There
                        are{' '}
                        <span className="font-medium text-foreground">
                            {publishedCount}
                        </span>{' '}
                        published reports.
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
                    width={200}
                />
                <StatisticsCard
                    title={`Processing`}
                    value={formatNumber(processingCount) ?? '-'}
                    icon={SquareCheck}
                    color="text-purple-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Published`}
                    value={formatNumber(publishedCount) ?? '-'}
                    icon={FileUser}
                    color="text-lime-300"
                    width={200}
                />
                <StatisticsCard
                    title={`Archived`}
                    value={formatNumber(archivedCount) ?? '-'}
                    icon={Archive}
                    color="text-zinc-300"
                    width={200}
                />
            </div>

            {/* Report List Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as ReviewStage)}
                className="w-full overflow-hidden"
            >
                <TabsList
                    variant="default"
                    className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto rounded-xl p-1"
                >
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
                                    {stageConfig[stage].label} Reports
                                </CardTitle>
                                <CardDescription className="text-base">
                                    A total of{' '}
                                    <span className="font-semibold text-foreground">
                                        {reportsByStage[stage].length}
                                    </span>{' '}
                                    {reportsByStage[stage].length !== 1
                                        ? 'reports are'
                                        : 'report is'}{' '}
                                    currently at the {stageConfig[stage].label}{' '}
                                    stage.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="space-y-6">
                                    {reportsByStage[stage].length === 0 ? (
                                        <div className="py-12 text-center text-muted-foreground">
                                            No reports in this stage
                                        </div>
                                    ) : (
                                        reportsByStage[stage].map((report) => {
                                            const rateeFullName =
                                                rateeFullNames[
                                                    report.reviewId
                                                ] ?? '';
                                            const teamTitle =
                                                rateeTeamTitles[
                                                    report.reviewId
                                                ];
                                            const positionTitle =
                                                rateePositionTitles[
                                                    report.reviewId
                                                ];

                                            return (
                                                <div
                                                    key={report.id}
                                                    className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 p-4 rounded-2xl border border-border shadow-sm w-full overflow-hidden"
                                                >
                                                    <div className="flex flex-col sm:flex-row items-center gap-2 text-center min-w-[100px] w-full">
                                                        <Avatar className="h-20 w-20 border bg-muted shrink-0">
                                                            <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                                                {getUserInitialsFromFullName(
                                                                    rateeFullName,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="space-y-1 flex-1 min-w-0 w-full">
                                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                                <p className="font-medium text-lg text-foreground break-words">
                                                                    {
                                                                        rateeFullName
                                                                    }
                                                                </p>
                                                                <StageBadge
                                                                    stage={
                                                                        reviewStages[
                                                                            report
                                                                                .reviewId
                                                                        ]
                                                                    }
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
                ))}
            </Tabs>
        </Card>
    );
}
