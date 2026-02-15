import { Prisma } from '@intra/database';
import {
    SortDirection,
    TeamSearchQuery,
    TeamSortField,
    UpdateTeamPayload,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { TeamRepositoryPort } from '../../application/ports/team.repository.port';
import type { TeamMembershipDomain } from '../../domain/team-membership.domain';
import type { TeamDomain } from '../../domain/team.domain';
import { TeamMembershipMapper } from '../mappers/team-membership.mapper';
import { TeamMapper } from '../mappers/team.mapper';

@Injectable()
export class TeamRepository implements TeamRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async create(team: TeamDomain): Promise<TeamDomain> {
        const created = await this.prisma.team.create({
            data: TeamMapper.toPrisma(team),
        });
        return TeamMapper.toDomain(created);
    }

    async findById(id: number): Promise<TeamDomain | null> {
        const found = await this.prisma.team.findUnique({ where: { id } });
        return found ? TeamMapper.toDomain(found) : null;
    }

    async search(query: TeamSearchQuery): Promise<TeamDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);

        const items = await this.prisma.team.findMany({ where, orderBy });

        return items.map(TeamMapper.toDomain);
    }

    async updateById(
        id: number,
        patch: UpdateTeamPayload,
    ): Promise<TeamDomain> {
        const updated = await this.prisma.team.update({
            where: { id },
            data: patch,
        });
        return TeamMapper.toDomain(updated);
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.team.delete({ where: { id } });
    }

    async addMember(
        teamId: number,
        memberId: number,
        isPrimary?: boolean | null,
    ): Promise<TeamMembershipDomain> {
        try {
            const created = await this.prisma.teamMembership.create({
                data: {
                    teamId,
                    memberId: memberId,
                    isPrimary: isPrimary ?? false,
                },
            });
            return TeamMembershipMapper.toDomain(created);
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                const existing = await this.prisma.teamMembership.findUnique({
                    where: {
                        teamId_memberId_isPrimary: {
                            teamId,
                            memberId: memberId,
                            isPrimary: isPrimary ?? false,
                        },
                    },
                });
                if (existing) return TeamMembershipMapper.toDomain(existing);
            }
            throw error;
        }
    }

    async removeMember(teamId: number, memberId: number): Promise<void> {
        await this.prisma.teamMembership.deleteMany({
            where: { teamId, memberId: memberId },
        });
    }

    async listMembers(teamId: number): Promise<TeamMembershipDomain[]> {
        const memberships = await this.prisma.teamMembership.findMany({
            where: { teamId },
            orderBy: { createdAt: 'desc' },
        });
        return memberships.map(TeamMembershipMapper.toDomain);
    }

    private buildWhere(query: TeamSearchQuery): Prisma.TeamWhereInput {
        const { search, headId, title, description } = query;
        return {
            ...(title
                ? { title: { contains: title, mode: 'insensitive' } }
                : {}),
            ...(description
                ? {
                      description: {
                          contains: description,
                          mode: 'insensitive',
                      },
                  }
                : {}),
            ...(headId !== undefined ? { headId } : {}),
            ...(search
                ? {
                      OR: [
                          { title: { contains: search, mode: 'insensitive' } },
                          {
                              description: {
                                  contains: search,
                                  mode: 'insensitive',
                              },
                          },
                      ],
                  }
                : {}),
        };
    }

    private buildOrder(
        query: TeamSearchQuery,
    ): Prisma.TeamOrderByWithRelationInput[] {
        const field = query.sortBy ?? TeamSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
