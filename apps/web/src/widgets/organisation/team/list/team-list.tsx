'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import { User } from '@entities/identity/user/model/mappers';
import { SortDirection } from '@entities/library/competence/model/types';
import {
    useTeamAllPositionTitlesQuery,
    useTeamAllUsersQuery,
    useTeamsQuery,
} from '@entities/organisation/team/api/team.queries';
import { Team } from '@entities/organisation/team/model/mappers';
import { TeamFilters } from '@entities/organisation/team/ui/team-filters';
import { TeamTable } from '@entities/organisation/team/ui/team-table';
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

export function TeamList() {
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );
    const [positions, setPositions] = useState<string[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Feature dialogs state
    const [deleteTeam, setDeleteTeam] = useState<Team | null>(null);

    // Build query params (client-side only)
    const queryParams = useMemo(() => {
        const params: Record<string, unknown> = {};

        if (search.trim()) params.search = search.trim();
        if (positions.length === 1) params.positionId = positions[0];

        return params;
    }, [search, positions]);

    const { data: allTeamsData = [], isLoading, isError } = useTeamsQuery();
    const allTeamIds = allTeamsData.map((p) => p.id);

    // Fetch position titles and users for all positions
    const { users: allUsers, isLoading: isAllUsersLoading } =
        useTeamAllUsersQuery(allTeamIds);

    const allPositionIds = allUsers.map((members) => {
        return {
            teamId: members.teamId,
            positionIds: members.users?.map((u) => u.user?.positionId) || [],
        };
    });

    const {
        positionTitles: allPositionTitles,
        isLoading: isPositionTitlesLoading,
    } = useTeamAllPositionTitlesQuery(allPositionIds);

    // Filter unique positions
    const positionOptions = useMemo(() => {
        const uniquePositions = new Set<string>();

        allPositionIds.forEach((p) => {
            if (
                p.positionIds === null ||
                p.positionIds === undefined ||
                p.positionIds.length === 0
            ) {
                uniquePositions.add('None');
            }
            p.positionIds?.forEach((positionId) => {
                const positions = allPositionTitles[p.teamId] || [];
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

        if (positionOptions.some((c) => c.title === 'None')) {
            const noneOption = positionOptions.find((c) => c.title === 'None')!;
            const filteredPositionOptions = positionOptions.filter(
                (c) => c.title !== 'None',
            );
            positionOptions = noneOption
                ? [noneOption, ...filteredPositionOptions]
                : positionOptions;
        }
        return positionOptions;
    }, [allPositionIds, allPositionTitles, allUsers]);

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
        setUsers([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range, title, position titles
    const filteredTeams = useMemo(() => {
        let result = allTeamsData;

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

        if (positions.length > 0) {
            const hasNoneFilter = positions.includes('None');
            const regularPositions = positions.filter((p) => p !== 'None');

            result = result.filter((r) => {
                const teamPositions = allPositionTitles[r.id] || [];
                const hasNoPositions =
                    !teamPositions || teamPositions.length === 0;

                const matchesNone = hasNoneFilter && hasNoPositions;

                const matchesRegularPositions =
                    regularPositions.length > 0 &&
                    teamPositions.some((position) =>
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
        positions,
        search,
        dateRange,
        allPositionTitles,
        positions,
        allTeamsData,
    ]);

    // Client-side sorting for all fields
    const sortedTeams = useMemo(() => {
        return [...filteredTeams].sort((a, b) => {
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
                    const positionsA = allPositionTitles[a.id]
                        ?.map((position) => position.title)
                        .sort();
                    const positionsB = allPositionTitles[b.id]
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
                case 'users': {
                    const usersA =
                        allUsers
                            ?.find?.((u) => u.teamId === a.id)
                            ?.users?.map((u) => u.fullName) || [];
                    const usersB =
                        allUsers
                            ?.find?.((u) => u.teamId === b.id)
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
        filteredTeams,
        sortField,
        sortDirection,
        allPositionTitles,
        users,
        positions,
        allUsers,
    ]);

    const totalPages = Math.ceil(sortedTeams.length / ITEMS_PER_PAGE);
    const paginatedTeams = sortedTeams.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const totalTeams = allTeamsData.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            Organisational Teams
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage teams across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {totalTeams}
                            </span>{' '}
                            total teams.
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
                        <CardTitle className="text-lg">All Teams</CardTitle>
                        <CardDescription>
                            Search, filter, and manage teams.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <TeamFilters
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
                            isAllUsersLoading ||
                            isPositionTitlesLoading) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 h-8 w-8 text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load teams
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading &&
                            !isError &&
                            !isAllUsersLoading &&
                            !isPositionTitlesLoading && (
                                <>
                                    <TeamTable
                                        teams={paginatedTeams}
                                        positions={allPositionTitles}
                                        users={allUsers}
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                        resetTrigger={resetTrigger}
                                        // onDelete={setDeleteCompetence}
                                    />

                                    {/* Pagination */}
                                    <TablePagination
                                        entityName="teams"
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredTeams.length}
                                        limit={ITEMS_PER_PAGE}
                                        onPageChange={setCurrentPage}
                                    />
                                </>
                            )}
                    </CardContent>
                </Card>
            </div>

            {/* Feature Dialogs */}
            {/* <DeleteCycleDialog
                cycle={deleteCycle}
                onClose={() => setDeleteCycle(null)}
            /> */}
        </main>
    );
}
