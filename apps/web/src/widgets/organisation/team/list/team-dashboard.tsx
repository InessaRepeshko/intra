'use client';

import { Award, Mail, Pencil, UserRound, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';

import { useUsersByTeamIdsQuery } from '@entities/identity/user/api/user.queries';
import { type AuthContextType } from '@entities/identity/user/model/types';
import { useTeamsQuery } from '@entities/organisation/team/api/team.queries';
import { Button } from '@shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@shared/components/ui/card';
import { formatNumber } from '@shared/lib/utils/format-number';
import { getUserInitialsFromFullName } from '@shared/lib/utils/get-user-initials-from-full-name';
import { StatisticsCard } from '@shared/ui/statistics-card';

export function TeamDashboard({
    currentUser: _currentUser,
}: {
    currentUser: AuthContextType;
}) {
    const { data: allTeamsData = [] } = useTeamsQuery();

    const allTeamIds = useMemo(
        () => allTeamsData.map((t) => t.id),
        [allTeamsData],
    );

    const { usersByTeam: allTeamUsers } = useUsersByTeamIdsQuery(allTeamIds);

    const totalTeams = allTeamsData.length;
    const totalMembers = useMemo(
        () => allTeamUsers.reduce((sum, t) => sum + (t.users?.length ?? 0), 0),
        [allTeamUsers],
    );
    const totalPositions = useMemo(() => {
        const unique = new Set<string>();
        Object.values(allTeamUsers).forEach((team) => {
            team.users.forEach((user) => {
                if (user.positionTitle?.trim()) unique.add(user.positionTitle);
            });
        });
        return unique.size;
    }, [allTeamUsers]);

    const sortedTeams = useMemo(
        () =>
            [...allTeamsData].sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
            ),
        [allTeamsData],
    );

    return (
        <Card className="mx-auto gap-6 sm:gap-8 flex flex-col w-full h-full border-border p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Teams Dashboard Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-balance text-foreground break-words">
                        Organisational Teams Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Overview of all teams across your organization. Total{' '}
                        <span className="font-medium text-foreground">
                            {totalTeams}
                        </span>{' '}
                        team{totalTeams === 1 ? '' : 's'} with{' '}
                        <span className="font-medium text-foreground">
                            {totalMembers}
                        </span>{' '}
                        member{totalMembers === 1 ? '' : 's'}.
                    </p>
                </div>
            </div>

            {/* Team stats */}
            <div className="flex flex-row flex-wrap w-full gap-3 sm:gap-4 md:gap-6 justify-around">
                <StatisticsCard
                    title={`Teams`}
                    value={formatNumber(totalTeams) ?? '-'}
                    icon={UsersRound}
                    color="text-blue-300"
                    width={250}
                />
                <StatisticsCard
                    title={`Members`}
                    value={formatNumber(totalMembers) ?? '-'}
                    icon={UserRound}
                    color="text-amber-300"
                    width={250}
                />
                <StatisticsCard
                    title={`Positions`}
                    value={formatNumber(totalPositions) ?? '-'}
                    icon={Award}
                    color="text-green-300"
                    width={250}
                />
            </div>

            {/* Teams list */}
            <Card className="border-[0px] shadow-none">
                <CardHeader className="px-2">
                    <CardTitle className="text-foreground text-lg break-words">
                        All Teams
                    </CardTitle>
                    <CardDescription className="text-base">
                        A total of{' '}
                        <span className="font-semibold text-foreground">
                            {totalTeams}
                        </span>{' '}
                        {totalTeams === 1 ? 'team is' : 'teams are'} registered
                        in the organization.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="space-y-6">
                        {sortedTeams.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                No teams in the organization
                            </div>
                        ) : (
                            sortedTeams.map((team) => {
                                return (
                                    <div
                                        key={team.id}
                                        className="flex flex-col lg:flex-row !flex-wrap items-stretch lg:items-center justify-between gap-6 p-4 rounded-2xl border border-border shadow-sm w-full overflow-hidden"
                                    >
                                        <div className="flex flex-col items-start gap-2 text-left flex-1 min-w-[100px] w-full">
                                            <div className="flex flex-row justify-between w-full">
                                                <div className="flex flex-col items-start text-base text-muted-foreground">
                                                    <div className="flex flex-row flex-wrap items-center gap-1">
                                                        <UsersRound className="h-4 w-4" />
                                                        <p className="font-medium text-lg text-foreground break-words">
                                                            {team.title}
                                                        </p>
                                                    </div>
                                                    <div className="mb-4">
                                                        {team.description && (
                                                            <p className="text-muted-foreground text-base break-words">
                                                                {
                                                                    team.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {(_currentUser.isAdmin ||
                                                    _currentUser.isManager) && (
                                                    <div className="flex flex-row items-start gap-y-2 gap-x-8 w-full sm:w-auto flex-wrap justify-center lg:justify-end">
                                                        <Button
                                                            asChild
                                                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl w-full md:w-auto min-w-[120px]"
                                                        >
                                                            <Link
                                                                href={`/organisation/teams/${team.id}`}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="w-full flex flex-col flex-wrap items-start gap-5">
                                                {allTeamUsers
                                                    .filter(
                                                        (t) =>
                                                            t.teamId ===
                                                            team.id,
                                                    )
                                                    .map((team) => {
                                                        return team.users.map(
                                                            (user) => {
                                                                return (
                                                                    <div className="flex flex-col sm:flex-row items-center gap-2 text-center min-w-[100px] w-full">
                                                                        <Avatar className="h-20 w-20 border bg-muted shrink-0">
                                                                            <AvatarImage
                                                                                className="object-cover"
                                                                                src={
                                                                                    user.avatarUrl ||
                                                                                    ''
                                                                                }
                                                                                alt={
                                                                                    user.fullName
                                                                                }
                                                                            />
                                                                            <AvatarFallback className="text-4xl font-medium text-muted-foreground bg-neutral-100">
                                                                                {getUserInitialsFromFullName(
                                                                                    user.fullName,
                                                                                )}
                                                                            </AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="space-y-1 flex-1 min-w-0 w-full">
                                                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                                                                <p className="font-medium text-lg text-foreground break-words">
                                                                                    {
                                                                                        user.fullName
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-muted-foreground text-base">
                                                                                <Award className="h-4 w-4" />
                                                                                <span className="break-words">
                                                                                    {
                                                                                        user.positionTitle
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2 text-muted-foreground text-base">
                                                                                <Mail className="h-4 w-4" />
                                                                                <span className="break-words">
                                                                                    {
                                                                                        user.email
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            },
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </Card>
    );
}
