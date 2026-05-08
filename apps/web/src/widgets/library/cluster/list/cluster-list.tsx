'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { SortDirection } from '@entities/feedback360/cycle/model/types';
import {
    useClustersQuery,
    useCompetenceTitlesQuery,
} from '@entities/library/cluster/api/cluster.queries';
import type { Cluster } from '@entities/library/cluster/model/mappers';
import { ClusterFilters } from '@entities/library/cluster/ui/cluster-filters';
import { ClusterTable } from '@entities/library/cluster/ui/cluster-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 10;

export function ClusterList() {
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [competences, setCompetences] = useState<string[]>([]);
    const [lowerBounds, setLowerBounds] = useState<string[]>([]);
    const [upperBounds, setUpperBounds] = useState<string[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Feature dialogs state
    const [deleteCluster, setDeleteCluster] = useState<Cluster | null>(null);

    // Always fetch all clusters - filtering is done client-side
    const { data: allClusters = [], isLoading, isError } = useClustersQuery({});

    // Use allClusters for both display and filter options
    const clusters = allClusters;
    const allCompetenceIds = Array.from(
        new Set(
            allClusters
                .map((c) => c.competenceId)
                .filter((id) => id !== undefined && id !== null),
        ),
    );

    const { competenceTitles, isLoading: isCompetenceTitlesLoading } =
        useCompetenceTitlesQuery(allCompetenceIds);

    // Filter unique competences
    const competenceOptions = useMemo(() => {
        const uniqueCompetences = new Set<string>();

        allClusters.forEach((cluster) => {
            const title = cluster.competenceId
                ? competenceTitles[cluster.competenceId]
                : undefined;
            if (title && title.trim() !== '') {
                uniqueCompetences.add(title);
            }
        });

        return Array.from(uniqueCompetences).sort((a, b) => a.localeCompare(b));
    }, [allClusters, competenceTitles]);

    const lowerBoundOptions = useMemo(() => {
        const uniqueLowerBounds = new Set<number>();

        allClusters.forEach((cluster) => {
            if (cluster.lowerBound !== null) {
                uniqueLowerBounds.add(cluster.lowerBound);
            }
        });

        return Array.from(uniqueLowerBounds)
            .sort((a, b) => a - b)
            .map((bound) => String(bound));
    }, [allClusters]);

    const upperBoundOptions = useMemo(() => {
        const uniqueUpperBounds = new Set<number>();

        allClusters.forEach((cluster) => {
            if (cluster.upperBound !== null) {
                uniqueUpperBounds.add(cluster.upperBound);
            }
        });

        return Array.from(uniqueUpperBounds)
            .sort((a, b) => a - b)
            .map((bound) => String(bound));
    }, [allClusters]);

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
        setCompetences([]);
        setLowerBounds([]);
        setUpperBounds([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range, title, competence titles
    const filteredClusters = useMemo(() => {
        let result = clusters;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (c) =>
                    (c.title && c.title.toLowerCase().includes(lowerSearch)) ||
                    (c.description &&
                        c.description.toLowerCase().includes(lowerSearch)),
            );
        }

        if (dateRange?.from) {
            const from = dateRange.from.getTime();
            result = result.filter((c) => c.createdAt.getTime() >= from);
        }
        if (dateRange?.to) {
            const to = dateRange.to.getTime();
            result = result.filter((c) => c.createdAt.getTime() <= to);
        }

        if (competences.length > 0) {
            result = result.filter(
                (c) =>
                    competenceTitles[c.competenceId] &&
                    competenceTitles[c.competenceId] !== null &&
                    competences.includes(
                        competenceTitles[c.competenceId] ?? '',
                    ),
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
        competences,
        search,
        dateRange,
        competenceTitles,
        lowerBounds,
        upperBounds,
        competenceOptions,
        competences,
        lowerBoundOptions,
        upperBoundOptions,
    ]);

    // Client-side sorting for all fields
    const sortedClusters = useMemo(() => {
        return [...filteredClusters].sort((a, b) => {
            switch (sortField) {
                case 'title': {
                    const nameA = a.title ?? '';
                    const nameB = b.title ?? '';
                    return sortDirection === SortDirection.ASC
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                }
                case 'createdAt':
                    return sortDirection === SortDirection.ASC
                        ? a.createdAt?.getTime() - b.createdAt?.getTime()
                        : b.createdAt?.getTime() - a.createdAt?.getTime();
                case 'competenceTitle': {
                    const competencesA = competenceTitles[a.competenceId] ?? '';
                    const competencesB = competenceTitles[b.competenceId] ?? '';
                    return sortDirection === SortDirection.ASC
                        ? competencesA.localeCompare(competencesB)
                        : competencesB.localeCompare(competencesA);
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
                default:
                    return 0;
            }
        });
    }, [
        filteredClusters,
        sortField,
        sortDirection,
        competenceTitles,
        lowerBounds,
        upperBounds,
        competences,
    ]);

    const totalPages = Math.ceil(sortedClusters.length / ITEMS_PER_PAGE);
    const paginatedClusters = sortedClusters.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const totalClusters = clusters.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            Library of Clusters
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage clusters across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {totalClusters}
                            </span>{' '}
                            total clusters.
                        </p>
                    </div>
                    {/* <CreateCompetenceForm
                        trigger={
                            <Button size="lg" className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Competence
                            </Button>
                        }
                    /> */}
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Clusters</CardTitle>
                        <CardDescription>
                            Search, filter, and manage clusters.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <ClusterFilters
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
                            competences={competences}
                            onCompetencesChange={(val) => {
                                setCompetences(val);
                                setCurrentPage(1);
                            }}
                            competenceOptions={competenceOptions}
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
                        {(isLoading || isCompetenceTitlesLoading) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load clusters
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading && !isError && (
                            <>
                                <ClusterTable
                                    clusters={paginatedClusters}
                                    competenceTitles={competenceTitles}
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                    onSort={handleSort}
                                    resetTrigger={resetTrigger}
                                    // onDelete={setDeleteCompetence}
                                />

                                {/* Pagination */}
                                <TablePagination
                                    entityName="clusters"
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={filteredClusters.length}
                                    limit={ITEMS_PER_PAGE}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Feature Dialogs */}
            {/* <ForceFinishCycleDialog
                cycle={forceFinishCycle}
                onClose={() => setForceFinishCycle(null)}
            />
            <DeleteCycleDialog
                cycle={deleteCycle}
                onClose={() => setDeleteCycle(null)}
            /> */}
        </main>
    );
}
