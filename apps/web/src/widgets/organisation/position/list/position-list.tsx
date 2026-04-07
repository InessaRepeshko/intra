'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { User } from '@entities/identity/user/model/mappers';
import { SortDirection } from '@entities/library/competence/model/types';
import {
    usePositionAllCompetenceIdsQuery,
    usePositionAllCompetenceTitlesQuery,
    usePositionAllUsersQuery,
    usePositionsQuery,
} from '@entities/organisation/position/api/position.queries';
import type { Position } from '@entities/organisation/position/model/mappers';
import { PositionFilters } from '@entities/organisation/position/ui/position-filters';
import { PositionTable } from '@entities/organisation/position/ui/position-table';
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

export function PositionList() {
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [competences, setCompetences] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Feature dialogs state
    const [deletePosition, setDeletePosition] = useState<Position | null>(null);

    // Build query params (client-side only)
    const queryParams = useMemo(() => {
        const params: Record<string, unknown> = {};

        if (search.trim()) params.search = search.trim();
        if (competences.length === 1) params.competenceId = competences[0];

        return params;
    }, [search, competences]);

    const {
        data: allPositionsData = [],
        isLoading,
        isError,
    } = usePositionsQuery({});
    const allPositionIds = allPositionsData.map((p) => p.id);

    const { competenceIds, isLoading: isAllCompetenceIdsLoading } =
        usePositionAllCompetenceIdsQuery(allPositionIds);
    const allCompetenceIds = allPositionIds.map((p) => {
        return {
            positionId: p,
            competenceIds: competenceIds[p] || [],
        };
    });

    // Fetch competence titles and users for all positions
    const {
        competenceTitles: competenceTitles,
        isLoading: isCompetenceTitlesLoading,
    } = usePositionAllCompetenceTitlesQuery(allCompetenceIds);

    const { users: allUsers, isLoading: isUsersLoading } =
        usePositionAllUsersQuery(allPositionIds);

    // Filter unique competences
    const competenceOptions = useMemo(() => {
        const uniqueCompetences = new Set<string>();

        allCompetenceIds.forEach((p) => {
            if (
                p.competenceIds === null ||
                p.competenceIds === undefined ||
                p.competenceIds.length === 0
            ) {
                uniqueCompetences.add('None');
            }
            p.competenceIds?.forEach((competenceId) => {
                const competences = competenceTitles[p.positionId] || [];
                const competence = competences.find(
                    (p) => p.id === competenceId,
                );
                const title = competence?.title;
                if (title === null || title === undefined) {
                    uniqueCompetences.add('None');
                }
                if (title && title.trim() !== '') {
                    uniqueCompetences.add(title);
                }
            });
        });

        let competenceOptions = Array.from(uniqueCompetences)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));

        if (competenceOptions.some((c) => c.title === 'None')) {
            const noneOption = competenceOptions.find(
                (c) => c.title === 'None',
            )!;
            const filteredCompetenceOptions = competenceOptions.filter(
                (c) => c.title !== 'None',
            );
            competenceOptions = noneOption
                ? [noneOption, ...filteredCompetenceOptions]
                : competenceOptions;
        }
        return competenceOptions;
    }, [allPositionIds, competenceTitles, allUsers]);

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
        setCompetences([]);
        setUsers([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range, title, competence titles
    const filteredPositions = useMemo(() => {
        let result = allPositionsData;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (r) =>
                    (r.title && r.title.toLowerCase().includes(lowerSearch)) ||
                    (r.description &&
                        r.description.toLowerCase().includes(lowerSearch)),
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

        if (competences.length > 0) {
            const hasNoneFilter = competences.includes('None');
            const regularCompetences = competences.filter((c) => c !== 'None');

            result = result.filter((r) => {
                const positionCompetences = competenceTitles[r.id] || [];
                const hasNoCompetences =
                    !positionCompetences || positionCompetences.length === 0;

                const matchesNone = hasNoneFilter && hasNoCompetences;

                const matchesRegularCompetences =
                    regularCompetences.length > 0 &&
                    positionCompetences.some((competence) =>
                        regularCompetences.includes(competence.title),
                    );

                if (hasNoneFilter && regularCompetences.length === 0) {
                    return matchesNone;
                } else if (!hasNoneFilter && regularCompetences.length > 0) {
                    return matchesRegularCompetences;
                } else {
                    return matchesNone || matchesRegularCompetences;
                }
            });
        }
        return result;
    }, [
        competences,
        search,
        dateRange,
        competenceTitles,
        competences,
        allPositionsData,
    ]);

    // Client-side sorting for all fields
    const sortedPositions = useMemo(() => {
        return [...filteredPositions].sort((a, b) => {
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
                case 'competenceTitles': {
                    const competencesA = competenceTitles[a.id]
                        ?.map((competence) => competence.title)
                        .sort();
                    const competencesB = competenceTitles[b.id]
                        ?.map((competence) => competence.title)
                        .sort();
                    const comparison = compareStringArrays(
                        competencesA,
                        competencesB,
                    );
                    return sortDirection === SortDirection.ASC
                        ? comparison
                        : -comparison;
                }
                case 'users': {
                    const usersA =
                        allUsers
                            ?.find?.((u) => u.positionId === a.id)
                            ?.users?.map((u) => u.fullName) || [];
                    const usersB =
                        allUsers
                            ?.find?.((u) => u.positionId === b.id)
                            ?.users?.map((u) => u.fullName) || [];
                    const comparison = compareStringArrays(usersA, usersB);
                    return sortDirection === SortDirection.ASC
                        ? comparison
                        : -comparison;
                }
                default:
                    return 0;
            }
        });
    }, [
        filteredPositions,
        sortField,
        sortDirection,
        competenceTitles,
        users,
        competences,
        allUsers,
    ]);

    const totalPages = Math.ceil(sortedPositions.length / ITEMS_PER_PAGE);
    const paginatedPositions = sortedPositions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const totalPositions = allPositionsData.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            Organisational Positions
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage positions across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {totalPositions}
                            </span>{' '}
                            total positions.
                        </p>
                    </div>
                    {/* <CreateCompetenceForm
                        trigger={
                            <Button size="lg" className="shrink-0">
                                <Plus className="mr-2 h-4 w-4" />
                                Create New Competence
                            </Button>
                        }
                    /> */}
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">All Positions</CardTitle>
                        <CardDescription>
                            Search, filter, and manage positions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <PositionFilters
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
                            competences={competences}
                            onCompetencesChange={(val) => {
                                setCompetences(val);
                                setCurrentPage(1);
                            }}
                            competenceOptions={competenceOptions}
                            onReset={handleReset}
                        />

                        {/* Loading State */}
                        {(isLoading ||
                            isAllCompetenceIdsLoading ||
                            isUsersLoading ||
                            isCompetenceTitlesLoading) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load positions
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading &&
                            !isError &&
                            !isAllCompetenceIdsLoading &&
                            !isUsersLoading &&
                            !isCompetenceTitlesLoading && (
                                <>
                                    <PositionTable
                                        positions={paginatedPositions}
                                        competenceTitles={competenceTitles}
                                        users={allUsers}
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                        resetTrigger={resetTrigger}
                                        // onDelete={setDeleteCompetence}
                                    />

                                    {/* Pagination */}
                                    <TablePagination
                                        entityName="positions"
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredPositions.length}
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
