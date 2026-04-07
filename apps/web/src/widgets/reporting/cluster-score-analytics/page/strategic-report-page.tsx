'use client';

import {
    useCycleTitleQuery,
    useReportAnalyticsQuery,
    useReportQuery,
    useReportRateeQuery,
    useReportReviewQuery,
} from '@entities/reporting/report/api/report.queries';
import { EntityType } from '@entities/reporting/report/model/types';
import { RateeHorisontalCard } from '@entities/reporting/report/ui/ratee-horisontal-card';
import { ReportAnalyticsTable } from '@entities/reporting/report/ui/report-analytics-table';
import { ReportCycleStatsCard } from '@entities/reporting/report/ui/report-cycle-stats-card';
import { ReportStatsCard } from '@entities/reporting/report/ui/report-stats-card';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@shared/components/ui/tooltip';
import { calculateAverageNumberForArray } from '@shared/lib/utils/calculate-average';
import { formatNumber } from '@shared/lib/utils/format-number';
import { CompetenceInsightCard } from '@shared/ui/competence-insight-card';
import { CompetenciesRadarChart } from '@shared/ui/competence-radar-chart';
import { CompetenciesBarChart } from '@shared/ui/competencies-bar-chart';
import { CompetenciesRadialChart } from '@shared/ui/competencies-radial-chart';
import { CompetenciesRadialChartsGroup } from '@shared/ui/competencies-radial-charts-group';
import {
    Compass,
    Lightbulb,
    Search,
    TrendingDown,
    TrendingUp,
    Trophy,
} from 'lucide-react';
import { notFound } from 'next/navigation';

const getValidAverage = (values: (number | null | undefined)[]) => {
    const validValues = values.filter(
        (val): val is number => typeof val === 'number',
    );
    if (validValues.length === 0) return 0;
    return calculateAverageNumberForArray(validValues);
};

