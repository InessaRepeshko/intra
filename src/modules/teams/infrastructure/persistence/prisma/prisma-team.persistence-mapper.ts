import { Team as PrismaTeam } from '@prisma/client';
import { CreateTeamData, Team, TeamProps, UpdateTeamData } from '../../../domain/model/team';

export class PrismaTeamPersistenceMapper {
  static toDomain(prisma: PrismaTeam): Team {
    const props: TeamProps = {
      id: prisma.id,
      title: prisma.title,
      description: prisma.description,
      headId: prisma.headId,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };
    return Team.fromPersistence(props);
  }

  static toPrismaCreate(data: CreateTeamData) {
    return {
      title: data.title,
      description: data.description,
      headId: data.headId,
    };
  }

  static toPrismaUpdate(data: UpdateTeamData) {
    return {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.headId !== undefined ? { headId: data.headId } : {}),
    };
  }
}


