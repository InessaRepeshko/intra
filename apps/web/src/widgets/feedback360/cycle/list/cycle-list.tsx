'use client';

import { format } from 'date-fns';
import {
    Archive,
    Calendar,
    FileChartLine,
    FilePlus2,
    Hourglass,
    NotebookTabs,
    Pencil,
    Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    useCyclesQuery,
    useReviewCountsQuery,
} from '@entities/feedback360/cycle/api/cycle.queries';
import type { Cycle } from '@entities/feedback360/cycle/model/mappers';
import {
    CYCLE_STAGE_ENUM_VALUES,
    CycleStage,
    SortDirection,
} from '@entities/feedback360/cycle/model/types';
import { CyclesFilters } from '@entities/feedback360/cycle/ui/cycles-filters';
import { CyclesTable } from '@entities/feedback360/cycle/ui/cycles-table';
import {
    StageBadge,
    stageConfig,
} from '@entities/feedback360/cycle/ui/stage-badge';
import { useReviewsQuery } from '@entities/feedback360/review/api/review.queries';
import { Review } from '@entities/feedback360/review/model/mappers';
import { ReviewStage } from '@entities/feedback360/review/model/types';
import { type AuthContextType } from '@entities/identity/user/model/types';
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
import { Progress } from '@shared/components/ui/progress';
import { Spinner } from '@shared/components/ui/spinner';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@shared/components/ui/tabs';
import { formatNumber } from '@shared/lib/utils/format-number';
import { StatisticsCard } from '@shared/ui/statistics-card';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function CyclesList({ currentUser }: { currentUser: AuthContextType }) {
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
    const [activeTab, setActiveTab] = useState<CycleStage>(CycleStage.ACTIVE);

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

    // All cycles (unfiltered) for the dashboard
    const { data: allCyclesData = [] } = useCyclesQuery({});

    // Fetch review counts for all cycles (covers both dashboard and admin table)
    const cycleIds = useMemo(
        () => allCyclesData.map((c) => c.id),
        [allCyclesData],
    );
    const { reviewCounts, isLoading: isReviewCountsLoading } =
        useReviewCountsQuery(cycleIds);

    const { data: allCycleReviews = [], isLoading: isCycleReviewsLoading } =
        useReviewsQuery();

    // Bucket all cycles by stage for the dashboard
    const cyclesByStage = useMemo(() => {
        const buckets = Object.fromEntries(
            CYCLE_STAGE_ENUM_VALUES.map((s) => [s, [] as Cycle[]]),
        ) as Record<CycleStage, Cycle[]>;
        allCyclesData.forEach((c) => {
            if (c.stage && buckets[c.stage]) buckets[c.stage].push(c);
        });
        return buckets;
    }, [allCyclesData]);

    const reviewsByCycleId = useMemo(() => {
        const map: Record<number, Review[]> = {};
        allCycleReviews.forEach((review) => {
            if (review.cycleId) {
                if (!map[review.cycleId]) {
                    map[review.cycleId] = [];
                }
                map[review.cycleId].push(review);
            }
        });
        return map;
    }, [allCycleReviews]);

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
    }, [cycles, dateRange, stages]);

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
    const activeCycles = cycles.filter(
        (c) => c.stage === CycleStage.ACTIVE,
    ).length;
    const totalCycles = cycles.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl gap-8 flex flex-col">
                {/* Cycles Dashboard Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            360° Feedback Cycles Dashboard
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Overview of cycles across all stages. You have{' '}
                            <span className="font-medium text-foreground">
                                {cyclesByStage[CycleStage.ACTIVE].length}
                            </span>{' '}
                            active cycles.
                        </p>
                    </div>
                </div>

                {/* Cycle stats */}
                <div className="flex flex-row flex-wrap flex-1 min-w-[95px] w-full overflow-hidden gap-6 justify-around items-center">
                    <StatisticsCard
                        title={`New`}
                        value={
                            formatNumber(
                                cyclesByStage[CycleStage.NEW].length,
                            ) ?? '-'
                        }
                        icon={FilePlus2}
                        textColor="text-blue-300"
                        width={300}
                    />
                    <StatisticsCard
                        title={`Active`}
                        value={
                            formatNumber(
                                cyclesByStage[CycleStage.ACTIVE].length,
                            ) ?? '-'
                        }
                        icon={Hourglass}
                        textColor="text-amber-300"
                        width={300}
                    />
                    <StatisticsCard
                        title={`Finished`}
                        value={
                            formatNumber(
                                cyclesByStage[CycleStage.FINISHED].length +
                                    cyclesByStage[CycleStage.PREPARING_REPORT]
                                        .length +
                                    cyclesByStage[CycleStage.PUBLISHED].length,
                            ) ?? '-'
                        }
                        icon={FileChartLine}
                        textColor="text-green-300"
                        width={300}
                    />
                    <StatisticsCard
                        title={`Archived`}
                        value={
                            formatNumber(
                                cyclesByStage[CycleStage.ARCHIVED].length +
                                    cyclesByStage[CycleStage.CANCELED].length,
                            ) ?? '-'
                        }
                        icon={Archive}
                        textColor="text-zinc-300"
                        width={300}
                    />
                </div>

                {/* Cycle List Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as CycleStage)}
                    className="w-full overflow-hidden"
                >
                    <TabsList className="flex flex-wrap h-auto justify-start gap-1 overflow-x-auto border rounded-xl">
                        {CYCLE_STAGE_ENUM_VALUES.map((stage) => (
                            <TabsTrigger
                                key={stage}
                                value={stage}
                                className="border rounded-xl"
                            >
                                {stageConfig[stage].label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {CYCLE_STAGE_ENUM_VALUES.map((stage) => (
                        <TabsContent key={stage} value={stage}>
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-foreground">
                                        {stageConfig[stage].label} Cycles
                                    </CardTitle>
                                    <CardDescription>
                                        A total of{' '}
                                        <span className="font-semibold text-foreground">
                                            {cyclesByStage[stage].length}
                                        </span>{' '}
                                        {cyclesByStage[stage].length !== 1
                                            ? 'cycles are'
                                            : 'cycle is'}{' '}
                                        currently at the{' '}
                                        {stageConfig[stage].label} stage.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {cyclesByStage[stage].length === 0 ? (
                                            <div className="py-12 text-center text-muted-foreground">
                                                No cycles in this stage
                                            </div>
                                        ) : (
                                            cyclesByStage[stage].map(
                                                (cycle) => {
                                                    const completedReviewsInCycleCount =
                                                        reviewsByCycleId[
                                                            cycle.id
                                                        ]?.filter((review) =>
                                                            [
                                                                ReviewStage.FINISHED,
                                                                ReviewStage.PREPARING_REPORT,
                                                                ReviewStage.PROCESSING_BY_HR,
                                                                ReviewStage.PUBLISHED,
                                                                ReviewStage.ANALYSIS,
                                                            ].includes(
                                                                review.stage,
                                                            ),
                                                        ).length;

                                                    return (
                                                        <div
                                                            key={cycle.id}
                                                            className="flex flex-row flex-wrap items-center justify-between gap-6 p-4 rounded-xl border border-border shadow-xs w-full overflow-hidden"
                                                        >
                                                            <div className="flex flex-col items-start gap-2 text-left flex-1 min-w-[400px]">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <p className="font-medium text-lg text-foreground break-words">
                                                                        {
                                                                            cycle.title
                                                                        }
                                                                    </p>
                                                                    <StageBadge
                                                                        stage={
                                                                            cycle.stage
                                                                        }
                                                                    />
                                                                </div>
                                                                {cycle.description && (
                                                                    <p className="text-muted-foreground text-base break-words">
                                                                        {
                                                                            cycle.description
                                                                        }
                                                                    </p>
                                                                )}
                                                                <div className="flex items-center gap-x-2 text-base flex-wrap justify-center md:justify-end">
                                                                    <span className="font-medium text-foreground flex-wrap flex gap-1">
                                                                        <span className="whitespace-nowrap inline-flex items-center gap-1">
                                                                            <Calendar className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                            <span className="text-muted-foreground">
                                                                                From{' '}
                                                                            </span>
                                                                            {format(
                                                                                cycle.startDate,
                                                                                'd MMMM yyyy',
                                                                            )}{' '}
                                                                        </span>
                                                                        <span className="whitespace-nowrap">
                                                                            <span className="text-muted-foreground">
                                                                                to{' '}
                                                                            </span>
                                                                            {format(
                                                                                cycle.endDate,
                                                                                'd MMMM yyyy',
                                                                            )}
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <Progress
                                                                value={
                                                                    ((completedReviewsInCycleCount ??
                                                                        0) /
                                                                        (reviewsByCycleId[
                                                                            cycle
                                                                                .id
                                                                        ]
                                                                            ?.length ??
                                                                            0)) *
                                                                    100
                                                                }
                                                                className="w-[200px]"
                                                            />

                                                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shrink-0 w-full md:w-auto">
                                                                <div className="flex items-center gap-x-2 text-base flex-wrap justify-center md:justify-end">
                                                                    <NotebookTabs className="shrink-0 h-4 w-4 text-muted-foreground" />
                                                                    <span className="font-medium text-foreground whitespace-nowrap flex gap-1">
                                                                        {completedReviewsInCycleCount ??
                                                                            0}
                                                                        <span className="text-muted-foreground">
                                                                            /
                                                                        </span>
                                                                        {reviewCounts[
                                                                            cycle
                                                                                .id
                                                                        ] ?? 0}
                                                                    </span>
                                                                    <span className="text-muted-foreground whitespace-nowrap">
                                                                        total
                                                                        reviews
                                                                    </span>
                                                                </div>
                                                                <Button
                                                                    asChild
                                                                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full sm:w-auto"
                                                                >
                                                                    <Link
                                                                        href={`/feedback360/cycles/${cycle.id}`}
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    );
                                                },
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>

                {/* Table Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            360° Feedback Cycles Table
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage and monitor cycles across your organization.{' '}
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
                    <CardHeader>
                        <CardTitle className="text-lg">All Cycles</CardTitle>
                        <CardDescription>
                            Search, filter, and manage cycles.
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
