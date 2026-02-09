import { Prisma } from '@intra/database';
import {
    RespondentSearchQuery,
    RespondentSortField,
    SortDirection,
    UpdateRespondentPayload,
} from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    RESPONDENT_REPOSITORY,
    RespondentRepositoryPort,
} from '../../application/ports/respondent.repository.port';
import { RespondentDomain } from '../../domain/respondent.domain';
import { RespondentMapper } from '../mappers/respondent.mapper';

@Injectable()
export class RespondentRepository implements RespondentRepositoryPort {
    readonly [RESPONDENT_REPOSITORY] = RESPONDENT_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async create(respondent: RespondentDomain): Promise<RespondentDomain> {
        const created = await this.prisma.respondent.create({
            data: RespondentMapper.toPrisma(respondent),
        });

        return RespondentMapper.toDomain(created);
    }

    async listByReview(
        reviewId: number,
        query: RespondentSearchQuery,
    ): Promise<RespondentDomain[]> {
        const where = this.buildWhere(query);
        where.reviewId = reviewId;
        const orderBy = this.buildOrder(query);
        const relations = await this.prisma.respondent.findMany({
            where,
            orderBy,
        });

        return relations.map(RespondentMapper.toDomain);
    }

    async updateById(
        id: number,
        patch: UpdateRespondentPayload,
    ): Promise<RespondentDomain> {
        const updated = await this.prisma.respondent.update({
            where: { id },
            data: {
                ...patch,
                ...(patch.category
                    ? {
                          category: RespondentMapper.toPrismaCategory(
                              patch.category,
                          ),
                      }
                    : {}),
                ...(patch.responseStatus
                    ? {
                          responseStatus:
                              RespondentMapper.toPrismaResponseStatus(
                                  patch.responseStatus,
                              ),
                      }
                    : {}),
            },
        });
        return RespondentMapper.toDomain(updated);
    }

    async deleteById(id: number): Promise<void> {
        await this.prisma.respondent.delete({ where: { id } });
    }

    private buildWhere(
        query: RespondentSearchQuery,
    ): Prisma.RespondentWhereInput {
        const {
            reviewId,
            respondentId,
            fullName,
            category,
            responseStatus,
            respondentNote,
            hrNote,
            positionId,
            positionTitle,
            teamId,
            teamTitle,
            invitedAt,
            canceledAt,
            respondedAt,
        } = query;
        return {
            ...(reviewId ? { reviewId } : {}),
            ...(respondentId ? { respondentId } : {}),
            ...(fullName
                ? { fullName: { contains: fullName, mode: 'insensitive' } }
                : {}),
            ...(category
                ? {
                      category: RespondentMapper.toPrismaCategory(category),
                  }
                : {}),
            ...(responseStatus
                ? {
                      responseStatus:
                          RespondentMapper.toPrismaResponseStatus(
                              responseStatus,
                          ),
                  }
                : {}),
            ...(respondentNote
                ? {
                      respondentNote: {
                          contains: respondentNote,
                          mode: 'insensitive',
                      },
                  }
                : {}),
            ...(hrNote
                ? { hrNote: { contains: hrNote, mode: 'insensitive' } }
                : {}),
            ...(positionId ? { positionId } : {}),
            ...(positionTitle
                ? {
                      positionTitle: {
                          contains: positionTitle,
                          mode: 'insensitive',
                      },
                  }
                : {}),
            ...(teamId ? { teamId } : {}),
            ...(teamTitle
                ? { teamTitle: { contains: teamTitle, mode: 'insensitive' } }
                : {}),
            ...(invitedAt ? { invitedAt } : {}),
            ...(canceledAt ? { canceledAt } : {}),
            ...(respondedAt ? { respondedAt } : {}),
        };
    }

    private buildOrder(
        query: RespondentSearchQuery,
    ): Prisma.RespondentOrderByWithRelationInput[] {
        const field = query.sortBy ?? RespondentSortField.ID;
        const direction = query.sortDirection ?? SortDirection.ASC;
        return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
    }
}
