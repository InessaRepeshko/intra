import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrgStructureMapper } from './org-structure.mapper';
import { TeamRepositoryPort, TeamSearchQuery, TeamSortField, TeamUpdatePayload } from '../../application/ports/team.repository.port';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import type { TeamDomain } from '../../domain/team.domain';
import type { TeamMembershipDomain } from '../../domain/team-membership.domain';

@Injectable()
export class TeamRepository implements TeamRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(team: TeamDomain): Promise<TeamDomain> {
    const created = await this.prisma.team.create({
      data: {
        title: team.title,
        description: team.description,
        headId: team.headId,
      },
    });
    return OrgStructureMapper.toTeamDomain(created);
  }

  async findById(id: number): Promise<TeamDomain | null> {
    const found = await this.prisma.team.findUnique({ where: { id } });
    return found ? OrgStructureMapper.toTeamDomain(found) : null;
  }

  async search(query: TeamSearchQuery): Promise<TeamDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);

    const items = await this.prisma.team.findMany({
      where,
      orderBy,
    });

    return items.map(OrgStructureMapper.toTeamDomain);
  }

  async updateById(id: number, patch: TeamUpdatePayload): Promise<TeamDomain> {
    const updated = await this.prisma.team.update({
      where: { id },
      data: patch,
    });
    return OrgStructureMapper.toTeamDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.team.delete({ where: { id } });
  }

  async addMember(teamId: number, userId: number, isPrimary?: boolean | null): Promise<TeamMembershipDomain> {
    try {
      const created = await this.prisma.teamMembership.create({
        data: {
          teamId,
          userId,
          isPrimary: isPrimary ?? false,
        },
      });
      return OrgStructureMapper.toTeamMembershipDomain(created);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await this.prisma.teamMembership.findUnique({
          where: {
            teamId_userId_isPrimary: {
              teamId,
              userId,
              isPrimary: isPrimary ?? false,
            },
          },
        });
        if (existing) return OrgStructureMapper.toTeamMembershipDomain(existing);
      }
      throw error;
    }
  }

  async removeMember(teamId: number, userId: number): Promise<void> {
    await this.prisma.teamMembership.deleteMany({ where: { teamId, userId } });
  }

  async listMembers(teamId: number): Promise<TeamMembershipDomain[]> {
    const memberships = await this.prisma.teamMembership.findMany({
      where: { teamId },
      orderBy: { createdAt: 'desc' },
    });
    return memberships.map(OrgStructureMapper.toTeamMembershipDomain);
  }

  private buildWhere(query: TeamSearchQuery): Prisma.TeamWhereInput {
    const { search, headId } = query;
    return {
      ...(headId !== undefined ? { headId } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    };
  }

  private buildOrder(query: TeamSearchQuery): Prisma.TeamOrderByWithRelationInput[] {
    const field = query.sortBy ?? TeamSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
