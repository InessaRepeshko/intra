import { Prisma } from '@prisma/client';
import { CreateTeamDto } from '../../presentation/http/dto/create-team.dto';
import { UpdateTeamDto } from '../../presentation/http/dto/update-team.dto';
import { TeamDomain } from './team.domain';

export class TeamMapper {
  static fromCreateDto(dto: CreateTeamDto): TeamDomain {
    return new TeamDomain(dto.title, dto.description ?? null, dto.headId ?? null);
  }

  static fromUpdateDto(dto: UpdateTeamDto): Partial<TeamDomain> {
    return {
      title: dto.title,
      description: dto.description,
      headId: dto.headId,
    };
  }

  static toPrismaCreate(domain: TeamDomain): Prisma.TeamUncheckedCreateInput {
    return {
      title: domain.title,
      description: domain.description,
      headId: domain.headId,
    };
  }

  static toPrismaUpdate(domain: Partial<TeamDomain>): Prisma.TeamUncheckedUpdateInput {
    return {
      ...(domain.title !== undefined ? { title: domain.title } : {}),
      ...(domain.description !== undefined ? { description: domain.description } : {}),
      ...(domain.headId !== undefined ? { headId: domain.headId } : {}),
    };
  }
}