export function StrategicReportPage({ reportId }: { reportId: number }) {
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

    const {
        data: reportAnalytics = [],
        isLoading: isReportAnalyticsLoading,
        isError: isReportAnalyticsError,
    } = useReportAnalyticsQuery(reportId);

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

    const questions = reportAnalytics.filter(
        (analytics) => analytics.entityType === EntityType.QUESTION,
    );
    const competences = reportAnalytics.filter(
        (analytics) => analytics.entityType === EntityType.COMPETENCE,
    );

    // Conditional rendering after all hooks are called
    if (isReportLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner />
            </div>
        );
    }

    if (!reportData || isReportError) {
        return notFound();
    }

    // Check for review loading or pending (when enabled is false, data is undefined)
    if (isReviewLoading || !reviewData) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Spinner />
            </div>
        );
    }

    if (isReviewError) {
        return notFound();
    }

    const questionsAveragesByTeamAndOther = [...questions]
        .sort((a, b) => {
            const nameA = a.questionTitle ?? '';
            const nameB = b.questionTitle ?? '';
            return nameA.localeCompare(nameB);
        })
        .map((q, index) => {
            return {
                id: q.questionId,
                title: q.questionTitle,
                num: index + 1,
                averageScore: getValidAverage([
                    q.averageByTeam,
                    q.averageByOther,
                ]),
                averageRating: getValidAverage([
                    q.percentageByTeam,
                    q.percentageByOther,
                ]),
                averageDelta: getValidAverage([
                    q.deltaPercentageByTeam,
                    q.deltaPercentageByOther,
                ]),
            };
        });

    const questionStatistics = {
        highestRating: questionsAveragesByTeamAndOther.find(
            (q) =>
                q.averageRating ===
                Math.max(
                    ...questionsAveragesByTeamAndOther.map(
                        (q) => q.averageRating,
                    ),
                ),
        ),
        lowestRating: questionsAveragesByTeamAndOther.find(
            (q) =>
                q.averageRating ===
                Math.min(
                    ...questionsAveragesByTeamAndOther.map(
                        (q) => q.averageRating,
                    ),
                ),
        ),
        highestDelta: questionsAveragesByTeamAndOther.find(
            (q) =>
                q.averageDelta ===
                Math.max(
                    ...questionsAveragesByTeamAndOther.map(
                        (q) => q.averageDelta,
                    ),
                ),
        ),
        lowestDelta: questionsAveragesByTeamAndOther.find(
            (q) =>
                q.averageDelta ===
                Math.min(
                    ...questionsAveragesByTeamAndOther.map(
                        (q) => q.averageDelta,
                    ),
                ),
        ),
    };

    const competencesAveragesByTeamAndOther = [...competences]
        .sort((a, b) => {
            const nameA = a.competenceTitle ?? '';
            const nameB = b.competenceTitle ?? '';
            return nameA.localeCompare(nameB);
        })
        .map((c, index) => {
            return {
                num: index + 1,
                id: c.competenceId,
                title: c.competenceTitle,
                averageScore: getValidAverage([
                    c.averageByTeam,
                    c.averageByOther,
                ]),
                averageRating: getValidAverage([
                    c.percentageByTeam,
                    c.percentageByOther,
                ]),
                averageDelta: getValidAverage([
                    c.deltaPercentageByTeam,
                    c.deltaPercentageByOther,
                ]),
            };
        });

    const competenceStatistics = {
        highestRating: competencesAveragesByTeamAndOther.find(
            (c) =>
                c.averageRating ===
                Math.max(
                    ...competencesAveragesByTeamAndOther.map(
                        (c) => c.averageRating,
                    ),
                ),
        ),
        lowestRating: competencesAveragesByTeamAndOther.find(
            (c) =>
                c.averageRating ===
                Math.min(
                    ...competencesAveragesByTeamAndOther.map(
                        (c) => c.averageRating,
                    ),
                ),
        ),
        highestDelta: competencesAveragesByTeamAndOther.find(
            (c) =>
                c.averageDelta ===
                Math.max(
                    ...competencesAveragesByTeamAndOther.map(
                        (c) => c.averageDelta,
                    ),
                ),
        ),
        lowestDelta: competencesAveragesByTeamAndOther.find(
            (c) =>
                c.averageDelta ===
                Math.min(
                    ...competencesAveragesByTeamAndOther.map(
                        (c) => c.averageDelta,
                    ),
                ),
        ),
    };

    const EntityStatsSummary = ({ statistics, formatNumber, entityName }) => {
        return (
            <TooltipProvider>
                <div className="flex flex-wrap gap-2 sm:gap-1 md:gap-2 items-center text-sm">
                    {[
                        {
                            id: 'highest',
                            label: 'Highest Rating',
                            value: `${formatNumber(statistics.highestRating?.averageRating)}%`,
                            num: statistics.highestRating?.num,
                            title: statistics.highestRating?.title,
                            icon: TrendingUp,
                            show: true,
                        },
                        {
                            id: 'lowest',
                            label: 'Lowest Rating',
                            value: `${formatNumber(statistics.lowestRating?.averageRating)}%`,
                            num: statistics.lowestRating?.num,
                            title: statistics.lowestRating?.title,
                            icon: TrendingDown,
                            show: true,
                        },
                        {
                            id: 'hidden_strength',
                            label: 'Hidden Strength',
                            value: `+${formatNumber(statistics.highestDelta?.averageDelta)}%`,
                            num: statistics.highestDelta?.num,
                            title: statistics.highestDelta?.title,
                            icon: Lightbulb,
                            show:
                                (statistics.highestDelta?.averageDelta ?? 0) >
                                0,
                        },
                        {
                            id: 'blind_spot',
                            label: 'Potential Blind Spot',
                            value: `${formatNumber(statistics.lowestDelta?.averageDelta)}%`,
                            num: statistics.lowestDelta?.num,
                            title: statistics.lowestDelta?.title,
                            icon: Search,
                            show:
                                (statistics.lowestDelta?.averageDelta ?? 0) < 0,
                        },
                    ]
                        .filter((item) => item.show)
                        .map((item) => {
                            const Icon = item.icon;
                            return (
                                <Tooltip key={item.id}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 h-auto py-1.5 px-3 rounded-full border-border/60 text-left w-full sm:w-auto transition-colors hover:bg-muted`}
                                        >
                                            <Icon
                                                className={`h-3.5 w-3.5 shrink-0 mt-0.5 sm:mt-0 text-muted-foreground`}
                                            />
                                            <span className="whitespace-normal leading-tight text-center">
                                                {item.num ? (
                                                    <span className="text-foreground font-medium mr-1">
                                                        #{item.num}
                                                    </span>
                                                ) : null}
                                                {item.label}
                                            </span>
                                            <span
                                                className={`font-bold tracking-tight whitespace-normal leading-tight truncate text-foreground`}
                                            >
                                                {item.value}
                                            </span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        sideOffset={6}
                                        className="max-w-[340px] p-4 bg-popover shadow-sm border border-border/60 rounded-xl break-words overflow-anywhere"
                                    >
                                        <div className="flex flex-col flex-wrap gap-2.5 text-sm leading-snug text-muted-foreground">
                                            {item.id === 'highest' && (
                                                <p>
                                                    The {entityName}{' '}
                                                    <b className="text-foreground">
                                                        #{item.num}
                                                    </b>{' '}
                                                    regarding{' '}
                                                    <b className="text-foreground font-medium italic">
                                                        "{item.title}"
                                                    </b>{' '}
                                                    emerged as the most
                                                    highly-rated area in this
                                                    assessment with an average
                                                    rating of{' '}
                                                    <b className="text-foreground">
                                                        {item.value}
                                                    </b>
                                                    , representing the strongest
                                                    consensus of excellence.
                                                </p>
                                            )}
                                            {item.id === 'lowest' && (
                                                <p>
                                                    The {entityName}{' '}
                                                    <b className="text-foreground">
                                                        #{item.num}
                                                    </b>{' '}
                                                    regarding{' '}
                                                    <b className="text-foreground font-medium italic">
                                                        "{item.title}"
                                                    </b>{' '}
                                                    with an average rating of{' '}
                                                    <b className="text-foreground">
                                                        {item.value}
                                                    </b>{' '}
                                                    reflects the most
                                                    significant opportunity for
                                                    targeted professional
                                                    development.
                                                </p>
                                            )}
                                            {item.id === 'blind_spot' && (
                                                <p>
                                                    The maximum variance of{' '}
                                                    <b className="text-foreground">
                                                        {item.value}
                                                    </b>{' '}
                                                    in {entityName}{' '}
                                                    <b className="text-foreground">
                                                        #{item.num}
                                                    </b>{' '}
                                                    <b className="text-foreground font-medium italic">
                                                        "{item.title}"
                                                    </b>{' '}
                                                    indicates a critical
                                                    misalignment where
                                                    self-perception exceeds
                                                    external evaluation.
                                                </p>
                                            )}
                                            {item.id === 'hidden_strength' && (
                                                <p>
                                                    The notable negative
                                                    variance of{' '}
                                                    <b className="text-foreground">
                                                        {item.value}
                                                    </b>{' '}
                                                    in {entityName}{' '}
                                                    <b className="text-foreground">
                                                        #{item.num}
                                                    </b>{' '}
                                                    <b className="text-foreground font-medium italic">
                                                        "{item.title}"
                                                    </b>{' '}
                                                    identifies an undervalued
                                                    asset where the actual
                                                    impact significantly
                                                    surpasses self-assessment.
                                                </p>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                </div>
            </TooltipProvider>
        );
    };

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl flex flex-col gap-8">
                {/* Ratee Info, Review Info & Stats */}
                <div className="flex flex-row flex-wrap gap-8 w-full justify-between">
                    {ratee && !isRateeLoading && !isRateeError && (
                        <RateeHorisontalCard ratee={ratee} />
                        // <CycleHorisontalCard cycle={cycle} />
                    )}

                    {reportData &&
                        !isReportLoading &&
                        !isReportError &&
                        cycleTitle && (
                            <ReportCycleStatsCard
                                report={reportData}
                                cycleTitle={cycleTitle}
                            />
                        )}

                    {reportData && <ReportStatsCard report={reportData} />}
                </div>

                {competenceStatistics &&
                    !isReportAnalyticsLoading &&
                    !isReportAnalyticsError &&
                    Boolean(
                        competenceStatistics.highestRating?.averageRating ||
                        competenceStatistics.lowestRating?.averageRating ||
                        competenceStatistics.highestDelta?.averageDelta ||
                        competenceStatistics.lowestDelta?.averageDelta,
                    ) && (
                        <Card className="flex-1 min-w-[95px] w-full overflow-hidden">
                            <CardHeader className="items-center pb-0">
                                <CardTitle>Competence Insights</CardTitle>
                                <CardDescription>
                                    The summary highlighting the most
                                    significant findings from the 360-degree
                                    assessment, including the ratee's core
                                    professional excellence, primary development
                                    priorities, and critical alignment gaps
                                    between self-perception and external
                                    feedback.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-row flex-wrap gap-8 w-full justify-around items-center mb-4">
                                <CompetenceInsightCard
                                    competenceTitle={
                                        competenceStatistics.highestRating
                                            ?.title
                                    }
                                    competenceRating={
                                        competenceStatistics.highestRating
                                            ?.averageRating !== undefined &&
                                        competenceStatistics.highestRating
                                            .averageRating !== null
                                            ? formatNumber(
                                                  competenceStatistics
                                                      .highestRating
                                                      .averageRating,
                                              )
                                            : undefined
                                    }
                                    insightTitle="Top Competence"
                                    icon={Trophy}
                                    textColor="text-lime-300"
                                />
                                <CompetenceInsightCard
                                    competenceTitle={
                                        competenceStatistics.lowestRating?.title
                                    }
                                    competenceRating={
                                        competenceStatistics.lowestRating
                                            ?.averageRating !== undefined &&
                                        competenceStatistics.lowestRating
                                            .averageRating !== null
                                            ? formatNumber(
                                                  competenceStatistics
                                                      .lowestRating
                                                      .averageRating,
                                              )
                                            : undefined
                                    }
                                    insightTitle="Growth Area"
                                    icon={Compass}
                                    textColor="text-yellow-300"
                                />
                                {(competenceStatistics.highestDelta
                                    ?.averageDelta ?? 0) > 0 && (
                                    <CompetenceInsightCard
                                        competenceTitle={
                                            competenceStatistics.highestDelta
                                                ?.title
                                        }
                                        competenceRating={
                                            competenceStatistics.highestDelta
                                                ?.averageDelta !== undefined &&
                                            competenceStatistics.highestDelta
                                                .averageDelta !== null
                                                ? competenceStatistics
                                                      .highestDelta
                                                      .averageDelta < 0
                                                    ? `${formatNumber(competenceStatistics.highestDelta.averageDelta)}`
                                                    : `+${formatNumber(competenceStatistics.highestDelta.averageDelta)}`
                                                : undefined
                                        }
                                        insightTitle="Hidden Strength"
                                        icon={Lightbulb}
                                        textColor="text-blue-300"
                                    />
                                )}
                                {(competenceStatistics.lowestDelta
                                    ?.averageDelta ?? 0) < 0 && (
                                    <CompetenceInsightCard
                                        competenceTitle={
                                            competenceStatistics.lowestDelta
                                                ?.title
                                        }
                                        competenceRating={
                                            competenceStatistics.lowestDelta
                                                ?.averageDelta !== undefined &&
                                            competenceStatistics.lowestDelta
                                                .averageDelta !== null
                                                ? competenceStatistics
                                                      .lowestDelta
                                                      .averageDelta < 0
                                                    ? `${formatNumber(competenceStatistics.lowestDelta.averageDelta)}`
                                                    : `+${formatNumber(competenceStatistics.lowestDelta.averageDelta)}`
                                                : undefined
                                        }
                                        insightTitle="Potential Blind Spot"
                                        icon={Search}
                                        textColor="text-violet-300"
                                    />
                                )}
                            </CardContent>
                        </Card>
                    )}

                {/* Charts */}
                {!isReportLoading &&
                    !isReviewLoading &&
                    !isReportAnalyticsLoading && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
                            <CompetenciesRadialChart
                                reportAnalytics={competences}
                            />
                            <CompetenciesRadarChart
                                reportAnalytics={competences}
                            />
                        </div>
                    )}

                {!isReportLoading &&
                    !isReviewLoading &&
                    !isReportAnalyticsLoading && (
                        <CompetenciesRadialChartsGroup
                            reportAnalytics={competences}
                        />
                    )}

                {!isReportLoading &&
                    !isReviewLoading &&
                    !isReportAnalyticsLoading && (
                        <div className="flex flex-row flex-wrap w-full justify-around gap-8">
                            <CompetenciesBarChart
                                reportAnalytics={competences}
                            />
                        </div>
                    )}

                {/* Questions Analytic Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Analytic by questions
                        </CardTitle>
                        <CardDescription>
                            {questions.length > 0 && (
                                <EntityStatsSummary
                                    statistics={questionStatistics}
                                    formatNumber={formatNumber}
                                    entityName="question"
                                />
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Loading State */}
                        {(isReportLoading ||
                            isReviewLoading ||
                            isReportAnalyticsLoading) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {(isReportError ||
                            isReviewError ||
                            isReportAnalyticsError) && (
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
                            !isReportAnalyticsLoading &&
                            !isReportError &&
                            !isReviewError &&
                            !isReportAnalyticsError && (
                                <>
                                    <ReportAnalyticsTable
                                        reportAnalytics={questions}
                                    />
                                </>
                            )}
                    </CardContent>
                </Card>

                {/* Competences Analytic Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Analytic by competences
                        </CardTitle>
                        <CardDescription>
                            {competences.length > 0 && (
                                <EntityStatsSummary
                                    statistics={competenceStatistics}
                                    formatNumber={formatNumber}
                                    entityName="competence"
                                />
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Loading State */}
                        {(isReportLoading ||
                            isReviewLoading ||
                            isReportAnalyticsLoading) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {(isReportError ||
                            isReviewError ||
                            isReportAnalyticsError) && (
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
                            !isReportAnalyticsLoading &&
                            !isReportError &&
                            !isReviewError &&
                            !isReportAnalyticsError && (
                                <>
                                    <ReportAnalyticsTable
                                        reportAnalytics={competences}
                                    />
                                </>
                            )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
