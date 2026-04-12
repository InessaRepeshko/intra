'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { SortDirection } from '@entities/reporting/individual-report/model/types';
import {
    useAllStrategicReportRateesQuery,
    useStrategicReportAllTeamTitlesQuery,
    useStrategicReportsQuery,
} from '@entities/reporting/strategic-report/api/strategic-report.queries';
import { StrategicReportsFilters } from '@entities/reporting/strategic-report/ui/strategic-reports-filters';
import { StrategicReportsTable } from '@entities/reporting/strategic-report/ui/strategic-reports-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { compareStringArrays } from '@shared/lib/utils/compare-arrays';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function StrategicReportList() {
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [cycles, setCycles] = useState<string[]>([]);
    const [teams, setTeams] = useState<string[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Feature dialogs state
    const [deleteReport, setDeleteReport] = useState<Report | null>(null);

    const {
        data: allReportsData = [],
        isLoading,
        isError,
    } = useStrategicReportsQuery({});
    const allCycleIds = allReportsData.map((r) => r.cycleId);

    // Fetch ratees and team titles for all reports
    const { ratees: rateeData, isLoading: isRateesLoading } =
        useAllStrategicReportRateesQuery(allCycleIds);
    const { teamTitles, isLoading: isTeamTitlesLoading } =
        useStrategicReportAllTeamTitlesQuery(allCycleIds);

    // Filter unique cycles and teams for filters
    const cycleOptions = useMemo(() => {
        const uniqueCycles = new Set<string>();

        allReportsData.forEach((r) => {
            const title = r.cycleTitle;
            if (title && title.trim() !== '') {
                uniqueCycles.add(title);
            }
        });

        return Array.from(uniqueCycles)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));
    }, [allReportsData]);

    const teamOptions = useMemo(() => {
        const uniqueTeams = new Set<string>();

        allReportsData.forEach((r) => {
            const titlesArray = teamTitles[r.cycleId]?.map((t) => t.title);
            titlesArray?.forEach((title) => {
                if (title && title.trim() !== '') {
                    uniqueTeams.add(title);
                }
            });
        });

        return Array.from(uniqueTeams)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));
    }, [allReportsData, teamTitles]);

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
        setCycles([]);
        setTeams([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range and cycle title
    const filteredReports = useMemo(() => {
        let result = allReportsData;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (r) =>
                    r.id.toString().includes(lowerSearch) ||
                    (r.cycleTitle &&
                        r.cycleTitle.toLowerCase().includes(lowerSearch)),
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

        if (cycles.length > 0) {
            result = result.filter((r) => {
                const title =
                    r.cycleId === null || r.cycleId === undefined
                        ? 'None'
                        : (r.cycleTitle ?? '');
                return cycles.includes(title);
            });
        }

        if (teams.length > 0) {
            result = result.filter(
                (r) =>
                    teamTitles[r.cycleId] &&
                    teamTitles[r.cycleId].some((t) => teams.includes(t.title)),
            );
        }

        return result;
    }, [
        allReportsData,
        search,
        dateRange,
        cycles,
        teams,
        teamTitles,
        rateeData,
    ]);

    // Client-side sorting for all fields
    const sortedReports = useMemo(() => {
        return [...filteredReports].sort((a, b) => {
            switch (sortField) {
                case 'id': {
                    return sortDirection === SortDirection.ASC
                        ? a.id - b.id
                        : b.id - a.id;
                }
                case 'cycle': {
                    const titleA = a.cycleTitle ?? '';
                    const titleB = b.cycleTitle ?? '';
                    return sortDirection === SortDirection.ASC
                        ? titleA.localeCompare(titleB)
                        : titleB.localeCompare(titleA);
                }
                case 'ratees': {
                    const rateesA =
                        rateeData[a.cycleId]?.ratees.map((r) => r.fullName) ||
                        [];
                    const rateesB =
                        rateeData[b.cycleId]?.ratees.map((r) => r.fullName) ||
                        [];
                    const comparison = compareStringArrays(rateesA, rateesB);
                    return sortDirection === SortDirection.ASC
                        ? comparison
                        : -comparison;
                }
                case 'respondentCount': {
                    const countA = a.respondentCount ?? 0;
                    const countB = b.respondentCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'answerCount': {
                    const countA = a.answerCount ?? 0;
                    const countB = b.answerCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'reviewerCount': {
                    const countA = a.reviewerCount ?? 0;
                    const countB = b.reviewerCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'teams': {
                    const teamsA =
                        teamTitles[a.cycleId]?.map((t) => t.title) || [];
                    const teamsB =
                        teamTitles[b.cycleId]?.map((t) => t.title) || [];
                    const comparison = compareStringArrays(teamsA, teamsB);
                    return sortDirection === SortDirection.ASC
                        ? comparison
                        : -comparison;
                }
                case 'positionCount': {
                    const countA = a.positionCount ?? 0;
                    const countB = b.positionCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'competenceCount': {
                    const countA = a.competenceCount ?? 0;
                    const countB = b.competenceCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'questionCount': {
                    const countA = a.questionCount ?? 0;
                    const countB = b.questionCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'turnoutAvgPctOfRatees': {
                    const valA = a.turnoutAvgPctOfRatees ?? -1;
                    const valB = b.turnoutAvgPctOfRatees ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'turnoutAvgPctOfTeams': {
                    const valA = a.turnoutAvgPctOfTeams ?? -1;
                    const valB = b.turnoutAvgPctOfTeams ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'turnoutAvgPctOfOthers': {
                    const valA = a.turnoutAvgPctOfOthers ?? -1;
                    const valB = b.turnoutAvgPctOfOthers ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'competencePctSelf': {
                    const valA = a.competenceGeneralPctSelf ?? -1;
                    const valB = b.competenceGeneralPctSelf ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'competencePctTeam': {
                    const valA = a.competenceGeneralPctTeam ?? -1;
                    const valB = b.competenceGeneralPctTeam ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'competencePctOther': {
                    const valA = a.competenceGeneralPctOther ?? -1;
                    const valB = b.competenceGeneralPctOther ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'competenceDeltaTeam': {
                    const valA = a.competenceGeneralDeltaTeam ?? -1;
                    const valB = b.competenceGeneralDeltaTeam ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'competenceDeltaOther': {
                    const valA = a.competenceGeneralDeltaOther ?? -1;
                    const valB = b.competenceGeneralDeltaOther ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'date':
                    return sortDirection === SortDirection.ASC
                        ? a.createdAt?.getTime() - b.createdAt?.getTime()
                        : b.createdAt?.getTime() - a.createdAt?.getTime();
                default:
                    return 0;
            }
        });
    }, [filteredReports, sortField, sortDirection]);

    const totalPages = Math.ceil(sortedReports.length / ITEMS_PER_PAGE);
    const paginatedReports = sortedReports.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const totalReports = allReportsData.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            360° Feedback Strategic Reports
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Monitor strategic reports across your organization.{' '}
                            <br />
                            Total{' '}
                            <span className="font-medium text-foreground">
                                {totalReports}
                            </span>{' '}
                            reports.
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            All Strategic Reports
                        </CardTitle>
                        <CardDescription>
                            Search, filter, and monitor strategic reports.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <StrategicReportsFilters
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
                            cycleOptions={cycleOptions}
                            teamOptions={teamOptions}
                            onReset={handleReset}
                        />

                        {/* Loading State */}
                        {(isLoading ||
                            isRateesLoading ||
                            isTeamTitlesLoading) && (
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
                        {!isLoading &&
                            !isError &&
                            !isRateesLoading &&
                            !isTeamTitlesLoading && (
                                <>
                                    <StrategicReportsTable
                                        strategicReports={paginatedReports}
                                        ratees={rateeData}
                                        teams={teamTitles}
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
