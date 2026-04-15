'use client';

import { EntityType } from '@entities/reporting/individual-report/model/types';
import {
    useStrategicReportCycleQuery,
    useStrategicReportQuery,
    useStrategicReportRateesQuery,
    useStrategicReportTeamTitlesQuery,
} from '@entities/reporting/strategic-report/api/strategic-report.queries';
import { CycleInfoCard } from '@entities/reporting/strategic-report/ui/cycle-info-card';
import { CycleParticipationStatsCard } from '@entities/reporting/strategic-report/ui/cycle-participation-stats-card';
import { ReviewStatsCard } from '@entities/reporting/strategic-report/ui/review-stats-card';
import { StrategicReportAnalyticsTable } from '@entities/reporting/strategic-report/ui/strategic-report-analytics-table';
import { EntityInsightCards } from '@shared/ui/entity-insight-cards';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { AnalyticsTableEntityInsights } from '@shared/ui/analytics-table-entity-insights';
import { notFound } from 'next/navigation';
import { CompetenceDeltasBarChart } from '@shared/ui/competence-deltas-bar-chart';
import { CompetenciesRadialChart } from '@shared/ui/competencies-radial-chart';
import { CompetenceRadarChart } from '@shared/ui/competence-radar-chart';
import { CompetenciesRadialChartsGroup } from '@shared/ui/competencies-radial-charts-group';
import { CompetenceBarChart } from '@shared/ui/competence-bar-chart';
import { CycleRateesHorisontalCard } from '@entities/reporting/strategic-report/ui/cycle-ratees-horisontal-card';

export function StrategicReportPage({ reportId }: { reportId: number }) {
    const {
        data: reportData,
        isLoading: isReportLoading,
        isError: isReportError,
    } = useStrategicReportQuery(reportId);

    const cycleId = Number(reportData?.cycleId);
    const {
        data: cycleData,
        isLoading: isCycleLoading,
        isError: isCycleError,
    } = useStrategicReportCycleQuery(cycleId);

    const {
        data: rateesData,
        isLoading: isRateesLoading,
        isError: isRateesError,
    } = useStrategicReportRateesQuery(cycleId);

    const {
        data: teamsData,
        isLoading: isTeamsLoading,
        isError: isTeamsError
    } = useStrategicReportTeamTitlesQuery(cycleId);

    if (isReportLoading || isCycleLoading || isRateesLoading || isTeamsLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner />
            </div>
        );
    }

    if (isReportError || isCycleError || isRateesError || isTeamsError || !reportData) {
        return notFound();
    }

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl flex flex-col gap-8">
                {/* Cycle Info, Report Info & Stats */}
                <div className="flex flex-row flex-wrap gap-8 w-full justify-between">
                    {cycleData && !isCycleLoading && !isCycleError && (
                        <CycleInfoCard cycle={cycleData} />
                    )}
                    {reportData && !isReportLoading && !isReportError && (
                        <CycleParticipationStatsCard report={reportData} />
                    )}
                    {reportData && !isReportLoading && !isReportError && (
                        <ReviewStatsCard report={reportData} />
                    )}
                </div>

                <CycleRateesHorisontalCard
                    allTeams={teamsData || []}
                    ratees={rateesData || []}
                />
                <EntityInsightCards
                    insights={reportData.insights ?? []}
                />

                {!isReportLoading && !isCycleLoading && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                        <CompetenceBarChart
                            reportAnalytics={reportData.analytics || []}
                        />
                    </div>
                )}

                {/* Charts */}
                {!isReportLoading && !isCycleLoading && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                        <CompetenciesRadialChart
                            reportAnalytics={reportData.analytics || []}
                        />
                        <CompetenceRadarChart
                            reportAnalytics={reportData.analytics || []}
                        />
                    </div>
                )}

                {!isReportLoading && !isCycleLoading && (
                    <CompetenciesRadialChartsGroup
                        reportAnalytics={reportData.analytics || []}
                    />
                )}

                {!isReportLoading && !isCycleLoading && (
                    <div className="flex flex-row flex-wrap w-full justify-around gap-8">
                        <CompetenceDeltasBarChart
                            reportAnalytics={reportData.analytics || []}
                        />
                    </div>
                )}


                {/* Analytics Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Competence Analytics
                        </CardTitle>
                        <CardDescription>
                            {reportData.analytics &&
                                reportData.analytics.length > 0 && (
                                    <AnalyticsTableEntityInsights
                                        insights={reportData.insights ?? []}
                                        analytics={reportData.analytics ?? []}
                                        entityType={EntityType.COMPETENCE}
                                    />
                                )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Loading State */}
                        {isReportLoading && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {isReportError && (
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
                            !isCycleLoading &&
                            !isReportError &&
                            !isCycleError && (
                                <>
                                    <StrategicReportAnalyticsTable
                                        report={reportData}
                                        reportAnalytics={reportData.analytics ?? []}
                                    />
                                </>
                            )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
