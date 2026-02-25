'use client';

import { Loader2, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    useCyclesQuery,
    useReviewCountsQuery,
} from '@entities/feedback360/cycle/api/cycle.queries';
import type { Cycle } from '@entities/feedback360/cycle/model/mapper';
import {
    CycleStage,
    SortDirection,
} from '@entities/feedback360/cycle/model/types';
import { CyclesFilters } from '@entities/feedback360/cycle/ui/cycles-filters';
import { CyclesPagination } from '@entities/feedback360/cycle/ui/cycles-pagination';
import { CyclesTable } from '@entities/feedback360/cycle/ui/cycles-table';
import { CreateCycleForm } from '@features/feedback360/cycle/create/ui/CreateCycleForm';
import { DeleteCycleDialog } from '@features/feedback360/cycle/delete/ui/DeleteCycleDialog';
import { ForceFinishCycleDialog } from '@features/feedback360/cycle/force-finish/ui/ForceFinishCycleDialog';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';

const ITEMS_PER_PAGE = 5;

export function CyclesList() {
    const [search, setSearch] = useState('');
    const [stage, setStage] = useState('ALL');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [reviewCount, setReviewCount] = useState('ALL');
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);

    // Feature dialogs state
    const [forceFinishCycle, setForceFinishCycle] = useState<Cycle | null>(
        null,
    );
    const [deleteCycle, setDeleteCycle] = useState<Cycle | null>(null);

    // Build query params (exclude client-side only fields like reviewCount)
    const queryParams = useMemo(() => {
        const params: Record<string, unknown> = {};

        if (search.trim()) params.search = search.trim();
        if (stage !== 'ALL') params.stage = stage;
        // Only send sort params for server-side sortable fields
        if (sortField && sortField !== 'reviewCount') {
            params.sortBy = sortField;
            params.sortDirection = sortDirection;
        }

        return params;
    }, [search, stage, sortField, sortDirection]);

    const {
        data: cycles = [],
        isLoading,
        isError,
    } = useCyclesQuery(queryParams);

    // Fetch review counts for all cycles
    const cycleIds = cycles.map((c) => c.id);
    const { reviewCounts } = useReviewCountsQuery(cycleIds);

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
        setStage('ALL');
        setDateRange(undefined);
        setReviewCount('ALL');
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
    };

    // Client-side filtering for date range and review count
    const filteredCycles = useMemo(() => {
        let result = cycles;

        if (dateRange?.from) {
            const from = dateRange.from.getTime();
            result = result.filter((c) => c.startDate.getTime() >= from);
        }
        if (dateRange?.to) {
            const to = dateRange.to.getTime();
            result = result.filter((c) => c.endDate.getTime() <= to);
        }

        // Filter by review count
        if (reviewCount !== 'ALL') {
            result = result.filter((c) => {
                const count = reviewCounts[c.id] ?? 0;
                switch (reviewCount) {
                    case '0':
                        return count === 0;
                    case '1-10':
                        return count >= 1 && count <= 10;
                    case '11-50':
                        return count >= 11 && count <= 50;
                    case '50+':
                        return count > 50;
                    default:
                        return true;
                }
            });
        }

        return result;
    }, [cycles, dateRange, reviewCount, reviewCounts]);

    // Client-side sorting for reviewCount
    const sortedCycles = useMemo(() => {
        if (sortField !== 'reviewCount') {
            return filteredCycles;
        }

        return [...filteredCycles].sort((a, b) => {
            const countA = reviewCounts[a.id] ?? 0;
            const countB = reviewCounts[b.id] ?? 0;
            return sortDirection === SortDirection.ASC
                ? countA - countB
                : countB - countA;
        });
    }, [filteredCycles, sortField, sortDirection, reviewCounts]);

    const totalPages = Math.ceil(sortedCycles.length / ITEMS_PER_PAGE);
    const paginatedCycles = sortedCycles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const activeCycles = cycles.filter(
        (c) => c.stage === CycleStage.ACTIVE,
    ).length;
    const totalCycles = cycles.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            360° Feedback Cycles
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage and monitor feedback cycles across your
                            organization.{' '}
                            <span className="font-medium text-foreground">
                                {activeCycles}
                            </span>{' '}
                            active of{' '}
                            <span className="font-medium text-foreground">
                                {totalCycles}
                            </span>{' '}
                            total cycles.
                        </p>
                    </div>
                    <CreateCycleForm
                        trigger={
                            <Button size="lg" className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Cycle
                            </Button>
                        }
                    />
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">All Cycles</CardTitle>
                        <CardDescription>
                            Search, filter, and manage feedback 360° cycles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <CyclesFilters
                            search={search}
                            onSearchChange={(val) => {
                                setSearch(val);
                                setCurrentPage(1);
                            }}
                            stage={stage}
                            onStageChange={(val) => {
                                setStage(val);
                                setCurrentPage(1);
                            }}
                            dateRange={dateRange}
                            onDateRangeChange={(range) => {
                                setDateRange(range);
                                setCurrentPage(1);
                            }}
                            reviewCount={reviewCount}
                            onReviewCountChange={(val) => {
                                setReviewCount(val);
                                setCurrentPage(1);
                            }}
                            onReset={handleReset}
                        />

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load cycles
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading && !isError && (
                            <>
                                <CyclesTable
                                    cycles={paginatedCycles}
                                    reviewCounts={reviewCounts}
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                    onSort={handleSort}
                                    onForceFinish={setForceFinishCycle}
                                    onDelete={setDeleteCycle}
                                />

                                {/* Pagination */}
                                <CyclesPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={filteredCycles.length}
                                    limit={ITEMS_PER_PAGE}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Feature Dialogs */}
            <ForceFinishCycleDialog
                cycle={forceFinishCycle}
                onClose={() => setForceFinishCycle(null)}
            />
            <DeleteCycleDialog
                cycle={deleteCycle}
                onClose={() => setDeleteCycle(null)}
            />
        </main>
    );
}
