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
import { CompetenceRadialChart } from '@shared/ui/competencies-radial-chart';
import { CompetenceRadarChart } from '@shared/ui/competence-radar-chart';
import { CompetenciesRadialChartsGroup } from '@shared/ui/competencies-radial-charts-group';
import { CompetenceBarChart } from '@shared/ui/competence-bar-chart';
import { CycleStatsCards } from '@shared/ui/cycle-stats-cards';
import { TeamPerformanceProgressChart } from '@shared/ui/team-performance-chart';
import { useAllTeamMembersQuery } from '@entities/organisation/team-member/api/team-member.queries';
import { calculateAverageNumberForArray } from '@shared/lib/utils/calculate-average';
import { useStrategicReportIndividualReportsQuery } from '@entities/reporting/strategic-report/api/strategic-report.queries';

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

    const { 
        teamMembers: teamMembersData, 
        isLoading: isTeamMembersLoading, 
        isError: isTeamMembersError
    } = useAllTeamMembersQuery(reportData?.teamIds || []);

    const { 
        data: individualReportsData, 
        isLoading: isIndividualReportsLoading, 
        isError: isIndividualReportsError 
    } = useStrategicReportIndividualReportsQuery(cycleId);

    if (isReportLoading || isCycleLoading || isRateesLoading || isTeamsLoading || isIndividualReportsLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner />
            </div>
        );
    }

    if (isReportError || isCycleError || isRateesError || isTeamsError || isIndividualReportsError || !reportData) {
        return notFound();
    }

    const teamPerformanceData = reportData.teamIds.map((teamId) => {
        const team = teamsData?.find((t) => t.id === teamId);
        const ratees = rateesData?.filter((ratee) => ratee.teamId === teamId);
        const members = teamMembersData[teamId].filter((member) => 
            member.isPrimary === true
            && ratees?.some((ratee) => ratee.id === member.memberId)
        );
        const reports = individualReportsData?.filter((report) => members.some((member) => member.memberId === report.rateeId));
        const ratings = reports?.map((report) => {
            const percentageByTeam = report.individualReport.competenceSummaryTotals?.percentageByTeam;
            const percentageByOther = report.individualReport.competenceSummaryTotals?.percentageByOther;
            const ratings: number[] = [];
            if (percentageByTeam !== undefined && percentageByTeam !== null) {
                ratings.push(percentageByTeam);
            }
            if (percentageByOther !== undefined && percentageByOther !== null) {
                ratings.push(percentageByOther);
            }
            return {
                rateeId: report.rateeId,
                averageRating: calculateAverageNumberForArray(ratings),
            }
        });

        const teamPerformance = {
            teamId: teamId,
            teamTitle: team?.title || 'None',
            averageRating: calculateAverageNumberForArray(ratings?.map((rating) => rating.averageRating) ?? []),
            employeesCount: members.length,
        };
        return teamPerformance;
    });


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

                {reportData && !isReportLoading && !isCycleLoading && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                        <CompetenceBarChart
                            reportAnalytics={reportData.analytics || []}
                        />
                        <CompetenceRadarChart
                            reportAnalytics={reportData.analytics || []}
                            title="Competence Alignment Overview"
                            description="Multi-source evaluation of key skill clusters showing the alignment between internal self-perception and external performance perspectives. This visualization identifies organizational consensus and potential areas for behavioral calibration."
                        />
                    </div>
                )}

                {/* Charts */}
                {!isReportLoading && !isCycleLoading && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                        <CompetenceRadialChart
                            reportAnalytics={reportData.analytics || []}
                            title="Aggregate Perception Balance"
                            description="A comparative analysis of total skill proficiency levels segmented by rater category (self, team, and others). It provides a high-level summary of how accurately employees' overall contributions are perceived by their immediate and extended professional environment."
                        />
                        <TeamPerformanceProgressChart teamPerformanceData={teamPerformanceData} />
                    </div>
                )}

                {!isReportLoading && !isCycleLoading && (
                    <CompetenciesRadialChartsGroup
                        reportAnalytics={reportData.analytics || []}
                        title="Competency Distribution by Stakeholder"
                        description="Granular breakdown of proficiency levels for each core competence. By isolating specific domains, this chart highlights where stakeholder feedback diverges, revealing localized strengths or weaknesses."
                    />
                )}

                {!isReportLoading && !isCycleLoading && (
                    <div className="flex flex-row flex-wrap w-full justify-around gap-8">
                        <CompetenceDeltasBarChart
                            reportAnalytics={reportData.analytics || []}
                            title="Self-Awareness & Feedback Alignment"
                            description={`This chart illustrates the percentage deviation between the participants' self-assessments and the aggregated ratings from others. Upward bars reveal " Hidden Strengths" where external recognition exceeds self-evaluation, while downward bars pinpoint "Blind Spots" requiring closer alignment.`}
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
