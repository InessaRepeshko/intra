'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { useCycleTitlesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import { RESPONDENT_CATEGORIES_ENUM_VALUES } from '@entities/feedback360/respondent/model/types';
import {
    useRateeFullNamesQuery,
    useRateePositionTitlesQuery,
    useRateeTeamTitlesQuery,
    useReportsQuery,
    useReviewStagesQuery,
} from '@entities/reporting/individual-report/api/individual-report.queries';
import {
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
    SortDirection,
} from '@entities/reporting/individual-report/model/types';
import { IndividualReportsFilters } from '@entities/reporting/individual-report/ui/individual-reports-filters';
import { IndividualReportsTable } from '@entities/reporting/individual-report/ui/individual-reports-table';
import { Card, CardContent } from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { compareNumberArrays } from '@shared/lib/utils/compare-arrays';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function IndividualReportList() {
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

    const {
        data: allReportsData = [],
        isLoading,
        isError,
    } = useReportsQuery({});
    const allReviewIds = useMemo(
        () => allReportsData.map((r) => r.reviewId),
        [allReportsData],
    );

    // Fetch ratee full names, team and position titles for all reports
    const { rateeFullNames } = useRateeFullNamesQuery(allReviewIds);
    const { rateeTeamTitles } = useRateeTeamTitlesQuery(allReviewIds);
    const { rateePositionTitles } = useRateePositionTitlesQuery(allReviewIds);

    // Filter unique teams and positions
    const teamOptions = useMemo(() => {
        const uniqueTeams = new Set<string>();

        allReportsData.forEach((r) => {
            const title = r.reviewId ? rateeTeamTitles[r.reviewId] : undefined;
            if (title && title.trim() !== '') {
                uniqueTeams.add(title);
            }
        });

        return Array.from(uniqueTeams)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));
    }, [allReportsData, rateeTeamTitles]);

    const positionOptions = useMemo(() => {
        const uniquePositions = new Set<string>();

        allReportsData.forEach((r) => {
            const title = r.reviewId
                ? rateePositionTitles[r.reviewId]
                : undefined;
            if (title && title.trim() !== '') {
                uniquePositions.add(title);
            }
        });

        return Array.from(uniquePositions)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));
    }, [allReportsData, rateePositionTitles]);

    // Fetch cycle titles for all reports
    const allCycleIds = useMemo(
        () =>
            allReportsData
                .map((r) => r.cycleId)
                .filter((id): id is number => id !== null && id !== undefined),
        [allReportsData],
    );
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
        const uniqueStages = new Set(
            allReportsData
                .map((r) => r.reviewId && reviewStages[r.reviewId])
                .filter((s) => s !== 0)
                .filter(Boolean),
        );

        const sortedStages = Array.from(uniqueStages)?.sort((a, b) => {
            return (
                REVIEW_STAGE_ENUM_VALUES.indexOf(a) -
                REVIEW_STAGE_ENUM_VALUES.indexOf(b)
            );
        });

        return sortedStages;
    }, [allReportsData, reviewStages]);

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
        let result = allReportsData;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (r) =>
                    r.id.toString().includes(lowerSearch) ||
                    (rateeFullNames[r.reviewId] &&
                        rateeFullNames[r.reviewId]
                            .toLowerCase()
                            .includes(lowerSearch)),
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
        allReportsData,
        rateeFullNames,
        rateeTeamTitles,
        rateePositionTitles,
        reviewStages,
        search,
        dateRange,
        stages,
        cycles,
        cycleTitles,
        teams,
        positions,
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
                case 'title': {
                    const nameA = rateeFullNames[a.reviewId] ?? '';
                    const nameB = rateeFullNames[b.reviewId] ?? '';
                    return sortDirection === SortDirection.ASC
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                }
                case 'cycleTitle': {
                    const titleA = a.cycleId
                        ? (cycleTitles[a.cycleId] ?? '')
                        : '';
                    const titleB = b.cycleId
                        ? (cycleTitles[b.cycleId] ?? '')
                        : '';
                    return sortDirection === SortDirection.ASC
                        ? titleA.localeCompare(titleB)
                        : titleB.localeCompare(titleA);
                }
                case 'createdAt':
                    return sortDirection === SortDirection.ASC
                        ? a.createdAt?.getTime() - b.createdAt?.getTime()
                        : b.createdAt?.getTime() - a.createdAt?.getTime();
                case 'reviewStage': {
                    const stageA = REVIEW_STAGE_ENUM_VALUES.indexOf(
                        reviewStages[a.reviewId],
                    );
                    const stageB = REVIEW_STAGE_ENUM_VALUES.indexOf(
                        reviewStages[b.reviewId],
                    );
                    return sortDirection === SortDirection.ASC
                        ? stageA - stageB
                        : stageB - stageA;
                }
                case 'respondentCount': {
                    const countA = a.respondentCount ?? 0;
                    const countB = b.respondentCount ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'respondentCategories': {
                    const indicesA = a.respondentCategories?.map((cat) =>
                        RESPONDENT_CATEGORIES_ENUM_VALUES.indexOf(cat),
                    );
                    const indicesB = b.respondentCategories?.map((cat) =>
                        RESPONDENT_CATEGORIES_ENUM_VALUES.indexOf(cat),
                    );
                    const comparison = compareNumberArrays(indicesA, indicesB);
                    return sortDirection === SortDirection.ASC
                        ? comparison
                        : -comparison;
                }
                case 'answerCount': {
                    const countA = a.answerCount ?? -1;
                    const countB = b.answerCount ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'turnoutPctOfTeam': {
                    const valA = a.turnoutPctOfTeam ?? -1;
                    const valB = b.turnoutPctOfTeam ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'turnoutPctOfOther': {
                    const valA = a.turnoutPctOfOther ?? -1;
                    const valB = b.turnoutPctOfOther ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'competenceTotPctBySelf': {
                    const valA =
                        a.competenceSummaryTotals?.percentageBySelfAssessment ??
                        -1;
                    const valB =
                        b.competenceSummaryTotals?.percentageBySelfAssessment ??
                        -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'competenceTotPctByTeam': {
                    const valA =
                        a.competenceSummaryTotals?.percentageByTeam ?? -1;
                    const valB =
                        b.competenceSummaryTotals?.percentageByTeam ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'competenceTotPctByOthers': {
                    const valA =
                        a.competenceSummaryTotals?.percentageByOther ?? -1;
                    const valB =
                        b.competenceSummaryTotals?.percentageByOther ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'deltaPercentageByTeam': {
                    const valA =
                        a.competenceSummaryTotals?.deltaPercentageByTeam ?? -1;
                    const valB =
                        b.competenceSummaryTotals?.deltaPercentageByTeam ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                case 'deltaPercentageByOther': {
                    const valA =
                        a.competenceSummaryTotals?.deltaPercentageByOther ?? -1;
                    const valB =
                        b.competenceSummaryTotals?.deltaPercentageByOther ?? -1;
                    return sortDirection === SortDirection.ASC
                        ? valA - valB
                        : valB - valA;
                }
                default:
                    return 0;
            }
        });
    }, [
        filteredReports,
        sortField,
        sortDirection,
        rateeFullNames,
        cycleTitles,
        reviewStages,
    ]);

    const totalPages = Math.ceil(sortedReports.length / ITEMS_PER_PAGE);
    const paginatedReports = sortedReports.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const activeReports = allReportsData.filter(
        (r) =>
            reviewStages[r.reviewId] === ReviewStage.PREPARING_REPORT ||
            reviewStages[r.reviewId] === ReviewStage.PROCESSING_BY_HR ||
            reviewStages[r.reviewId] === ReviewStage.PUBLISHED ||
            reviewStages[r.reviewId] === ReviewStage.ANALYSIS,
    ).length;
    const totalReports = allReportsData.length;

    return (
        <div className="mx-auto max-w-8xl gap-8 flex flex-col">
            <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    {/* Table Header */}
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                            360° Feedback Individual Reports Table
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Monitor individual reports across your organization.{' '}
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
                </div>

                {/* Table Content */}
                <CardContent className="flex flex-col gap-6 m-0 p-0">
                    {/* Filters */}
                    <IndividualReportsFilters
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
                            <IndividualReportsTable
                                reports={paginatedReports}
                                rateeFullNames={rateeFullNames}
                                rateePositionTitles={rateePositionTitles}
                                rateeTeamTitles={rateeTeamTitles}
                                cycleTitles={cycleTitles}
                                reviewStages={reviewStages}
                                sortField={sortField}
                                sortDirection={sortDirection}
                                onSort={handleSort}
                                resetTrigger={resetTrigger}
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
    );
}
