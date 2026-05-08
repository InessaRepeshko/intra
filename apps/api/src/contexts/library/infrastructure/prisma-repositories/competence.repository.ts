import { Prisma } from '@intra/database';
import {
    CompetenceSearchQuery,
    CompetenceSortField,
    SortDirection,
    UpdateCompetencePayload,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CompetenceRepositoryPort } from '../../application/ports/competence.repository.port';
import { CompetenceDomain } from '../../domain/competence.domain';
import { CompetenceMapper } from '../mappers/competence.mapper';

@Injectable()
export class CompetenceRepository implements CompetenceRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async create(competence: CompetenceDomain): Promise<CompetenceDomain> {
        const created = await this.prisma.competence.create({
            data: CompetenceMapper.toPrisma(competence),
        });

        return CompetenceMapper.toDomain(created);
    }

    async findById(id: number): Promise<CompetenceDomain | null> {
        const competence = await this.prisma.competence.findUnique({
            where: { id },
        });
        return competence ? CompetenceMapper.toDomain(competence) : null;
    }

    async search(query: CompetenceSearchQuery): Promise<CompetenceDomain[]> {
        const where = this.buildWhere(query);
        const orderBy = this.buildOrder(query);

        const items = await this.prisma.competence.findMany({ where, orderBy });
        return items.map(CompetenceMapper.toDomain);
    }

    async updateById(
        id: number,
        patch: UpdateCompetencePayload,
    ): Promise<CompetenceDomain> {
        const updated = await this.prisma.competence.update({
            where: { id },
            data: patch,
        });

        return CompetenceMapper.toDomain(updated);
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.competence.delete({ where: { id } });
    }

    private buildWhere(
        query: CompetenceSearchQuery,
    ): Prisma.CompetenceWhereInput {
        const { search, code, title, description } = query;
        return {
            ...(code ? { code: { contains: code, mode: 'insensitive' } } : {}),
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
            ...(search
                ? {
                      OR: [
                          { title: { contains: search, mode: 'insensitive' } },
                          { code: { contains: search, mode: 'insensitive' } },
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
        query: CompetenceSearchQuery,
    ): Prisma.CompetenceOrderByWithRelationInput[] {
        const field = query.sortBy ?? CompetenceSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
