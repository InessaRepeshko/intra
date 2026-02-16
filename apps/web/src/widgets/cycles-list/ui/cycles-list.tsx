'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { mockCycles } from '@/entities/cycle/model/mocks';
import {
    CycleResponse,
    CycleStage,
    SortDirection,
} from '@/entities/cycle/model/types';
import { CyclesFilters } from '@/entities/cycle/ui/cycles-filters';
import { CyclesPagination } from '@/entities/cycle/ui/cycles-pagination';
import { CyclesTable } from '@/entities/cycle/ui/cycles-table';
import { Button } from '@/shared/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/ui/card';

const ITEMS_PER_PAGE = 5;

export function CyclesList() {
    const [search, setSearch] = useState('');
    const [stage, setStage] = useState('ALL');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);

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
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
    };

    const filteredCycles = useMemo(() => {
        let result: CycleResponse[] = [...mockCycles];

        // Search filter
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.title.toLowerCase().includes(q) ||
                    c.description?.toLowerCase().includes(q),
            );
        }

        // Stage filter
        if (stage !== 'ALL') {
            result = result.filter((c) => c.stage === stage);
        }

        // Date range filter
        if (dateRange?.from) {
            const from = dateRange.from.getTime();
            result = result.filter(
                (c) => new Date(c.startDate).getTime() >= from,
            );
        }
        if (dateRange?.to) {
            const to = dateRange.to.getTime();
            result = result.filter((c) => new Date(c.endDate).getTime() <= to);
        }

        // Sorting
        result.sort((a, b) => {
            let comparison = 0;
            const field = sortField as keyof CycleResponse;

            const aVal = a[field] ?? '';
            const bVal = b[field] ?? '';

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                comparison = aVal.localeCompare(bVal);
            } else if (typeof aVal === 'number' && typeof bVal === 'number') {
                comparison = aVal - bVal;
            }

            return sortDirection === SortDirection.ASC
                ? comparison
                : -comparison;
        });

        return result;
    }, [search, stage, dateRange, sortField, sortDirection]);

    const totalPages = Math.ceil(filteredCycles.length / ITEMS_PER_PAGE);
    const paginatedCycles = filteredCycles.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const activeCycles = mockCycles.filter(
        (c) => c.stage === CycleStage.ACTIVE,
    ).length;
    const totalCycles = mockCycles.length;

    return (
        <main className="min-h-screen bg-muted/30">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
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
                    <Button size="lg" className="shrink-0">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Cycle
                    </Button>
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg">All Cycles</CardTitle>
                        <CardDescription>
                            Search, filter, and manage your feedback cycles.
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
                            onReset={handleReset}
                        />

                        {/* Table */}
                        <CyclesTable
                            cycles={paginatedCycles}
                            sortField={sortField}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                        />

                        {/* Pagination */}
                        <CyclesPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredCycles.length}
                            limit={ITEMS_PER_PAGE}
                            onPageChange={setCurrentPage}
                        />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
