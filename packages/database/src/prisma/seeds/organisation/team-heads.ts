import { PrismaClient } from '@intra/database';
import { UserMap } from '../identity/users';
import { TeamMap, TEAM_SEED_DATA } from './teams';

export type TeamHeadsMap = Map<string, { headId: number }>;

export default async function seedTeamHeads(
    prisma: PrismaClient,
    teamMap: TeamMap,
    userMap: UserMap,
) {
    const teams: TeamHeadsMap = new Map();

    for (const team of TEAM_SEED_DATA) {
        if (!team.headEmail) continue;

        const teamRecord = teamMap.get(team.title);
        const head = userMap.get(team.headEmail);

        if (!teamRecord || !head) {
            console.warn(`⚠️ Impossible to assign team head for ${team.title}`);
            continue;
        }

        await prisma.team.update({
            where: { id: teamRecord.id },
            data: { headId: head.id },
        });

        teams.set(team.title, { headId: head.id });
    }

    return teams;
}