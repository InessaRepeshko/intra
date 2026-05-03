'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    useCyclesQuery,
    useReviewCountsQuery,
} from '@entities/feedback360/cycle/api/cycle.queries';
import type { Cycle } from '@entities/feedback360/cycle/model/mappers';
import {
    CYCLE_STAGE_ENUM_VALUES,
    SortDirection,
} from '@entities/feedback360/cycle/model/types';
import { CyclesFilters } from '@entities/feedback360/cycle/ui/cycles-filters';
import { CyclesTable } from '@entities/feedback360/cycle/ui/cycles-table';
import { type AuthContextType } from '@entities/identity/user/model/types';
import { CreateCycleForm } from '@features/feedback360/cycle/create/ui/CreateCycleForm';
import { DeleteCycleDialog } from '@features/feedback360/cycle/delete/ui/DeleteCycleDialog';
import { ForceFinishCycleDialog } from '@features/feedback360/cycle/force-finish/ui/ForceFinishCycleDialog';
import { Button } from '@shared/components/ui/button';
import { Card, CardContent } from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function CycleList({ currentUser }: { currentUser: AuthContextType }) {
    const [search, setSearch] = useState('');
    const [stages, setStages] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Feature dialogs state
    const [forceFinishCycle, setForceFinishCycle] = useState<Cycle | null>(
        null,
    );
    const [deleteCycle, setDeleteCycle] = useState<Cycle | null>(null);

    // Build query params (exclude all sort params - sorting is client-side only)
    const queryParams = useMemo(() => {
        const params: Record<string, unknown> = {};

        if (search.trim()) params.search = search.trim();
        if (stages.length === 1) params.stage = stages[0];

        return params;
    }, [search, stages]);

    const {
        data: cycles = [],
        isLoading,
        isError,
    } = useCyclesQuery(queryParams);

    const cycleIds = useMemo(() => cycles.map((c) => c.id), [cycles]);
    const { reviewCounts, isLoading: isReviewCountsLoading } =
        useReviewCountsQuery(cycleIds);

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
        setStages([]);
        setDateRange(undefined);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range and review count
    const filteredCycles = useMemo(() => {
        let result = cycles;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (c) =>
                    (c.id && c.id.toString().includes(lowerSearch)) ||
                    c.title?.toLowerCase().includes(lowerSearch) ||
                    c.description?.toLowerCase().includes(lowerSearch),
            );
        }

        if (dateRange?.from) {
            const from = dateRange.from.getTime();
            result = result.filter((c) => c.startDate.getTime() >= from);
        }
        if (dateRange?.to) {
            const to = dateRange.to.getTime();
            result = result.filter((c) => c.endDate.getTime() <= to);
        }

        if (stages.length > 0) {
            result = result.filter((c) => c.stage && stages.includes(c.stage));
        }

        return result;
    }, [cycles, search, dateRange, stages]);

    // Client-side sorting for all fields
    const sortedCycles = useMemo(() => {
        return [...filteredCycles].sort((a, b) => {
            switch (sortField) {
                case 'id':
                    return sortDirection === SortDirection.ASC
                        ? a.id - b.id
                        : b.id - a.id;
                case 'title':
                    return sortDirection === SortDirection.ASC
                        ? (a.title ?? '').localeCompare(b.title ?? '')
                        : (b.title ?? '').localeCompare(a.title ?? '');
                case 'startDate':
                    return sortDirection === SortDirection.ASC
                        ? a.startDate?.getTime() - b.startDate?.getTime()
                        : b.startDate?.getTime() - a.startDate?.getTime();
                case 'minRespondentsThreshold': {
                    const valA = a.minRespondentsThreshold ?? 0;
                    const valB = b.minRespondentsThreshold ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'stage': {
                    const indexA = CYCLE_STAGE_ENUM_VALUES.indexOf(a.stage);
                    const indexB = CYCLE_STAGE_ENUM_VALUES.indexOf(b.stage);
                    return sortDirection === SortDirection.ASC
                        ? indexA - indexB
                        : indexB - indexA;
                }
                case 'reviewCount': {
                    const countA = reviewCounts[a.id] ?? 0;
                    const countB = reviewCounts[b.id] ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                default:
                    return 0;
            }
        });
    }, [filteredCycles, sortField, sortDirection, reviewCounts]);

    const totalPages = Math.ceil(sortedCycles.length / ITEMS_PER_PAGE);
    const paginatedCycles = sortedCycles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const totalCycles = cycles.length;

    return (
        <div className="mx-auto max-w-8xl gap-8 flex flex-col">
            <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
                {/* Table Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                            360° Feedback Cycles Table
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage and monitor cycles across your organization.{' '}
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

                {/* Table Content */}
                <CardContent className="flex flex-col gap-6 m-0 p-0">
                    {/* Filters */}
                    <CyclesFilters
                        search={search}
                        onSearchChange={(val) => {
                            setSearch(val);
                            setCurrentPage(1);
                        }}
                        stages={stages}
                        onStagesChange={(val) => {
                            setStages(val);
                            setCurrentPage(1);
                        }}
                        dateRange={dateRange}
                        onDateRangeChange={(range) => {
                            setDateRange(range);
                            setCurrentPage(1);
                        }}
                        onReset={handleReset}
                    />

                    {/* Loading State */}
                    {(isLoading || isReviewCountsLoading) && (
                        <div className="flex flex-col text-center items-center justify-center py-16 h-8 w-8 animate-spin text-muted-foreground">
                            <Spinner />
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
                    {!isLoading && !isError && !isReviewCountsLoading && (
                        <>
                            <CyclesTable
                                cycles={paginatedCycles}
                                reviewCounts={reviewCounts}
                                sortField={sortField}
                                sortDirection={sortDirection}
                                onSort={handleSort}
                                onForceFinish={setForceFinishCycle}
                                onDelete={setDeleteCycle}
                                resetTrigger={resetTrigger}
                            />

                            {/* Pagination */}
                            <TablePagination
                                entityName="cycles"
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

            {/* Feature Dialogs */}
            <ForceFinishCycleDialog
                cycle={forceFinishCycle}
                onClose={() => setForceFinishCycle(null)}
            />
            <DeleteCycleDialog
                cycle={deleteCycle}
                onClose={() => setDeleteCycle(null)}
            />
        </div>
    );
}
