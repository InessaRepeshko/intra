'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { useCycleTitlesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import { RESPONDENT_CATEGORIES_ENUM_VALUES } from '@entities/feedback360/respondent/model/types';
import {
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
    SortDirection,
} from '@entities/feedback360/review/model/types';
import {
    useRateeFullNamesQuery,
    useRateePositionTitlesQuery,
    useRateeTeamTitlesQuery,
    useReportsQuery,
    useRespondentCategoriesQuery,
    useReviewAnswerCountsQuery,
    useReviewStagesQuery,
} from '@entities/reporting/report/api/report.queries';
import type { Report } from '@entities/reporting/report/model/mappers';
import { ReportsFilters } from '@entities/reporting/report/ui/reports-filters';
import { ReportsTable } from '@entities/reporting/report/ui/reports-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function ReportsList() {
    const [search, setSearch] = useState('');
    const [stages, setStages] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [cycles, setCycles] = useState<string[]>([]);
    const [teams, setTeams] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Feature dialogs state
    const [deleteReport, setDeleteReport] = useState<Report | null>(null);

    // Build query params (exclude client-side only fields)
    const queryParams = useMemo(() => {
        const params: Record<string, unknown> = {};

        if (search.trim()) params.search = search.trim();
        if (stages.length === 1) params.stage = stages[0];
        // Only send sort params for server-side sortable fields
        if (sortField) {
            params.sortBy = sortField;
            params.sortDirection = sortDirection;
        }
        if (cycles.length === 1 && cycles[0] !== 'None')
            params.cycleTitle = cycles[0];

        return params;
    }, [search, stages, sortField, sortDirection, cycles]);

    const {
        data: reports = [],
        isLoading,
        isError,
    } = useReportsQuery(queryParams);

    const { data: allReportsData = [] } = useReportsQuery({});
    const allReviewIds = allReportsData.map((r) => r.reviewId);

    // Fetch ratee full names, team and position titles for all reports
    const { rateeFullNames } = useRateeFullNamesQuery(allReviewIds);
    const { rateeTeamTitles } = useRateeTeamTitlesQuery(allReviewIds);
    const { rateePositionTitles } = useRateePositionTitlesQuery(allReviewIds);

    // Filter unique teams and positions
    const teamOptions = useMemo(() => {
        const uniqueTeams = new Map<number, { id: number; title: string }>();

        allReportsData.forEach((report) => {
            if (
                report.reviewId &&
                rateeTeamTitles[report.reviewId] &&
                rateeTeamTitles[report.reviewId]?.trim() !== ''
            ) {
                uniqueTeams.set(report.reviewId, {
                    id: report.reviewId,
                    title: rateeTeamTitles[report.reviewId] ?? '',
                });
            }
        });

        return Array.from(uniqueTeams.values()).sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }, [allReportsData]);

    const positionOptions = useMemo(() => {
        const uniquePositions = new Map<
            number,
            { id: number; title: string }
        >();

        allReportsData.forEach((report) => {
            if (
                report.reviewId &&
                rateePositionTitles[report.reviewId] &&
                rateePositionTitles[report.reviewId]?.trim() !== ''
            ) {
                uniquePositions.set(report.reviewId, {
                    id: report.reviewId,
                    title: rateePositionTitles[report.reviewId] ?? '',
                });
            }
        });

        return Array.from(uniquePositions.values()).sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }, [allReportsData]);

    // Fetch cycle titles for all reports
    const allCycleIds = reports
        .map((r) => r.cycleId)
        .filter((id) => id !== null && id !== undefined);
    const { cycleTitles } = useCycleTitlesQuery(allCycleIds);

    const cycleOptions = useMemo(() => {
        const titles = new Set(
            Object.values(cycleTitles).filter(
                (title) => title && title.trim() !== '',
            ),
        );

        const hasNoCycleReports = allReportsData.some(
            (r) => r.cycleId === null || r.cycleId === undefined,
        );

        const sortedTitles = Array.from(titles).sort();
        if (hasNoCycleReports) {
            sortedTitles.push('None');
        }

        return sortedTitles;
    }, [cycleTitles, allReportsData]);

    // Fetch review stages for all reports
    const { reviewStages, isLoading: isReviewStagesLoading } =
        useReviewStagesQuery(allReviewIds);

    const stageOptions = useMemo(() => {
        const uniqueStages = new Map<
            number,
            { id: number; title: ReviewStage }
        >();

        allReportsData.forEach((report) => {
            if (report.reviewId && reviewStages[report.reviewId]) {
                uniqueStages.set(report.reviewId, {
                    id: report.reviewId,
                    title: reviewStages[report.reviewId],
                });
            }
        });

        return Array.from(uniqueStages.values()).sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }, [allReportsData]);

    // Fetch respondent categories and answer counts for all reports
    const { respondentCategories } = useRespondentCategoriesQuery(allReviewIds);
    const { answerCounts } = useReviewAnswerCountsQuery(allReviewIds);

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
        setCycles([]);
        setTeams([]);
        setPositions([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range and cycle title
    const filteredReports = useMemo(() => {
        let result = reports;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (r) =>
                    rateeFullNames[r.reviewId] &&
                    rateeFullNames[r.reviewId]
                        .toLowerCase()
                        .includes(lowerSearch),
            );
        }

        if (dateRange?.from) {
            const from = dateRange.from.getTime();
            result = result.filter((r) => r.createdAt.getTime() >= from);
        }
        if (dateRange?.to) {
            const to = dateRange.to.getTime();
            result = result.filter((r) => r.createdAt.getTime() <= to);
        }

        if (stages.length > 0) {
            result = result.filter(
                (r) =>
                    reviewStages[r.reviewId] &&
                    stages.includes(reviewStages[r.reviewId]),
            );
        }

        if (cycles.length > 0) {
            result = result.filter((r) => {
                const title =
                    r.cycleId === null || r.cycleId === undefined
                        ? 'None'
                        : (cycleTitles[r.cycleId!] ?? '');
                return cycles.includes(title);
            });
        }

        if (teams.length > 0) {
            result = result.filter(
                (r) =>
                    rateeTeamTitles[r.reviewId] &&
                    rateeTeamTitles[r.reviewId] !== null &&
                    teams.includes(rateeTeamTitles[r.reviewId] ?? ''),
            );
        }

        if (positions.length > 0) {
            result = result.filter(
                (r) =>
                    rateePositionTitles[r.reviewId] &&
                    rateePositionTitles[r.reviewId] !== null &&
                    positions.includes(rateePositionTitles[r.reviewId] ?? ''),
            );
        }

        return result;
    }, [
        reports,
        search,
        dateRange,
        stages,
        cycles,
        cycleTitles,
        teams,
        positions,
    ]);

    // Client-side sorting for
    const sortedReports = useMemo(() => {
        if (
            sortField !== 'rateeFullName' &&
            sortField !== 'rateePositionTitle' &&
            sortField !== 'rateeTeamTitle' &&
            sortField !== 'cycleTitle' &&
            sortField !== 'reviewStage' &&
            sortField !== 'respondentCategories' &&
            sortField !== 'answerCounts'
        ) {
            return filteredReports;
        }

        return [...filteredReports].sort((a, b) => {
            if (sortField === 'rateeFullName') {
                const countA = rateeFullNames[a.reviewId] ?? '';
                const countB = rateeFullNames[b.reviewId] ?? '';
                return sortDirection === SortDirection.ASC
                    ? countA.localeCompare(countB)
                    : countB.localeCompare(countA);
            }
            if (sortField === 'rateePositionTitle') {
                const countA = rateePositionTitles[a.reviewId] ?? '';
                const countB = rateePositionTitles[b.reviewId] ?? '';
                return sortDirection === SortDirection.ASC
                    ? countA.localeCompare(countB)
                    : countB.localeCompare(countA);
            }
            if (sortField === 'rateeTeamTitle') {
                const countA = rateeTeamTitles[a.reviewId] ?? '';
                const countB = rateeTeamTitles[b.reviewId] ?? '';
                return sortDirection === SortDirection.ASC
                    ? countA.localeCompare(countB)
                    : countB.localeCompare(countA);
            }
            if (
                sortField === 'cycleTitle' &&
                a.cycleId !== undefined &&
                b.cycleId !== undefined &&
                a.cycleId !== null &&
                b.cycleId !== null
            ) {
                const countA = cycleTitles[a.cycleId] ?? '';
                const countB = cycleTitles[b.cycleId] ?? '';
                return sortDirection === SortDirection.ASC
                    ? countA.localeCompare(countB)
                    : countB.localeCompare(countA);
            }
            if (sortField === 'reviewStage') {
                const countA = reviewStages[a.reviewId]
                    ? REVIEW_STAGE_ENUM_VALUES.indexOf(reviewStages[a.reviewId])
                    : -1;
                const countB = reviewStages[b.reviewId]
                    ? REVIEW_STAGE_ENUM_VALUES.indexOf(reviewStages[b.reviewId])
                    : -1;
                return sortDirection === SortDirection.ASC
                    ? countA - countB
                    : countB - countA;
            }
            if (sortField === 'respondentCategories') {
                const countA = respondentCategories[a.reviewId]
                    ? RESPONDENT_CATEGORIES_ENUM_VALUES.indexOf(
                        respondentCategories[a.reviewId][0],
                    )
                    : -1;
                const countB = respondentCategories[b.reviewId]
                    ? RESPONDENT_CATEGORIES_ENUM_VALUES.indexOf(
                        respondentCategories[b.reviewId][0],
                    )
                    : -1;
                return sortDirection === SortDirection.ASC
                    ? countA - countB
                    : countB - countA;
            }
            if (sortField === 'answerCounts') {
                const countA = answerCounts[a.reviewId]
                    ? answerCounts[a.reviewId]
                    : -1;
                const countB = answerCounts[b.reviewId]
                    ? answerCounts[b.reviewId]
                    : -1;
                return sortDirection === SortDirection.ASC
                    ? countA - countB
                    : countB - countA;
            }
            return 0;
        });
    }, [
        filteredReports,
        sortField,
        sortDirection,
        cycleTitles,
        reviewStages,
        respondentCategories,
        answerCounts,
    ]);

    const totalPages = Math.ceil(sortedReports.length / ITEMS_PER_PAGE);
    const paginatedReports = sortedReports.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const activeReports = reports.filter(
        (r) =>
            reviewStages[r.reviewId] === ReviewStage.PREPARING_REPORT ||
            reviewStages[r.reviewId] === ReviewStage.PROCESSING_BY_HR ||
            reviewStages[r.reviewId] === ReviewStage.PUBLISHED ||
            reviewStages[r.reviewId] === ReviewStage.ANALYSIS,
    ).length;
    const totalReports = reports.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            360° Feedback Reports
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Monitor reports across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {activeReports}
                            </span>{' '}
                            active of{' '}
                            <span className="font-medium text-foreground">
                                {totalReports}
                            </span>{' '}
                            total reports.
                        </p>
                    </div>
                    {/* <CreateReportForm
                        trigger={
                            <Button size="lg" className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Report
                            </Button>
                        }
                    /> */}
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Reports</CardTitle>
                        <CardDescription>
                            Search, filter, and monitor reports.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <ReportsFilters
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
                            cycles={cycles}
                            onCyclesChange={(val) => {
                                setCycles(val);
                                setCurrentPage(1);
                            }}
                            teams={teams}
                            onTeamsChange={(val) => {
                                setTeams(val);
                                setCurrentPage(1);
                            }}
                            positions={positions}
                            onPositionsChange={(val) => {
                                setPositions(val);
                                setCurrentPage(1);
                            }}
                            stageOptions={stageOptions}
                            cycleOptions={cycleOptions}
                            teamOptions={teamOptions}
                            positionOptions={positionOptions}
                            onReset={handleReset}
                        />

                        {/* Loading State */}
                        {(isLoading || isReviewStagesLoading) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load reports
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading && !isError && !isReviewStagesLoading && (
                            <>
                                <ReportsTable
                                    reports={paginatedReports}
                                    rateeFullNames={rateeFullNames}
                                    rateePositionTitles={rateePositionTitles}
                                    rateeTeamTitles={rateeTeamTitles}
                                    cycleTitles={cycleTitles}
                                    reviewStages={reviewStages}
                                    respondentCategories={respondentCategories}
                                    answerCounts={answerCounts}
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                    onSort={handleSort}
                                    resetTrigger={resetTrigger}
                                // onDelete={setDeleteReport}
                                />

                                {/* Pagination */}
                                <TablePagination
                                    entityName="reports"
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={filteredReports.length}
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
