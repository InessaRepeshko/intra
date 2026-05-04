'use client';

import { format } from 'date-fns';
import {
    Archive,
    Calendar,
    Eye,
    FileUser,
    Hourglass,
    MessageCircle,
    Pencil,
    ShieldCheck,
    SquareCheck,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useCyclesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import {
    StageBadge,
    stageConfig,
} from '@entities/feedback360/review/ui/stage-badge';
import { useUsersByUserIdsQuery } from '@entities/identity/user/api/user.queries';
import { type AuthContextType } from '@entities/identity/user/model/types';
import {
    useAllCommentReviewsQuery,
    useAllReportAnswersQuery,
    useAllReportCommentsQuery,
} from '@entities/reporting/individual-report-comment/api/individual-report-comment.queries';
import type { Report } from '@entities/reporting/individual-report-comment/model/mappers';
import {
    AnswerType,
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
} from '@entities/reporting/individual-report-comment/model/types';
import { useReportsQuery } from '@entities/reporting/individual-report/api/individual-report.queries';
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

export function IndividualReportCommentDashboard({
    currentUser,
}: {
    currentUser: AuthContextType;
}) {
    const { data: allReportsData = [] } = useReportsQuery();
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

    const allReportIds = useMemo(
        () => allReportsData.map((r) => r.id),
        [allReportsData],
    );
    const allReviewIds = useMemo(
        () => allReportsData.map((r) => r.reviewId),
        [allReportsData],
    );

    // Reviews keyed by reportId (specific to comment queries)
    const { reviews: allReportReviews = {} } =
        useAllCommentReviewsQuery(allReportIds);

    // Comments keyed by reportId
    const { reportComments: allCommentsData = {} } =
        useAllReportCommentsQuery(allReportIds);

    // Answers keyed by reviewId
    const { answers: allAnswersByReviewId = {} } =
        useAllReportAnswersQuery(allReviewIds);

    // Text answers keyed by reportId
    const reportTextAnswers = useMemo(() => {
        const map: Record<number, number> = {};
        allReportsData.forEach((r) => {
            const answers = allAnswersByReviewId[r.reviewId] ?? [];
            map[r.id] = answers.filter(
                (a) => a.answerType === AnswerType.TEXT_FIELD,
            ).length;
        });
        return map;
    }, [allReportsData, allAnswersByReviewId]);

    // Ratee user info for avatars
    const rateeIds = useMemo(
        () =>
            Array.from(
                new Set(
                    Object.values(allReportReviews)
                        .map((r) => r?.rateeId)
                        .filter((id): id is number => id !== undefined),
                ),
            ),
        [allReportReviews],
    );

    const { data: rateeUsers = [] } = useUsersByUserIdsQuery(rateeIds);
    const rateeUserById = useMemo(
        () => new Map(rateeUsers.map((u) => [u.id, u])),
        [rateeUsers],
    );

    const reportsByCycle = useMemo(() => {
        const buckets = Object.fromEntries(
            allCycles.map((c) => [c.id, [] as Report[]]),
        ) as Record<number, Report[]>;

        const filteredReports = allReportsData
            .filter((r) => {
                const review = allReportReviews[r.id];
                if (currentUser.isAdmin || currentUser.isHR) {
                    return r;
                }
                return null;
            })
            .filter((r): r is Report => r !== null && r !== undefined)
            .sort((a, b) => a.id - b.id)
            .sort((a, b) => REVIEW_STAGE_ENUM_VALUES.indexOf(allReportReviews[a.id]?.stage ?? '') -
                REVIEW_STAGE_ENUM_VALUES.indexOf(allReportReviews[b.id]?.stage ?? ''));

        buckets[-1] = filteredReports;
        buckets[0] = filteredReports.filter((r) => r.cycleId === null || r.cycleId === undefined);
        filteredReports.forEach((r) => {
            const cycleId = r.cycleId;
            if (cycleId && buckets[cycleId]) buckets[cycleId].push(r);
        });
        return buckets;
    }, [
        allReportsData,
        allReportReviews,
        currentUser,
    ]);

    const totalFilteredReports = reportsByCycle[-1]?.length ?? 0;

    const preparingCount =
        (reportsByCycle[-1]?.filter((r) => allReportReviews[r.id]?.stage === ReviewStage.FINISHED)?.length ?? 0) +
        (reportsByCycle[-1]?.filter((r) => allReportReviews[r.id]?.stage === ReviewStage.PREPARING_REPORT)?.length ?? 0);
    const processingCount =
        reportsByCycle[-1]?.filter((r) => allReportReviews[r.id]?.stage === ReviewStage.PROCESSING_BY_HR)?.length ?? 0;
    const publishedCount =
        (reportsByCycle[-1]?.filter((r) => allReportReviews[r.id]?.stage === ReviewStage.PUBLISHED)?.length ?? 0) +
        (reportsByCycle[-1]?.filter((r) => allReportReviews[r.id]?.stage === ReviewStage.ANALYSIS)?.length ?? 0);
    const archivedCount =
        (reportsByCycle[-1]?.filter((r) => allReportReviews[r.id]?.stage === ReviewStage.ARCHIVED)?.length ?? 0) +
        (reportsByCycle[-1]?.filter((r) => allReportReviews[r.id]?.stage === ReviewStage.CANCELED)?.length ?? 0);

    return (
        <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Reports Comments Dashboard Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                        Individual Report Comments Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Overview of individual report comments. A total of {' '}
                        <span className="font-medium text-foreground">
                            {totalFilteredReports}
                        </span>{' '}
                        {totalFilteredReports === 1 ? 'report is' : 'reports are'} finished. A total of {' '}
                        <span className="font-medium text-foreground">
                            {publishedCount}
                        </span>{' '}
                        {publishedCount === 1 ? 'report is' : 'reports are'} published.
                    </p>
                </div>
            </div>

            {/* Report stats */}
            <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-4 md:gap-6 justify-around">
                <StatisticsCard
                    title={`Finished`}
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
                    {cycleOptions.map((cycle) => {
                        const reports = reportsByCycle[cycle.value]
                            .filter((r) =>
                                activeCycleTab.value === -1
                                    ? r
                                    : activeCycleTab.value === 0
                                        ? r.cycleId === null ||
                                        r.cycleId === undefined
                                        : r.cycleId === activeCycleTab.value
                                            ? r
                                            : null,
                            )
                            .filter((r): r is Report => r !== null);

                        return (
                            <TabsContent key={cycle.value} value={cycle.label}>
                                <Card className="border-[0px]">
                                    <CardHeader className="px-2">
                                        <CardTitle className="text-foreground text-lg break-words">
                                            {cycle.label} Individual Report Comments
                                        </CardTitle>
                                        <CardDescription className="text-base">
                                            A total of{' '}
                                            <span className="font-semibold text-foreground">
                                                {reports.length}
                                            </span>{' '}
                                            {reports.length !== 1
                                                ? 'reports are'
                                                : 'report is'}{' '}
                                            currently for
                                            the {activeCycleTab.label}.
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
                                                    const review = allReportReviews[report.id];
                                                    const ratee = review ? rateeUserById.get(review.rateeId) : undefined;
                                                    const rateeFullName = review?.rateeFullName ?? '';
                                                    const positionTitle = review?.rateePositionTitle ?? null;
                                                    const teamTitle = review?.teamTitle ?? null;
                                                    const cycleTitle = report.cycleId ? allCycles.find((c) => c.id === report.cycleId)?.title : null;
                                                    const commentCount = allCommentsData[report.id]?.length ?? 0;
                                                    const textAnswerCount = reportTextAnswers[report.id] ?? 0;

                                                    return (
                                                        <div
                                                            key={report.id}
                                                            className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 p-4 rounded-2xl border border-border shadow-sm w-full overflow-hidden"
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
                                                                            rateeFullName
                                                                        }
                                                                    />
                                                                    <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                                                        {getUserInitialsFromFullName(
                                                                            rateeFullName,
                                                                        )}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="space-y-1 flex-1 min-w-0 w-full">
                                                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                                        <p className="font-medium text-lg text-foreground break-words">
                                                                            <span className="text-muted-foreground border border-border rounded-xl px-1 bg-neutral-100">
                                                                                #
                                                                                {
                                                                                    report.id
                                                                                }
                                                                            </span>{' '}
                                                                            {
                                                                                rateeFullName
                                                                            }
                                                                        </p>
                                                                        {review?.stage && (
                                                                            <StageBadge
                                                                                stage={
                                                                                    review.stage
                                                                                }
                                                                            />
                                                                        )}
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
                                                                    <MessageCircle className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                    <span className="font-medium text-foreground whitespace-nowrap flex gap-1">
                                                                        {
                                                                            commentCount
                                                                        }
                                                                        <span className="text-muted-foreground">
                                                                            /
                                                                        </span>
                                                                        {
                                                                            textAnswerCount
                                                                        }
                                                                    </span>
                                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                                        comments
                                                                    </span>
                                                                </div>
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
                                                                {review?.stage === ReviewStage.PROCESSING_BY_HR && (
                                                                    <Button
                                                                        asChild
                                                                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full md:w-auto min-w-[120px]"
                                                                    >
                                                                        <Link
                                                                            href={`/reporting/individual-reports/${report.id}/comments`}
                                                                        >
                                                                            <Pencil className="h-4 w-4" />
                                                                            Process
                                                                        </Link>
                                                                    </Button>
                                                                )}
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
        </Card >
    );
}
