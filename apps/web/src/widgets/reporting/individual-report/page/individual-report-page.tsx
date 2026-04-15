'use client';

import {
    useCycleTitleQuery,
    useReportQuery,
    useReportRateeQuery,
    useReportReviewQuery,
} from '@entities/reporting/individual-report/api/individual-report.queries';
import { EntityType } from '@entities/reporting/individual-report/model/types';
import { IndividualReportAnalyticsTable } from '@entities/reporting/individual-report/ui/individual-report-analytics-table';
import { IndividualReportCycleStatsCard } from '@entities/reporting/individual-report/ui/individual-report-cycle-stats-card';
import { IndividualReportStatsCard } from '@entities/reporting/individual-report/ui/individual-report-stats-card';
import { RateeHorisontalCard } from '@entities/reporting/individual-report/ui/ratee-horisontal-card';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { AnalyticsTableEntityInsights } from '@shared/ui/analytics-table-entity-insights';
import { CompetenceRadarChart } from '@shared/ui/competence-radar-chart';
import { CompetenceDeltasBarChart } from '@shared/ui/competence-deltas-bar-chart';
import { CompetenciesRadialChart } from '@shared/ui/competencies-radial-chart';
import { CompetenciesRadialChartsGroup } from '@shared/ui/competencies-radial-charts-group';
import { EntityInsightCards } from '@shared/ui/entity-insight-cards';
import { notFound } from 'next/navigation';

export function IndividualReportPage({ reportId }: { reportId: number }) {
    const {
        data: reportData,
        isLoading: isReportLoading,
        isError: isReportError,
    } = useReportQuery(reportId);

    const reviewId = Number(reportData?.reviewId);
    const {
        data: reviewData,
        isLoading: isReviewLoading,
        isError: isReviewError,
    } = useReportReviewQuery(reviewId);

    const rateeId = Number(reviewData?.rateeId);
    const {
        data: rateeData,
        isLoading: isRateeLoading,
        isError: isRateeError,
    } = useReportRateeQuery(rateeId);

    const cycleId = Number(reviewData?.cycleId);
    const {
        data: cycleTitle,
        isLoading: isCycleTitleLoading,
        isError: isCycleTitleError,
    } = useCycleTitleQuery(cycleId);

    const ratee = rateeData
        ? {
            ...rateeData,
            positionTitle: reviewData?.rateePositionTitle,
            teamTitle: reviewData?.teamTitle,
        }
        : null;

    const questionAnalytics =
        reportData?.analytics?.filter(
            (analytics) => analytics.entityType === EntityType.QUESTION,
        ) || [];
    const competenceAnalytics =
        reportData?.analytics?.filter(
            (analytics) => analytics.entityType === EntityType.COMPETENCE,
        ) || [];

    if (
        isReportLoading ||
        isReviewLoading ||
        isRateeLoading ||
        isCycleTitleLoading
    ) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner />
            </div>
        );
    }

    if (
        isReportError ||
        isReviewError ||
        isRateeError ||
        isCycleTitleError ||
        !reportData
    ) {
        return notFound();
    }

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl flex flex-col gap-8">
                {/* Ratee Info, Review Info & Stats */}
                <div className="flex flex-row flex-wrap gap-8 w-full justify-between">
                    {ratee && !isRateeLoading && !isRateeError && (
                        <RateeHorisontalCard ratee={ratee} />
                    )}

                    {reportData &&
                        !isReportLoading &&
                        !isReportError &&
                        cycleTitle && (
                            <IndividualReportCycleStatsCard
                                report={reportData}
                                cycleTitle={cycleTitle}
                            />
                        )}

                    {reportData && (
                        <IndividualReportStatsCard report={reportData} />
                    )}
                </div>

                <EntityInsightCards
                    insights={reportData.competenceInsights ?? []}
                />

                {/* Charts */}
                {!isReportLoading && !isReviewLoading && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                        <CompetenciesRadialChart
                            reportAnalytics={competenceAnalytics}
                        />
                        <CompetenceRadarChart
                            reportAnalytics={competenceAnalytics}
                        />
                    </div>
                )}

                {!isReportLoading && !isReviewLoading && (
                    <CompetenciesRadialChartsGroup
                        reportAnalytics={competenceAnalytics}
                    />
                )}

                {!isReportLoading && !isReviewLoading && (
                    <div className="flex flex-row flex-wrap w-full justify-around gap-8">
                        <CompetenceDeltasBarChart
                            reportAnalytics={competenceAnalytics}
                        />
                    </div>
                )}

                {/* Questions Analytic Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Question Analytics
                        </CardTitle>
                        <CardDescription>
                            {questionAnalytics.length > 0 && (
                                <AnalyticsTableEntityInsights
                                    insights={reportData.questionInsights ?? []}
                                    analytics={reportData.analytics ?? []}
                                    entityType={EntityType.QUESTION}
                                />
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Loading State */}
                        {(isReportLoading || isReviewLoading) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {(isReportError || isReviewError) && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load report data
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Report Analytics Table */}
                        {!isReportLoading &&
                            !isReviewLoading &&
                            !isReportError &&
                            !isReviewError && (
                                <>
                                    <IndividualReportAnalyticsTable
                                        reportAnalytics={questionAnalytics}
                                        summaryTotals={
                                            reportData?.questionSummaryTotals ??
                                            {}
                                        }
                                    />
                                </>
                            )}
                    </CardContent>
                </Card>

                {/* Competences Analytic Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Competence Analytics
                        </CardTitle>
                        <CardDescription>
                            {competenceAnalytics.length > 0 && (
                                <AnalyticsTableEntityInsights
                                    insights={
                                        reportData.competenceInsights ?? []
                                    }
                                    analytics={reportData.analytics ?? []}
                                    entityType={EntityType.COMPETENCE}
                                />
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Loading State */}
                        {(isReportLoading || isReviewLoading) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {(isReportError || isReviewError) && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load report data
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Report Analytics Table */}
                        {!isReportLoading &&
                            !isReviewLoading &&
                            !isReportError &&
                            !isReviewError && (
                                <>
                                    <IndividualReportAnalyticsTable
                                        reportAnalytics={competenceAnalytics}
                                        summaryTotals={
                                            reportData?.competenceSummaryTotals ??
                                            {}
                                        }
                                    />
                                </>
                            )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
