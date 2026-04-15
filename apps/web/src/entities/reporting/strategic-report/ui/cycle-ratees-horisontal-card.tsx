import { User } from '@entities/identity/user/model/mappers';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@shared/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/ui/card';
import { MailIcon } from 'lucide-react';
import { Team } from '@entities/organisation/team/model/mappers';

export function CycleRateesHorisontalCard({ allTeams, ratees }: { allTeams: {id: number, title: string}[]; ratees: User[] }) {
    if (!ratees || ratees.length === 0) {
        return <span className="text-muted-foreground">None</span>;
    }

    const teams = ratees.reduce((acc, ratee) => {
        const team = Object.values(allTeams).find((t) => t.id === ratee.teamId);
        if (team) {
            if (!acc[team.id]) {
                acc[team.id] = {
                    team: team,
                    ratees: [],
                };
            }
            acc[team.id].ratees.push(ratee);
        }
        return acc;
    }, {} as Record<number, { team: {id: number, title: string}; ratees: User[] }>);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className='items-center pb-0'>
                <CardTitle className="text-lg">
                    Ratees
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row flex-wrap gap-6 p-0 items-start justify-center">
                {Object.values(teams)
                    .sort((a, b) => {
                        if (a.ratees.length === b.ratees.length) {
                            return a.team.title.localeCompare(b.team.title);
                        }
                        return a.ratees.length - b.ratees.length;
                    })
                    .map((teamGroup) => {
                    return (
                        <Card key={teamGroup.team.id}>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-center border-b pb-2">{teamGroup.team.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-5 min-w-[300px]">
                            <div className="flex flex-col gap-6">
                                {teamGroup.ratees.map((ratee) => {
                                    const initials =
                                        ratee.firstName && ratee.lastName
                                            ? ratee.firstName.charAt(0) + ratee.lastName.charAt(0)
                                            : ratee.fullName
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                                .toUpperCase();
                                    return (
                                        <div className="flex flex-row items-center gap-4" key={ratee.id}>
                                            <Avatar className="h-16 w-16 border bg-muted">
                                                <AvatarImage
                                                    className="object-cover"
                                                    src={ratee.avatarUrl?.toString()}
                                                    alt={ratee.fullName}
                                                />
                                                <AvatarFallback className="text-xl font-medium text-muted-foreground bg-neutral-100">
                                                    {initials.substring(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex flex-col gap-0.5 justify-center">
                                                <h4 className="text-md font-semibold text-foreground truncate">
                                                    {ratee.fullName}
                                                </h4>

                                                {ratee.positionId && (
                                                    <span className="text-sm font-medium text-muted-foreground truncate">
                                                        {ratee.positionTitle}
                                                    </span>
                                                )}

                                                {ratee.email && (
                                                    <div className="flex items-center gap-1.5 text-muted-foreground mt-0.5">
                                                        <MailIcon className="w-4 h-4 shrink-0" />
                                                        <span className="text-sm truncate">
                                                            {ratee.email}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            </CardContent>
                        </Card>
                    )
                })}

            </CardContent>
        </Card>
    );
}
