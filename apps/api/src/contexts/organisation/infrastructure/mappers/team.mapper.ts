import { Prisma, Team } from '@intra/database';
import { TeamDomain } from '../../domain/team.domain';

export class TeamMapper {
    static toDomain(team: Team): TeamDomain {
        return TeamDomain.create({
            id: team.id,
            title: team.title,
            description: team.description,
            headId: team.headId,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
        });
    }

    static toPrisma(team: TeamDomain): Prisma.TeamUncheckedCreateInput {
        return {
            title: team.title,
            description: team.description,
            headId: team.headId,
        };
    }
}
