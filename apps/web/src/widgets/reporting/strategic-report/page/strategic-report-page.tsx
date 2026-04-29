'use client';

import { useAllTeamMembersQuery } from '@entities/organisation/team-member/api/team-member.queries';
import {
    useClusterScoreAnalyticsClusterScoreTitlesQuery,
    useClusterScoreAnalyticsCompetenceTitlesQuery,
} from '@entities/reporting/cluster-score-analytics/api/cluster-score-analytics.queries';
import { EntityType } from '@entities/reporting/individual-report/model/types';
import {
    useClusterScoreAnalyticsByCycleQuery,
    useStrategicReportCycleQuery,
    useStrategicReportIndividualReportsQuery,
    useStrategicReportQuery,
    useStrategicReportRateesQuery,
    useStrategicReportTeamTitlesQuery,
} from '@entities/reporting/strategic-report/api/strategic-report.queries';
import { CycleInfoCard } from '@entities/reporting/strategic-report/ui/cycle-info-card';
import { CycleParticipationStatsCard } from '@entities/reporting/strategic-report/ui/cycle-participation-stats-card';
import { ReviewStatsCard } from '@entities/reporting/strategic-report/ui/review-stats-card';
import { StrategicReportAnalyticsTable } from '@entities/reporting/strategic-report/ui/strategic-report-analytics-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { calculateAverageNumberForArray } from '@shared/lib/utils/calculate-average';
import { AnalyticsTableEntityInsights } from '@shared/ui/analytics-table-entity-insights';
import { ClusterDistributionCharts } from '@shared/ui/cluster-distribution-chart';
import { CompetenceBarChart } from '@shared/ui/competence-bar-chart';
import { CompetenceDeltasBarChart } from '@shared/ui/competence-deltas-bar-chart';
import {
    CompetenceMatrixHeatmap,
    type TeamCompetenceRating,
} from '@shared/ui/competence-matrix-heatmap';
import { CompetenceRadarChart } from '@shared/ui/competence-radar-chart';
import { CompetenceRadialChart } from '@shared/ui/competencies-radial-chart';
import { CompetenciesRadialChartsGroup } from '@shared/ui/competencies-radial-charts-group';
import { CorridorVsRealRatingChart } from '@shared/ui/corridor-vs-real-rating-chart';
import { CycleStatsCards } from '@shared/ui/cycle-stats-cards';
import { EntityInsightCards } from '@shared/ui/entity-insight-cards';
import { TeamPerformanceProgressChart } from '@shared/ui/team-performance-chart';
import { notFound } from 'next/navigation';
import { useMemo } from 'react';

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
        isError: isTeamsError,
    } = useStrategicReportTeamTitlesQuery(cycleId);

    const {
        teamMembers: teamMembersData,
        isLoading: isTeamMembersLoading,
        isError: isTeamMembersError,
    } = useAllTeamMembersQuery(reportData?.teamIds || []);

    const {
        data: individualReportsData,
        isLoading: isIndividualReportsLoading,
        isError: isIndividualReportsError,
    } = useStrategicReportIndividualReportsQuery(cycleId);

    // Cluster Score Analytics data for the 5 new charts
    const {
        data: clusterScoreAnalyticsData = [],
        isLoading: isClusterAnalyticsLoading,
    } = useClusterScoreAnalyticsByCycleQuery(cycleId);

    // Resolve cluster titles (cluster name + competenceId)
    const allClusterIds = useMemo(
        () =>
            Array.from(
                new Set(
                    clusterScoreAnalyticsData
                        .map((c) => c.clusterId)
                        .filter(Boolean),
                ),
            ),
        [clusterScoreAnalyticsData],
    );
    const { clusterData: clusterTitlesMap, isLoading: isClusterTitlesLoading } =
        useClusterScoreAnalyticsClusterScoreTitlesQuery(allClusterIds);

    // Resolve competence titles from cluster → competenceId
    const competenceIdsFromClusters = useMemo(
        () => Object.values(clusterTitlesMap).map((c) => c.competenceId),
        [clusterTitlesMap],
    );
    const {
        competenceTitles: csaCompetenceTitles,
        isLoading: isCsaCompetenceTitlesLoading,
    } = useClusterScoreAnalyticsCompetenceTitlesQuery(
        competenceIdsFromClusters,
    );

    // Build team-competence matrix from individual reports + ratees (rateeId → teamId)
    const teamCompetenceMatrix = useMemo((): TeamCompetenceRating[] => {
        if (!individualReportsData || !rateesData || !teamsData) return [];

        // rateeId → teamId lookup
        const rateeToTeam: Record<number, number> = {};
        rateesData.forEach((ratee) => {
            if (ratee.teamId != null) rateeToTeam[ratee.id] = ratee.teamId;
        });

        // teamId → teamTitle lookup
        const teamIdToTitle: Record<number, string> = {};
        teamsData.forEach((team) => {
            teamIdToTitle[team.id] = team.title;
        });

        // Accumulate scores: `teamTitle|competenceTitle` → number[]
        const scoreAccumulator: Record<string, number[]> = {};

        individualReportsData.forEach(({ rateeId, individualReport }) => {
            const teamId = rateeToTeam[rateeId];
            if (teamId === undefined) return;
            const teamTitle = teamIdToTitle[teamId];
            if (!teamTitle) return;

            const competenceAnalytics =
                individualReport.analytics?.filter(
                    (a) =>
                        a.entityType === EntityType.COMPETENCE &&
                        a.competenceTitle,
                ) ?? [];

            competenceAnalytics.forEach((a) => {
                const compTitle = a.competenceTitle!;
                const ratings: number[] = [];
                if (a.percentageByTeam != null)
                    ratings.push(a.percentageByTeam);
                if (a.percentageByOther != null)
                    ratings.push(a.percentageByOther);
                if (ratings.length === 0) return;
                const avg = ratings.reduce((s, v) => s + v, 0) / ratings.length;
                const key = `${teamTitle}|${compTitle}`;
                if (!scoreAccumulator[key]) scoreAccumulator[key] = [];
                scoreAccumulator[key].push(avg);
            });
        });

        return Object.entries(scoreAccumulator).map(([key, ratings]) => {
            const [teamTitle, competenceTitle] = key.split('|');
            const avgRating =
                ratings.reduce((s, v) => s + v, 0) / ratings.length;
            return { teamTitle, competenceTitle, avgRating };
        });
    }, [individualReportsData, rateesData, teamsData]);

    const teamPerformanceData = useMemo(() => {
        if (!reportData || !teamsData || !rateesData || !teamMembersData)
            return [];

        return reportData.teamIds.map((teamId) => {
            const team = teamsData?.find((t) => t.id === teamId);
            const ratees = rateesData?.filter(
                (ratee) => ratee.teamId === teamId,
            );
            const members =
                teamMembersData[teamId]?.filter(
                    (member) =>
                        member.isPrimary === true &&
                        ratees?.some((ratee) => ratee.id === member.memberId),
                ) ?? [];
            const reports = individualReportsData?.filter((report) =>
                members.some((member) => member.memberId === report.rateeId),
            );
            const ratings = reports?.map((report) => {
                const percentageByTeam =
                    report.individualReport.competenceSummaryTotals
                        ?.percentageByTeam;
                const percentageByOther =
                    report.individualReport.competenceSummaryTotals
                        ?.percentageByOther;
                const ratings: number[] = [];
                if (
                    percentageByTeam !== undefined &&
                    percentageByTeam !== null
                ) {
                    ratings.push(percentageByTeam);
                }
                if (
                    percentageByOther !== undefined &&
                    percentageByOther !== null
                ) {
                    ratings.push(percentageByOther);
                }
                return {
                    rateeId: report.rateeId,
                    averageRating: calculateAverageNumberForArray(ratings),
                };
            });

            const teamPerformance = {
                teamId: teamId,
                teamTitle: team?.title || 'None',
                averageRating: calculateAverageNumberForArray(
                    ratings?.map((rating) => rating.averageRating) ?? [],
                ),
                employeesCount: members.length,
            };
            return teamPerformance;
        });
    }, [
        reportData,
        teamsData,
        rateesData,
        teamMembersData,
        individualReportsData,
    ]);

    if (
        isReportLoading ||
        isCycleLoading ||
        isRateesLoading ||
        isTeamsLoading ||
        isIndividualReportsLoading
    ) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner />
            </div>
        );
    }

    if (
        isReportError ||
        isCycleError ||
        isRateesError ||
        isTeamsError ||
        isIndividualReportsError ||
        !reportData
    ) {
        return notFound();
    }

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl flex flex-col gap-8">
                {/* ═══════════ Feedback Cycle Summary ═══════════ */}

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

                {reportData && !isReportLoading && !isReportError && (
                    <CycleStatsCards report={reportData} />
                )}

                {reportData && !isReportLoading && !isReportError && (
                    <EntityInsightCards
                        insights={reportData.insights ?? []}
                        title="Organizational Talent Profile"
                        description="Strategic identification of the company's collective strengths, priority development areas, and perception alignment gaps based on aggregated multi-source feedback."
                    />
                )}

                {/* ═══════════ Competence Analytics Charts ═══════════ */}

                {reportData && !isReportLoading && !isCycleLoading && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                        <CompetenceBarChart
                            reportAnalytics={reportData.analytics || []}
                        />
                        <CompetenceRadarChart
                            reportAnalytics={reportData.analytics || []}
                            title="Competence Alignment Overview"
                            description="Multi-source evaluation of key skill clusters showing the alignment between internal self-perception and external performance perspectives."
                        />
                    </div>
                )}

                {/* Charts */}
                {!isReportLoading && !isCycleLoading && (
                    // <div className="flex flex-row flex-wrap w-full justify-around gap-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                        <CompetenceDeltasBarChart
                            reportAnalytics={reportData.analytics || []}
                            title="Self-Awareness & Feedback Alignment"
                            description={`This chart illustrates the percentage deviation between the participants' self-assessments and the aggregated ratings from team and others. Upward bars reveal " Hidden Strengths" where external recognition exceeds self-evaluation, while downward bars pinpoint "Blind Spots" requiring closer alignment.`}
                        />
                        <CompetenceRadialChart
                            reportAnalytics={reportData.analytics || []}
                            title="Aggregate Perception Balance"
                            description="A comparative analysis of total skill proficiency levels segmented by rater category (self, team, and others). It provides a high-level summary of how accurately employees' overall contributions are perceived by their professional environment."
                        />
                    </div>
                )}

                {!isReportLoading && !isCycleLoading && (
                    <CompetenciesRadialChartsGroup
                        reportAnalytics={reportData.analytics || []}
                        title="Competency Distribution by Stakeholder"
                        description="Granular breakdown of proficiency levels for each competence. This chart highlights where stakeholder feedback diverges, revealing localized strengths or weaknesses."
                    />
                )}

                {/* ═══════════ Cluster Score Analytics Charts ═══════════ */}

                {/* Chart 1: Cluster Distribution (Stacked Bar + Pie) */}
                {!isReportLoading &&
                    !isCycleLoading &&
                    !isClusterAnalyticsLoading &&
                    !isClusterTitlesLoading &&
                    !isCsaCompetenceTitlesLoading &&
                    clusterScoreAnalyticsData.length > 0 && (
                        <ClusterDistributionCharts
                            analyticsData={clusterScoreAnalyticsData}
                            cycleId={cycleId}
                            clusterTitles={clusterTitlesMap}
                            competenceTitles={csaCompetenceTitles}
                        />
                    )}

                {/* Chart 2: Corridor vs Real Rating */}
                {!isReportLoading &&
                    !isCycleLoading &&
                    !isClusterAnalyticsLoading &&
                    !isClusterTitlesLoading &&
                    clusterScoreAnalyticsData.length > 0 && (
                        <CorridorVsRealRatingChart
                            clusterScoreAnalytics={clusterScoreAnalyticsData}
                            clusterTitles={clusterTitlesMap}
                            competenceTitles={csaCompetenceTitles}
                        />
                    )}

                {!isReportLoading && !isCycleLoading && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                        <TeamPerformanceProgressChart
                            teamPerformanceData={teamPerformanceData}
                        />
                    </div>
                )}

                {/* Chart 3: Competence Matrix Heatmap */}
                {!isIndividualReportsLoading &&
                    teamCompetenceMatrix.length > 0 && (
                        <CompetenceMatrixHeatmap
                            teamCompetenceMatrix={teamCompetenceMatrix}
                        />
                    )}

                {/* ═══════════ Analytics Tables ═══════════ */}

                {/* Competence Analytics Table */}
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
                        {isReportLoading && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

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

                        {!isReportLoading &&
                            !isCycleLoading &&
                            !isReportError &&
                            !isCycleError && (
                                <>
                                    <StrategicReportAnalyticsTable
                                        report={reportData}
                                        reportAnalytics={
                                            reportData.analytics ?? []
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
