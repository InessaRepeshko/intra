'use client';

import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { useCycleTitlesQuery } from '@entities/feedback360/cycle/api/cycle.queries';
import {
    useReviewAnswersCountsQuery,
    useReviewQuestionCountsQuery,
    useReviewRespondentCountsQuery,
    useReviewReviewerCountsQuery,
    useReviewsQuery,
} from '@entities/feedback360/review/api/review.queries';
import type { Review } from '@entities/feedback360/review/model/mappers';
import {
    ReviewStage,
    SortDirection,
} from '@entities/feedback360/review/model/types';
import { ReviewsFilters } from '@entities/feedback360/review/ui/reviews-filters';
import { ReviewsTable } from '@entities/feedback360/review/ui/reviews-table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { TablePagination } from '@shared/ui/table-pagination';

const ITEMS_PER_PAGE = 6;

export function ReviewsList() {
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

    // Feature dialogs state
    const [forceFinishReview, setForceFinishReview] = useState<Review | null>(
        null,
    );
    const [deleteReview, setDeleteReview] = useState<Review | null>(null);

    // Build query params (exclude client-side only fields like reviewCount)
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
        data: reviews = [],
        isLoading,
        isError,
    } = useReviewsQuery(queryParams);

    const { data: allReviewsData = [] } = useReviewsQuery({});

    // Filter unique teams and positions
    const teamOptions = useMemo(() => {
        const uniqueTeams = new Map<number, { id: number; title: string }>();

        allReviewsData.forEach((r) => {
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

        allReviewsData.forEach((r) => {
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

    // Fetch question, answer, respondent and reviewer counts for all reviews
    const reviewIds = reviews.map((r) => r.id);
    const cycleIds = reviews
        .map((r) => r.cycleId)
        .filter((id) => id !== null && id !== undefined);
    const { questionCounts } = useReviewQuestionCountsQuery(reviewIds);
    const { answerCounts } = useReviewAnswersCountsQuery(reviewIds);
    const { respondentCounts } = useReviewRespondentCountsQuery(reviewIds);
    const { reviewerCounts } = useReviewReviewerCountsQuery(reviewIds);
    const { cycleTitles } = useCycleTitlesQuery(cycleIds);

    const cycleOptions = useMemo(() => {
        const titles = new Set(
            Object.values(cycleTitles).filter(
                (title) => title && title.trim() !== '',
            ),
        );

        const hasNoCycleReviews = allReviewsData.some(
            (r) => r.cycleId === null || r.cycleId === undefined,
        );

        const sortedTitles = Array.from(titles).sort();
        if (hasNoCycleReviews) {
            sortedTitles.push('None');
        }

        return sortedTitles;
    }, [cycleTitles, allReviewsData]);

    const stageOptions = useMemo(() => {
        const stages = new Set(
            allReviewsData.map((r) => r.stage).filter(Boolean),
        );
        return Array.from(stages);
    }, [allReviewsData]);

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
    };

    // Client-side filtering for date range and cycle title
    const filteredReviews = useMemo(() => {
        let result = reviews;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.rateeFullName &&
                    c.rateeFullName.toLowerCase().includes(lowerSearch),
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

        if (stages.length > 0) {
            result = result.filter((c) => c.stage && stages.includes(c.stage));
        }

        if (cycles.length > 0) {
            result = result.filter((c) => {
                const title =
                    c.cycleId === null || c.cycleId === undefined
                        ? 'None'
                        : (cycleTitles[c.cycleId!] ?? '');
                return cycles.includes(title);
            });
        }

        if (teams.length > 0) {
            result = result.filter(
                (c) => c.teamId !== null && teams.includes(String(c.teamId)),
            );
        }

        if (positions.length > 0) {
            result = result.filter(
                (c) =>
                    c.rateePositionId !== null &&
                    positions.includes(String(c.rateePositionId)),
            );
        }

        return result;
    }, [
        reviews,
        search,
        dateRange,
        stages,
        cycles,
        cycleTitles,
        teams,
        positions,
    ]);

    // Client-side sorting for question count, answer count, respondent count, reviewer count
    const sortedReviews = useMemo(() => {
        if (
            sortField !== 'questionCount' &&
            sortField !== 'answerCount' &&
            sortField !== 'respondentCount' &&
            sortField !== 'reviewerCount'
        ) {
            return filteredReviews;
        }

        return [...filteredReviews].sort((a, b) => {
            if (sortField === 'questionCount') {
                const countA = questionCounts[a.id] ?? 0;
                const countB = questionCounts[b.id] ?? 0;
                return sortDirection === SortDirection.ASC
                    ? countA - countB
                    : countB - countA;
            }
            if (sortField === 'answerCount') {
                const countA = answerCounts[a.id] ?? 0;
                const countB = answerCounts[b.id] ?? 0;
                return sortDirection === SortDirection.ASC
                    ? countA - countB
                    : countB - countA;
            }
            if (sortField === 'respondentCount') {
                const countA = respondentCounts[a.id] ?? 0;
                const countB = respondentCounts[b.id] ?? 0;
                return sortDirection === SortDirection.ASC
                    ? countA - countB
                    : countB - countA;
            }
            if (sortField === 'reviewerCount') {
                const countA = reviewerCounts[a.id] ?? 0;
                const countB = reviewerCounts[b.id] ?? 0;
                return sortDirection === SortDirection.ASC
                    ? countA - countB
                    : countB - countA;
            }
            return 0;
        });
    }, [
        filteredReviews,
        sortField,
        sortDirection,
        questionCounts,
        answerCounts,
        respondentCounts,
        reviewerCounts,
    ]);

    const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);
    const paginatedReviews = sortedReviews.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const activeReviews = reviews.filter(
        (c) =>
            c.stage === ReviewStage.SELF_ASSESSMENT ||
            c.stage === ReviewStage.WAITING_TO_START ||
            c.stage === ReviewStage.IN_PROGRESS ||
            c.stage === ReviewStage.PREPARING_REPORT ||
            c.stage === ReviewStage.PROCESSING_BY_HR,
    ).length;
    const totalReviews = reviews.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            360° Feedback Reviews
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage and monitor reviews across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {activeReviews}
                            </span>{' '}
                            active of{' '}
                            <span className="font-medium text-foreground">
                                {totalReviews}
                            </span>{' '}
                            total reviews.
                        </p>
                    </div>
                    {/* <CreateReviewForm
                        trigger={
                            <Button size="lg" className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Review
                            </Button>
                        }
                    /> */}
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Reviews</CardTitle>
                        <CardDescription>
                            Search, filter, and manage reviews.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <ReviewsFilters
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
                        {isLoading && (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load reviews
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading && !isError && (
                            <>
                                <ReviewsTable
                                    reviews={paginatedReviews}
                                    cycleTitles={cycleTitles}
                                    questionCounts={questionCounts}
                                    answerCounts={answerCounts}
                                    respondentCounts={respondentCounts}
                                    reviewerCounts={reviewerCounts}
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                    onSort={handleSort}
                                    onForceFinish={setForceFinishReview}
                                    onDelete={setDeleteReview}
                                />

                                {/* Pagination */}
                                <TablePagination
                                    entityName="reviews"
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={filteredReviews.length}
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
