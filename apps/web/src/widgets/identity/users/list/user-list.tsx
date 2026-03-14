'use client';

import { useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';

import {
    useUserManagerFullNamesQuery,
    useUserPositionTitlesQuery,
    useUsersQuery,
    useUserTeamTitlesQuery,
} from '@entities/identity/user/api/user.queries';
import type { User } from '@entities/identity/user/model/mappers';
import {
    IDENTITY_ROLES_ENUM_VALUES,
    IDENTITY_STATUSES_ENUM_VALUES,
    IdentityRole,
    IdentityStatus,
    SortDirection,
} from '@entities/identity/user/model/types';
import { UsersFilters } from '@entities/identity/user/ui/users-filters';
import { UsersTable } from '@entities/identity/user/ui/users-table';
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

export function UsersList() {
    const [search, setSearch] = useState('');
    const [roles, setRoles] = useState<string[]>([]);
    const [statuses, setStatuses] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        undefined,
    );

    const [teams, setTeams] = useState<string[]>([]);
    const [positions, setPositions] = useState<string[]>([]);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        SortDirection.DESC,
    );
    const [currentPage, setCurrentPage] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Feature dialogs state
    const [deactivateUser, setDeactivateUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);

    // Build query params (exclude all sort params - sorting is client-side only)
    const queryParams = useMemo(() => {
        const params: Record<string, unknown> = {};

        if (search.trim()) params.search = search.trim();
        if (roles.length === 1) params.role = roles[0];
        if (statuses.length === 1) params.status = statuses[0];
        if (positions.length === 1 && positions[0] !== 'None')
            params.positionTitle = positions[0];
        if (teams.length === 1 && teams[0] !== 'None')
            params.teamTitle = teams[0];

        return params;
    }, [search, roles, statuses, positions, teams]);

    const { data: users = [], isLoading, isError } = useUsersQuery(queryParams);

    const { data: allUsersData = [] } = useUsersQuery({});
    const positionIds = users
        .map((r) => r.positionId)
        .filter((id) => id !== null && id !== undefined);
    const teamIds = users
        .map((r) => r.teamId)
        .filter((id) => id !== null && id !== undefined);
    const managerIds = users
        .map((r) => r.managerId)
        .filter((id) => id !== null && id !== undefined);

    const { teamTitles, isLoading: isTeamTitlesLoading } =
        useUserTeamTitlesQuery(teamIds);

    const { positionTitles, isLoading: isPositionTitlesLoading } =
        useUserPositionTitlesQuery(positionIds);

    const { managerNames, isLoading: isManagerNamesLoading } =
        useUserManagerFullNamesQuery(managerIds);

    // Filter unique teams, positions, statuses and roles
    const positionOptions = useMemo(() => {
        const uniquePositions = new Set<string>();

        allUsersData.forEach((u) => {
            const title = u.positionId
                ? positionTitles[u.positionId]
                : undefined;
            if (title && title.trim() !== '') {
                uniquePositions.add(title);
            }
        });

        const sortedPositions = Array.from(uniquePositions)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));

        const hasNoPositions = allUsersData.some(
            (u) => u.positionId === null || u.positionId === undefined,
        );

        if (hasNoPositions) {
            sortedPositions.push({ id: 'None', title: 'None' });
        }

        return sortedPositions;
    }, [allUsersData, positionTitles]);

    const teamOptions = useMemo(() => {
        const uniqueTeams = new Set<string>();

        allUsersData.forEach((u) => {
            const title = u.teamId ? teamTitles[u.teamId] : undefined;
            if (title && title.trim() !== '') {
                uniqueTeams.add(title);
            }
        });

        const sortedTeams = Array.from(uniqueTeams)
            .sort((a, b) => a.localeCompare(b))
            .map((title) => ({ id: title, title }));

        const hasNoTeams = allUsersData.some(
            (u) => u.teamId === null || u.teamId === undefined,
        );

        if (hasNoTeams) {
            sortedTeams.push({ id: 'None', title: 'None' });
        }

        return sortedTeams;
    }, [allUsersData, teamTitles]);

    const statusOptions = useMemo(() => {
        const statuses = new Set(
            allUsersData.map((u) => u.status).filter(Boolean),
        );

        const sortedStatuses = Array.from(statuses).sort((a, b) => {
            return (
                IDENTITY_STATUSES_ENUM_VALUES.indexOf(a) -
                IDENTITY_STATUSES_ENUM_VALUES.indexOf(b)
            ); // ascending order
        });

        return sortedStatuses;
    }, [allUsersData]);

    const roleOptions = useMemo(() => {
        const roles = new Set(
            allUsersData.flatMap((u) => u.roles.filter(Boolean)),
        );

        const sortedRoles = Array.from(roles).sort((a, b) => {
            return (
                IDENTITY_ROLES_ENUM_VALUES.indexOf(a as IdentityRole) -
                IDENTITY_ROLES_ENUM_VALUES.indexOf(b as IdentityRole)
            ); // ascending order
        });

        return sortedRoles;
    }, [allUsersData]);

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
        setRoles([]);
        setStatuses([]);
        setTeams([]);
        setPositions([]);
        setSortField('createdAt');
        setSortDirection(SortDirection.DESC);
        setCurrentPage(1);
        setResetTrigger((prev) => prev + 1);
    };

    // Client-side filtering for date range, team title, position title
    const filteredUsers = useMemo(() => {
        let result = users;

        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(
                (u) =>
                    (u.fullName &&
                        u.fullName.toLowerCase().includes(lowerSearch)) ||
                    (u.email && u.email.toLowerCase().includes(lowerSearch)),
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

        if (roles.length > 0) {
            result = result.filter((u) =>
                u.roles.some((r) => roles.includes(r)),
            );
        }

        if (statuses.length > 0) {
            result = result.filter((u) => statuses.includes(u.status));
        }

        if (teams.length > 0) {
            result = result.filter((u) => {
                const title =
                    u.teamId === null || u.teamId === undefined
                        ? 'None'
                        : (teamTitles[u.teamId] ?? '');
                return teams.includes(title);
            });
        }

        if (positions.length > 0) {
            result = result.filter((u) => {
                const title =
                    u.positionId === null || u.positionId === undefined
                        ? 'None'
                        : (positionTitles[u.positionId] ?? '');
                return positions.includes(title);
            });
        }

        return result;
    }, [users, search, dateRange, roles, statuses, teams, positions]);

    // Client-side sorting for all fields
    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            switch (sortField) {
                case 'fullname':
                    return sortDirection === SortDirection.ASC
                        ? (a.fullName ?? '').localeCompare(b.fullName ?? '')
                        : (b.fullName ?? '').localeCompare(a.fullName ?? '');
                case 'email': {
                    return sortDirection === SortDirection.ASC
                        ? (a.email ?? '').localeCompare(b.email ?? '')
                        : (b.email ?? '').localeCompare(a.email ?? '');
                }
                case 'createdAt':
                    return sortDirection === SortDirection.ASC
                        ? a.createdAt?.getTime() - b.createdAt?.getTime()
                        : b.createdAt?.getTime() - a.createdAt?.getTime();
                case 'status': {
                    const indexA = IDENTITY_STATUSES_ENUM_VALUES.indexOf(
                        a.status,
                    );
                    const indexB = IDENTITY_STATUSES_ENUM_VALUES.indexOf(
                        b.status,
                    );
                    return sortDirection === SortDirection.ASC
                        ? indexA - indexB
                        : indexB - indexA;
                }
                case 'role': {
                    const indicesA = a.roles?.map((role) =>
                        IDENTITY_ROLES_ENUM_VALUES.indexOf(role),
                    );
                    const indicesB = b.roles?.map((role) =>
                        IDENTITY_ROLES_ENUM_VALUES.indexOf(role),
                    );
                    const comparison = compareNumberArrays(indicesA, indicesB);
                    return sortDirection === SortDirection.ASC
                        ? comparison
                        : -comparison;
                }
                case 'position': {
                    const titleA = a.positionId
                        ? (positionTitles[a.positionId] ?? '')
                        : '';
                    const titleB = b.positionId
                        ? (positionTitles[b.positionId] ?? '')
                        : '';
                    return sortDirection === SortDirection.ASC
                        ? titleA.localeCompare(titleB)
                        : titleB.localeCompare(titleA);
                }
                case 'team': {
                    const titleA = a.teamId ? (teamTitles[a.teamId] ?? '') : '';
                    const titleB = b.teamId ? (teamTitles[b.teamId] ?? '') : '';
                    return sortDirection === SortDirection.ASC
                        ? titleA.localeCompare(titleB)
                        : titleB.localeCompare(titleA);
                }
                case 'manager': {
                    const titleA = a.managerId
                        ? (managerNames[a.managerId] ?? '')
                        : '';
                    const titleB = b.managerId
                        ? (managerNames[b.managerId] ?? '')
                        : '';
                    return sortDirection === SortDirection.ASC
                        ? titleA.localeCompare(titleB)
                        : titleB.localeCompare(titleA);
                }
                default:
                    return 0;
            }
        });
    }, [
        filteredUsers,
        sortField,
        sortDirection,
        positionTitles,
        teamTitles,
        managerNames,
    ]);

    const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
    );

    // Summary stats
    const activeUsers = users.filter(
        (u) => u.status === IdentityStatus.ACTIVE,
    ).length;
    const totalUsers = users.length;

    return (
        <main className="min-h-screen">
            <div className="mx-auto max-w-8xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground sm:text-3xl">
                            Users
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage and monitor users across your organization.{' '}
                            <span className="font-medium text-foreground">
                                {activeUsers}
                            </span>{' '}
                            active of{' '}
                            <span className="font-medium text-foreground">
                                {totalUsers}
                            </span>{' '}
                            total users.
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
                        <CardTitle className="text-lg">All Users</CardTitle>
                        <CardDescription>
                            Search, filter, and manage users.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* Filters */}
                        <UsersFilters
                            search={search}
                            onSearchChange={(val) => {
                                setSearch(val);
                                setCurrentPage(1);
                            }}
                            statuses={statuses}
                            onStatusesChange={(val) => {
                                setStatuses(val);
                                setCurrentPage(1);
                            }}
                            roles={roles}
                            onRolesChange={(val) => {
                                setRoles(val);
                                setCurrentPage(1);
                            }}
                            dateRange={dateRange}
                            onDateRangeChange={(range) => {
                                setDateRange(range);
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
                            statusOptions={statusOptions}
                            roleOptions={roleOptions}
                            teamOptions={teamOptions}
                            positionOptions={positionOptions}
                            onReset={handleReset}
                        />

                        {/* Loading State */}
                        {(isLoading ||
                            isPositionTitlesLoading ||
                            isTeamTitlesLoading ||
                            isManagerNamesLoading) && (
                            <div className="flex flex-col text-center items-center justify-center py-16 h-8 w-8 animate-spin text-muted-foreground">
                                <Spinner />
                            </div>
                        )}

                        {/* Error State */}
                        {isError && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-lg font-semibold text-destructive">
                                    Failed to load users
                                </h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Please try refreshing the page.
                                </p>
                            </div>
                        )}

                        {/* Table */}
                        {!isLoading &&
                            !isError &&
                            !isPositionTitlesLoading &&
                            !isTeamTitlesLoading &&
                            !isManagerNamesLoading && (
                                <>
                                    <UsersTable
                                        users={paginatedUsers}
                                        positionTitles={positionTitles}
                                        teamTitles={teamTitles}
                                        managerNames={managerNames}
                                        sortField={sortField}
                                        sortDirection={sortDirection}
                                        onSort={handleSort}
                                        onDeactivate={setDeactivateUser}
                                        onDelete={setDeleteUser}
                                        resetTrigger={resetTrigger}
                                    />

                                    {/* Pagination */}
                                    <TablePagination
                                        entityName="users"
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        totalItems={filteredUsers.length}
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
