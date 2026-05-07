'use client';

import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    useCompetenceAllPositionIdsQuery,
    useCompetenceAllPositionTitlesQuery,
    useCompetenceAllQuestionTemplateCountsQuery,
    useCompetenceAllQuestionTemplateIdsQuery,
    useCompetencePositionCountsQuery,
    useCompetencesQuery,
} from '@entities/library/competence/api/competence.queries';
import type { Competence } from '@entities/library/competence/model/mappers';
import { SortDirection } from '@entities/library/competence/model/types';
import { CompetenceFilters } from '@entities/library/competence/ui/competence-filters';
import { CompetenceTable } from '@entities/library/competence/ui/competence-table';
import { DeleteCompetenceDialog } from '@features/library/competence/delete/ui/DeleteCompetenceDialog';
import { CompetenceFormDialog } from '@features/library/competence/form/ui/CompetenceFormDialog';
import { Button } from '@shared/components/ui/button';
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

export function CompetenceList() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [positions, setPositions] = useState<string[]>([]);
    const [questionTemplates, setQuestionTemplates] = useState<string[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Feature dialogs state
    const [viewingCompetence, setViewingCompetence] =
        useState<Competence | null>(null);
    const [editingCompetence, setEditingCompetence] =
        useState<Competence | null>(null);
    const [deletingCompetence, setDeletingCompetence] =
        useState<Competence | null>(null);

    // Build query params (client-side only)
    const queryParams = useMemo(() => {
        const params: Record<string, unknown> = {};

        if (search.trim()) params.search = search.trim();
        if (positions.length === 1) params.positionId = positions[0];

        return params;
    }, [search, positions]);

    const {
        data: competences = [],
        isLoading,
        isError,
    } = useCompetencesQuery(queryParams);

    const { data: allCompetencesData = [], isLoading: isCompetencesLoading } =
        useCompetencesQuery({});
    const allCompetenceIds = allCompetencesData.map((c) => c.id);

    const { positionIds, isLoading: isAllPositionIdsLoading } =
        useCompetenceAllPositionIdsQuery(allCompetenceIds);
    const allPositionIds = allCompetenceIds.map((c) => {
        return {
            competenceId: c,
            positionIds: positionIds[c] || [],
        };
    });

    const { questionTemplateIds, isLoading: isAllQuestionTemplateIdsLoading } =
        useCompetenceAllQuestionTemplateIdsQuery(allCompetenceIds);
    const allQuestionTemplateIds = allCompetenceIds.map((c) => {
        return {
            competenceId: c,
            questionTemplateIds: questionTemplateIds[c] || [],
        };
    });

    const {
        questionTemplateCounts,
        isLoading: isAllQuestionTemplateCountsLoading,
    } = useCompetenceAllQuestionTemplateCountsQuery(allCompetenceIds);

    // Fetch position and question template counts and titles for all positions
    const {
        positionTitles: positionTitles,
        isLoading: isPositionTitlesLoading,
    } = useCompetenceAllPositionTitlesQuery(allPositionIds);
    const { positionCounts, isLoading: isPositionCountsLoading } =
        useCompetencePositionCountsQuery(allCompetenceIds);

    // Filter unique positions
    const positionOptions = useMemo(() => {
        const uniquePositions = new Set<string>();

        allPositionIds.forEach((competence) => {
            if (
                competence.positionIds === null ||
                competence.positionIds === undefined ||
                competence.positionIds.length === 0
            ) {
                uniquePositions.add('None');
            }
            competence.positionIds?.forEach((positionId) => {
                const positions = positionTitles[competence.competenceId] || [];
                const position = positions.find((p) => p.id === positionId);
                const title = position?.title;
                if (title === null || title === undefined) {
                    uniquePositions.add('None');
                }
                if (title && title.trim() !== '') {
                    uniquePositions.add(title);
                }
            });
        });

        let positionOptions = Array.from(uniquePositions)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));

        if (positionOptions.some((p) => p.title === 'None')) {
            const noneOption = positionOptions.find((p) => p.title === 'None');
            const filteredPositionOptions = positionOptions.filter(
                (p) => p.title !== 'None',
            );
            positionOptions = noneOption
                ? [noneOption, ...filteredPositionOptions]
                : positionOptions;
        }
        return positionOptions;
    }, [allPositionIds, positionTitles]);

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
        setPositions([]);
        setQuestionTemplates([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range, title, competence and position titles
    const filteredCompetences = useMemo(() => {
        let result = competences;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (r) =>
                    (r.title && r.title.toLowerCase().includes(lowerSearch)) ||
                    (r.description &&
                        r.description.toLowerCase().includes(lowerSearch)) ||
                    (r.code && r.code.toLowerCase().includes(lowerSearch)),
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

        if (positions.length > 0) {
            const hasNoneFilter = positions.includes('None');
            const regularPositions = positions.filter((c) => c !== 'None');

            result = result.filter((r) => {
                const positionCompetences = positionTitles[r.id] || [];
                const hasNoCompetences =
                    !positionCompetences || positionCompetences.length === 0;

                const matchesNone = hasNoneFilter && hasNoCompetences;

                const matchesRegularPositions =
                    regularPositions.length > 0 &&
                    positionCompetences.some((position) =>
                        regularPositions.includes(position.title),
                    );

                if (hasNoneFilter && regularPositions.length === 0) {
                    return matchesNone;
                } else if (!hasNoneFilter && regularPositions.length > 0) {
                    return matchesRegularPositions;
                } else {
                    return matchesNone || matchesRegularPositions;
                }
            });
        }
        return result;
    }, [
        competences,
        search,
        dateRange,
        positionTitles,
        positions,
        allPositionIds,
        allQuestionTemplateIds,
        questionTemplateCounts,
    ]);

    // Client-side sorting for all fields
    const sortedCompetences = useMemo(() => {
        return [...filteredCompetences].sort((a, b) => {
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
                case 'positions': {
                    const positionsA = positionTitles[a.id]
                        ?.map((position) => position.title)
                        .sort();
                    const positionsB = positionTitles[b.id]
                        ?.map((position) => position.title)
                        .sort();
                    const comparison = compareStringArrays(
                        positionsA,
                        positionsB,
                    );
                    return sortDirection === SortDirection.ASC
                        ? comparison
                        : -comparison;
                }
                case 'questionTemplates': {
                    const countA = questionTemplateCounts[a.id] ?? 0;
                    const countB = questionTemplateCounts[b.id] ?? 0;
                    return sortDirection === SortDirection.ASC
                        ? countA - countB
                        : countB - countA;
                }
                default:
                    return 0;
            }
        });
    }, [
        filteredCompetences,
        sortField,
        sortDirection,
        positionTitles,
        positionCounts,
        questionTemplateCounts,
        positions,
    ]);

    const totalPages = Math.ceil(sortedCompetences.length / ITEMS_PER_PAGE);
    const paginatedCompetences = sortedCompetences.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const totalCompetences = competences.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            Library of Competences
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage competences across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {totalCompetences}
                            </span>{' '}
                            total competences.
                        </p>
                    </div>
                    <Button
                        size="lg"
                        className="shrink-0 rounded-xl"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Competence
                    </Button>
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            All Competences
                        </CardTitle>
                        <CardDescription>
                            Search, filter, and manage competences.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <CompetenceFilters
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
                            positions={positions}
                            onPositionsChange={(val) => {
                                setPositions(val);
                                setCurrentPage(1);
                            }}
                            positionOptions={positionOptions}
                            onReset={handleReset}
                        />

                        {/* Loading State */}
                        {(isLoading ||
                            isCompetencesLoading ||
                            isAllPositionIdsLoading ||
                            isAllQuestionTemplateCountsLoading ||
                            isAllQuestionTemplateIdsLoading) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load competences
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading &&
                            !isError &&
                            !isPositionCountsLoading &&
                            !isPositionTitlesLoading && (
                                <>
                                    <CompetenceTable
                                        competences={paginatedCompetences}
                                        positionCounts={positionCounts}
                                        questionTemplateCounts={
                                            questionTemplateCounts
                                        }
                                        positionTitles={positionTitles}
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                        onView={setViewingCompetence}
                                        onEdit={setEditingCompetence}
                                        onDelete={setDeletingCompetence}
                                        resetTrigger={resetTrigger}
                                    />

                                    {/* Pagination */}
                                    <TablePagination
                                        entityName="competences"
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredCompetences.length}
                                        limit={ITEMS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                    />
                                </>
                            )}
                    </CardContent>
                </Card>
            </div>

            {/* Feature Dialogs */}
            <CompetenceFormDialog
                mode="create"
                open={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
            />
            <CompetenceFormDialog
                mode="view"
                competence={viewingCompetence}
                onClose={() => setViewingCompetence(null)}
            />
            <CompetenceFormDialog
                mode="edit"
                competence={editingCompetence}
                onClose={() => setEditingCompetence(null)}
            />
            <DeleteCompetenceDialog
                competence={deletingCompetence}
                onClose={() => setDeletingCompetence(null)}
            />
        </main>
    );
}
