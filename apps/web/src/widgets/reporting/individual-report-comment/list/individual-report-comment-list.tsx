'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    useAllCommentCycleTitlesQuery,
    useAllCommentReviewsQuery,
    useAllReportAnswersQuery,
    useAllReportCommentsQuery,
} from '@entities/reporting/individual-report-comment/api/individual-report-comment.queries';
import {
    AnswerType,
    RESPONDENT_CATEGORIES_ENUM_VALUES,
} from '@entities/reporting/individual-report-comment/model/types';
import { useReportsQuery } from '@entities/reporting/individual-report/api/individual-report.queries';

import type {
    Answer,
    Report,
} from '@entities/reporting/individual-report-comment/model/mappers';
import {
    REVIEW_STAGE_ENUM_VALUES,
    ReviewStage,
    SortDirection,
} from '@entities/reporting/individual-report-comment/model/types';
import { IndividualReportCommentsFilters } from '@entities/reporting/individual-report-comment/ui/individual-report-comments-filters';
import { IndividualReportCommentsTable } from '@entities/reporting/individual-report-comment/ui/individual-report-comments-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { Spinner } from '@shared/components/ui/spinner';
import { compareNumberArrays } from '@shared/lib/utils/compare-arrays';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function IndividualReportCommentList() {
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

    const {
        data: allReportsData = [],
        isLoading: areReportsLoading,
        isError: areReportsError,
    } = useReportsQuery();
    const allReportIds = allReportsData.map((r) => r.id);
    const allReviewIds = allReportsData.map((r) => r.reviewId);

    const {
        reviews: allReviewsData = {},
        isLoading: areReviewsLoading,
        isError: areReviewsError,
    } = useAllCommentReviewsQuery(allReportIds);

    const {
        reportComments: allCommentsData = {},
        isLoading: areCommentsLoading,
    } = useAllReportCommentsQuery(allReportIds);

    const { answers: allAnswersByReviewId = {}, isLoading: areAnswersLoading } =
        useAllReportAnswersQuery(allReviewIds);

    // Map answers back to report IDs for the table
    const reportTextAnswers = useMemo(() => {
        const map: Record<number, Answer[]> = {};
        allReportsData.forEach((r) => {
            if (allAnswersByReviewId[r.reviewId]) {
                map[r.id] = allAnswersByReviewId[r.reviewId].filter(
                    (a) => a.answerType === AnswerType.TEXT_FIELD,
                );
            }
        });
        return map;
    }, [allReportsData, allAnswersByReviewId]);

    // Derived values for filters and display
    const rateeFullNames = useMemo(() => {
        const map: Record<number, string> = {};
        allReportsData.forEach((r) => {
            if (allReviewsData[r.id]) {
                map[r.id] = allReviewsData[r.id].rateeFullName;
            }
        });
        return map;
    }, [allReportsData, allReviewsData]);

    const rateeTeamTitles = useMemo(() => {
        const map: Record<number, string | null> = {};
        allReportsData.forEach((r) => {
            if (allReviewsData[r.id]) {
                map[r.id] = allReviewsData[r.id].teamTitle ?? null;
            }
        });
        return map;
    }, [allReportsData, allReviewsData]);

    const rateePositionTitles = useMemo(() => {
        const map: Record<number, string | null> = {};
        allReportsData.forEach((r) => {
            if (allReviewsData[r.id]) {
                map[r.id] = allReviewsData[r.id].rateePositionTitle ?? null;
            }
        });
        return map;
    }, [allReportsData, allReviewsData]);

    // Filter unique teams and positions
    const teamOptions = useMemo(() => {
        const uniqueTeams = new Map<number, { id: number; title: string }>();

        Object.values(allReviewsData).forEach((r) => {
            if (r.teamId && r.teamTitle && r.teamTitle.trim() !== '') {
                uniqueTeams.set(r.teamId, {
                    id: r.teamId,
                    title: r.teamTitle,
                });
            }
        });

        return Array.from(uniqueTeams.values()).sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }, [allReviewsData]);

    const positionOptions = useMemo(() => {
        const uniquePositions = new Map<
            number,
            { id: number; title: string }
        >();

        Object.values(allReviewsData).forEach((r) => {
            if (
                r.rateePositionId &&
                r.rateePositionTitle &&
                r.rateePositionTitle.trim() !== ''
            ) {
                uniquePositions.set(r.rateePositionId, {
                    id: r.rateePositionId,
                    title: r.rateePositionTitle,
                });
            }
        });

        return Array.from(uniquePositions.values()).sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }, [allReviewsData]);

    // Fetch cycle titles for all reports
    const allCycleIds = useMemo(
        () =>
            Array.from(
                new Set(
                    allReportsData
                        .map((r) => r.cycleId)
                        .filter(
                            (id): id is number =>
                                id !== null && id !== undefined,
                        ),
                ),
            ),
        [allReportsData],
    );
    const { cycleTitles, isLoading: areCycleTitlesLoading } =
        useAllCommentCycleTitlesQuery(allCycleIds);

    const cycleOptions = useMemo(() => {
        const uniqueCycles = new Map<number, { id: number; title: string }>();

        Object.values(allReviewsData).forEach((r) => {
            const title = cycleTitles[r.cycleId ?? -1];
            if (r.cycleId && title && title.trim() !== '') {
                uniqueCycles.set(r.cycleId, {
                    id: r.cycleId,
                    title: title,
                });
            }
        });

        return Array.from(uniqueCycles.values()).sort((a, b) =>
            a.title.localeCompare(b.title),
        );
    }, [allReviewsData, cycleTitles]);

    // Fetch review stages for all reports
    const reviewStages = useMemo(() => {
        const map: Record<number, ReviewStage> = {};
        allReportsData.forEach((r) => {
            if (allReviewsData[r.id]) {
                map[r.id] = allReviewsData[r.id].stage;
            }
        });
        return map;
    }, [allReportsData, allReviewsData]);

    const stageOptions = useMemo(() => {
        const uniqueStages = new Set(
            allReportsData
                .map((r) => r.id && reviewStages[r.id])
                .filter((s) => s !== 0)
                .filter(Boolean),
        );

        const sortedStages = Array.from(uniqueStages)?.sort((a, b) => {
            return (
                REVIEW_STAGE_ENUM_VALUES.indexOf(a) -
                REVIEW_STAGE_ENUM_VALUES.indexOf(b)
            ); // ascending order
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
                    (rateeFullNames[r.id] &&
                        rateeFullNames[r.id]
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
                    reviewStages[r.id] && stages.includes(reviewStages[r.id]),
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
                    rateeTeamTitles[r.id] &&
                    rateeTeamTitles[r.id] !== null &&
                    teams.includes(rateeTeamTitles[r.id] ?? ''),
            );
        }

        if (positions.length > 0) {
            result = result.filter(
                (r) =>
                    rateePositionTitles[r.id] &&
                    rateePositionTitles[r.id] !== null &&
                    positions.includes(rateePositionTitles[r.id] ?? ''),
            );
        }

        return result;
    }, [
        allReportsData,
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
                case 'reportId': {
                    return sortDirection === SortDirection.ASC
                        ? a.id - b.id
                        : b.id - a.id;
                }
                case 'ratee': {
                    const nameA = rateeFullNames[a.id] ?? '';
                    const nameB = rateeFullNames[b.id] ?? '';
                    return sortDirection === SortDirection.ASC
                        ? nameA.localeCompare(nameB)
                        : nameB.localeCompare(nameA);
                }
                case 'reviewStage': {
                    const stageA = REVIEW_STAGE_ENUM_VALUES.indexOf(
                        reviewStages[a.id],
                    );
                    const stageB = REVIEW_STAGE_ENUM_VALUES.indexOf(
                        reviewStages[b.id],
                    );
                    return sortDirection === SortDirection.ASC
                        ? stageA - stageB
                        : stageB - stageA;
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
                    const dateA = allCommentsData[a.id]
                        ?.sort(
                            (a, b) =>
                                b.createdAt.getTime() - a.createdAt.getTime(),
                        )[0]
                        ?.createdAt.getTime();
                    const dateB = allCommentsData[b.id]
                        ?.sort(
                            (a, b) =>
                                b.createdAt.getTime() - a.createdAt.getTime(),
                        )[0]
                        ?.createdAt.getTime();
                    return sortDirection === SortDirection.ASC
                        ? dateA - dateB
                        : dateB - dateA;

                case 'textAnswerCount': {
                    const countA = reportTextAnswers[a.id]?.length ?? 0;
                    const countB = reportTextAnswers[b.id]?.length ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                case 'commentCount': {
                    const countA = allCommentsData[a.id]?.length ?? 0;
                    const countB = allCommentsData[b.id]?.length ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
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
                default:
                    return 0;
            }
        });
    }, [
        filteredReports,
        sortField,
        sortDirection,
        rateeFullNames,
        rateePositionTitles,
        rateeTeamTitles,
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
            reviewStages[r.id] === ReviewStage.PREPARING_REPORT ||
            reviewStages[r.id] === ReviewStage.PROCESSING_BY_HR ||
            reviewStages[r.id] === ReviewStage.PUBLISHED ||
            reviewStages[r.id] === ReviewStage.ANALYSIS,
    ).length;
    const totalReports = allReportsData.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            360° Feedback Individual Report Comments
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Monitor individual report comments across your
                            organization.{' '}
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

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            All Individual Report Comments
                        </CardTitle>
                        <CardDescription>
                            Search, filter, and monitor individual report
                            comments.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <IndividualReportCommentsFilters
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
                        {(areReportsLoading ||
                            areReviewsLoading ||
                            areCommentsLoading ||
                            areAnswersLoading ||
                            areCycleTitlesLoading) &&
                            !allReportsData && (
                                <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                    <Spinner />
                                </div>
                            )}

                        {/* Error State */}
                        {(areReportsError || areReviewsError) && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load report comments
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!areReportsLoading &&
                            !areReportsError &&
                            !areReviewsLoading && (
                                <>
                                    <IndividualReportCommentsTable
                                        reports={paginatedReports}
                                        reportTextAnswers={reportTextAnswers}
                                        reportComments={allCommentsData}
                                        reportReviews={allReviewsData}
                                        cycleTitles={cycleTitles}
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
