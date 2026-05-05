'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    useClusterScoreAnalyticsClusterScoreTitlesQuery,
    useClusterScoreAnalyticsCompetenceTitlesQuery,
    useClusterScoreAnalyticsCycleTitlesQuery,
    useClusterScoresAnalyticsQuery,
} from '@entities/reporting/cluster-score-analytics/api/cluster-score-analytics.queries';
import { SortDirection } from '@entities/reporting/cluster-score-analytics/model/types';
import { ClusterScoreAnalyticsFilters } from '@entities/reporting/cluster-score-analytics/ui/cluster-score-analytics-filters';
import { ClusterScoreAnalyticsTable } from '@entities/reporting/cluster-score-analytics/ui/cluster-score-analytics-table';
import { Card, CardContent } from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function ClusterScoreAnalyticsList() {
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [clusterScores, setClusterScores] = useState<string[]>([]);
    const [competences, setCompetences] = useState<string[]>([]);
    const [cycles, setCycles] = useState<string[]>([]);
    const [lowerBounds, setLowerBounds] = useState<string[]>([]);
    const [upperBounds, setUpperBounds] = useState<string[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    const {
        data: allClusterScoreAnalytics = [],
        isLoading,
        isError,
    } = useClusterScoresAnalyticsQuery({});

    const allClusterIds = useMemo(
        () =>
            Array.from(
                new Set(
                    allClusterScoreAnalytics
                        .map((c) => c.clusterId)
                        .filter((id) => id !== undefined && id !== null),
                ),
            ),
        [allClusterScoreAnalytics],
    );

    const {
        clusterData: clusterScoreTitles,
        isLoading: isClusterScoreTitlesLoading,
    } = useClusterScoreAnalyticsClusterScoreTitlesQuery(allClusterIds);

    const competenceIds = useMemo(
        () => Object.values(clusterScoreTitles).map((c) => c.competenceId),
        [clusterScoreTitles],
    );

    const { competenceTitles } =
        useClusterScoreAnalyticsCompetenceTitlesQuery(competenceIds);

    const allCycleIds = useMemo(
        () =>
            Array.from(
                new Set(
                    allClusterScoreAnalytics
                        .map((c) => c.cycleId)
                        .filter((id) => id !== undefined && id !== null),
                ),
            ),
        [allClusterScoreAnalytics],
    );

    const { cycleTitles, isLoading: isCycleTitlesLoading } =
        useClusterScoreAnalyticsCycleTitlesQuery(allCycleIds);

    // Filter unique cluster score titles and cycle titles
    const clusterScoreTitlesOptions = useMemo(() => {
        const uniqueClusterScoreTitles = new Set<string>();

        allClusterScoreAnalytics.forEach((clusterScoreAnalytics) => {
            const title = clusterScoreAnalytics.clusterId
                ? clusterScoreTitles[clusterScoreAnalytics.clusterId]?.title
                : undefined;
            if (title && title.trim() !== '') {
                uniqueClusterScoreTitles.add(title);
            }
        });

        return Array.from(uniqueClusterScoreTitles).sort((a, b) =>
            a.localeCompare(b),
        );
    }, [allClusterScoreAnalytics, clusterScoreTitles]);

    const competenceTitlesOptions = useMemo(() => {
        const uniqueCompetenceTitles = new Set<string>();

        allClusterScoreAnalytics.forEach((clusterScoreAnalytics) => {
            const title =
                clusterScoreAnalytics.clusterId &&
                clusterScoreTitles[clusterScoreAnalytics.clusterId]
                    ?.competenceId
                    ? competenceTitles[
                          clusterScoreTitles[clusterScoreAnalytics.clusterId]
                              .competenceId
                      ]?.title
                    : undefined;
            if (title && title.trim() !== '') {
                uniqueCompetenceTitles.add(title);
            }
        });

        return Array.from(uniqueCompetenceTitles).sort((a, b) =>
            a.localeCompare(b),
        );
    }, [allClusterScoreAnalytics, clusterScoreTitles, competenceTitles]);

    const cycleTitlesOptions = useMemo(() => {
        const uniqueCycleTitles = new Set<string>();

        allClusterScoreAnalytics.forEach((clusterScoreAnalytics) => {
            const title = clusterScoreAnalytics.cycleId
                ? cycleTitles[clusterScoreAnalytics.cycleId]
                : undefined;
            if (title && title.trim() !== '') {
                uniqueCycleTitles.add(title);
            }
        });

        return Array.from(uniqueCycleTitles).sort((a, b) => a.localeCompare(b));
    }, [allClusterScoreAnalytics, cycleTitles]);

    const lowerBoundOptions = useMemo(() => {
        const uniqueLowerBounds = new Set<number>();

        allClusterScoreAnalytics.forEach((clusterScoreAnalytics) => {
            if (clusterScoreAnalytics.lowerBound !== null) {
                uniqueLowerBounds.add(clusterScoreAnalytics.lowerBound);
            }
        });

        return Array.from(uniqueLowerBounds)
            .sort((a, b) => a - b)
            .map((bound) => String(bound));
    }, [allClusterScoreAnalytics]);

    const upperBoundOptions = useMemo(() => {
        const uniqueUpperBounds = new Set<number>();

        allClusterScoreAnalytics.forEach((clusterScoreAnalytics) => {
            if (clusterScoreAnalytics.upperBound !== null) {
                uniqueUpperBounds.add(clusterScoreAnalytics.upperBound);
            }
        });

        return Array.from(uniqueUpperBounds)
            .sort((a, b) => a - b)
            .map((bound) => String(bound));
    }, [allClusterScoreAnalytics]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection((prev) =>
                prev === SortDirection.ASC
                    ? SortDirection.DESC
                    : SortDirection.ASC,
            );
        } else {
            setSortField(field);
            setSortDirection(SortDirection.ASC);
        }
        setCurrentPage(1);
    };

    const handleReset = () => {
        setSearch('');
        setDateRange(undefined);
        setClusterScores([]);
        setCompetences([]);
        setCycles([]);
        setLowerBounds([]);
        setUpperBounds([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range, title, competence titles
    const filteredClusterScoreAnalytics = useMemo(() => {
        let result = allClusterScoreAnalytics;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter((c) => {
                const competence =
                    competenceTitles[
                        clusterScoreTitles[c.clusterId]?.competenceId
                    ];
                return (
                    competence?.title?.toLowerCase().includes(lowerSearch) ||
                    competence?.description?.toLowerCase().includes(lowerSearch)
                );
            });
        }

        if (dateRange?.from) {
            const from = dateRange.from.getTime();
            result = result.filter((c) => c.createdAt.getTime() >= from);
        }
        if (dateRange?.to) {
            const to = dateRange.to.getTime();
            result = result.filter((c) => c.createdAt.getTime() <= to);
        }

        if (clusterScores.length > 0) {
            result = result.filter(
                (c) =>
                    clusterScoreTitles[c.clusterId] &&
                    clusterScores.includes(
                        clusterScoreTitles[c.clusterId].title ?? '',
                    ),
            );
        }

        if (competences.length > 0) {
            result = result.filter((c) => {
                const title =
                    competenceTitles[
                        clusterScoreTitles[c.clusterId]?.competenceId
                    ]?.title;
                return title ? competences.includes(title) : false;
            });
        }

        if (cycles.length > 0) {
            result = result.filter(
                (c) =>
                    cycleTitles[c.cycleId] &&
                    cycles.includes(cycleTitles[c.cycleId] ?? ''),
            );
        }
        if (lowerBounds.length > 0) {
            const numericLowerBounds = lowerBounds.map((b) => Number(b));
            result = result.filter(
                (c) =>
                    c.lowerBound !== null &&
                    numericLowerBounds.includes(c.lowerBound),
            );
        }
        if (upperBounds.length > 0) {
            const numericUpperBounds = upperBounds.map((b) => Number(b));
            result = result.filter(
                (c) =>
                    c.upperBound !== null &&
                    numericUpperBounds.includes(c.upperBound),
            );
        }
        return result;
    }, [
        allClusterScoreAnalytics,
        search,
        dateRange,
        clusterScoreTitles,
        competenceTitles,
        cycleTitles,
        clusterScores,
        competences,
        cycles,
        lowerBounds,
        upperBounds,
    ]);

    // Client-side sorting for all fields
    const sortedClusterScoreAnalytics = useMemo(() => {
        return [...filteredClusterScoreAnalytics].sort((a, b) => {
            switch (sortField) {
                case 'competenceTitle': {
                    const nameA =
                        competenceTitles[
                            clusterScoreTitles[a.clusterId]?.competenceId
                        ]?.title ?? '';
                    const nameB =
                        competenceTitles[
                            clusterScoreTitles[b.clusterId]?.competenceId
                        ]?.title ?? '';
                    return sortDirection === SortDirection.ASC
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                }
                case 'clusterTitle': {
                    const nameA = clusterScoreTitles[a.clusterId]?.title ?? '';
                    const nameB = clusterScoreTitles[b.clusterId]?.title ?? '';
                    return sortDirection === SortDirection.ASC
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                }
                case 'createdAt':
                    return sortDirection === SortDirection.ASC
                        ? a.createdAt?.getTime() - b.createdAt?.getTime()
                        : b.createdAt?.getTime() - a.createdAt?.getTime();
                case 'cycleTitle': {
                    const nameA = cycleTitles[a.cycleId] ?? '';
                    const nameB = cycleTitles[b.cycleId] ?? '';
                    return sortDirection === SortDirection.ASC
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                }
                case 'lowerBound': {
                    const countA = a.lowerBound ?? 0;
                    const countB = b.lowerBound ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'upperBound': {
                    const countA = a.upperBound ?? 0;
                    const countB = b.upperBound ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'employeeCount': {
                    const countA = a.employeesCount ?? 0;
                    const countB = b.employeesCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'minScore': {
                    const countA = a.minScore ?? 0;
                    const countB = b.minScore ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'maxScore': {
                    const countA = a.maxScore ?? 0;
                    const countB = b.maxScore ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'averageScore': {
                    const countA = a.averageScore ?? 0;
                    const countB = b.averageScore ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                default:
                    return 0;
            }
        });
    }, [
        filteredClusterScoreAnalytics,
        sortField,
        sortDirection,
        clusterScoreTitles,
        competenceTitles,
        cycleTitles,
    ]);

    const totalPages = Math.ceil(
        sortedClusterScoreAnalytics.length / ITEMS_PER_PAGE,
    );
    const paginatedClusterScoreAnalytics = sortedClusterScoreAnalytics.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    const totalClusterScoreAnalytics = allClusterScoreAnalytics.length;

    return (
        <div className="mx-auto max-w-8xl gap-8 flex flex-col w-full min-w-0">
            <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap min-w-0">
                    {/* Table Header */}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                            360° Feedback Cluster Score Analytics Table
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage cluster score analytics across your
                            organization.{' '}
                            <span className="font-medium text-foreground">
                                {totalClusterScoreAnalytics}
                            </span>{' '}
                            total cluster score analytics.
                        </p>
                    </div>
                </div>

                {/* Table Content */}
                <CardContent className="flex flex-col gap-6 m-0 p-0 min-w-0 w-full">
                    {/* Filters */}
                    <ClusterScoreAnalyticsFilters
                        search={search}
                        onSearchChange={(val) => {
                            setSearch(val);
                            setCurrentPage(1);
                        }}
                        dateRange={dateRange}
                        onDateRangeChange={(range) => {
                            setDateRange(range);
                            setCurrentPage(1);
                        }}
                        clusterScores={clusterScores}
                        onClusterScoresChange={(val) => {
                            setClusterScores(val);
                            setCurrentPage(1);
                        }}
                        clusterScoreOptions={clusterScoreTitlesOptions}
                        competences={competences}
                        onCompetencesChange={(val) => {
                            setCompetences(val);
                            setCurrentPage(1);
                        }}
                        competenceOptions={competenceTitlesOptions}
                        cycles={cycles}
                        onCyclesChange={(val) => {
                            setCycles(val);
                            setCurrentPage(1);
                        }}
                        cycleOptions={cycleTitlesOptions}
                        lowerBounds={lowerBounds}
                        onLowerBoundsChange={(val) => {
                            setLowerBounds(val);
                            setCurrentPage(1);
                        }}
                        lowerBoundOptions={lowerBoundOptions}
                        upperBounds={upperBounds}
                        onUpperBoundsChange={(val) => {
                            setUpperBounds(val);
                            setCurrentPage(1);
                        }}
                        upperBoundOptions={upperBoundOptions}
                        onReset={handleReset}
                    />

                    {/* Loading State */}
                    {(isLoading ||
                        isClusterScoreTitlesLoading ||
                        isCycleTitlesLoading) && (
                        <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                            <Spinner />
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <h3 className="text-lg font-semibold text-destructive">
                                Failed to load cluster score analytics
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Please try refreshing the page.
                            </p>
                        </div>
                    )}

                    {/* Table */}
                    {!isLoading && !isError && (
                        <>
                            <ClusterScoreAnalyticsTable
                                clusterScoreAnalytics={
                                    paginatedClusterScoreAnalytics
                                }
                                competenceTitles={competenceTitles}
                                clusterScoreTitles={clusterScoreTitles}
                                cycleTitles={cycleTitles}
                                sortField={sortField}
                                sortDirection={sortDirection}
                                onSort={handleSort}
                                resetTrigger={resetTrigger}
                            />

                            {/* Pagination */}
                            <TablePagination
                                entityName="cluster score analytics"
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={
                                    filteredClusterScoreAnalytics.length
                                }
                                limit={ITEMS_PER_PAGE}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
