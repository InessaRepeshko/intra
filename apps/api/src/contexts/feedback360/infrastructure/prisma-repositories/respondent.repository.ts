import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  RESPONDENT_REPOSITORY,
  RespondentRepositoryPort
} from '../../application/ports/respondent.repository.port';
import { RespondentDomain } from '../../domain/respondent.domain';
import { Feedback360Mapper } from './feedback360.mapper';
import { Prisma } from '@intra/database';
import {
  SortDirection,
  RespondentSearchQuery,
  RespondentSortField,
  UpdateRespondentPayload,
} from '@intra/shared-kernel';

@Injectable()
export class RespondentRepository implements RespondentRepositoryPort {
  readonly [RESPONDENT_REPOSITORY] = RESPONDENT_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(relation: RespondentDomain): Promise<RespondentDomain> {
    const created = await this.prisma.respondent.create({
      data: {
        reviewId: relation.reviewId,
        respondentId: relation.respondentId,
        fullName: relation.fullName,
        category: Feedback360Mapper.toPrismaRespondentCategory(relation.category),
        responseStatus: Feedback360Mapper.toPrismaResponseStatus(relation.responseStatus),
        respondentNote: relation.respondentNote,
        hrNote: relation.hrNote,
        positionId: relation.positionId,
        positionTitle: relation.positionTitle,
        teamId: relation.teamId,
        teamTitle: relation.teamTitle,
        invitedAt: relation.invitedAt,
        canceledAt: relation.canceledAt,
        respondedAt: relation.respondedAt,
      },
    });

    return Feedback360Mapper.toRespondentDomain(created);
  }

  async listByReview(reviewId: number, query: RespondentSearchQuery): Promise<RespondentDomain[]> {
    const where = this.buildWhere(query);
    where.reviewId = reviewId;
    const orderBy = this.buildOrder(query);
    const relations = await this.prisma.respondent.findMany({ where, orderBy });

    return relations.map(Feedback360Mapper.toRespondentDomain);
  }

  async updateById(id: number, patch: UpdateRespondentPayload): Promise<RespondentDomain> {
    const updated = await this.prisma.respondent.update({
      where: { id },
      data: {
        ...patch,
        ...(patch.category ? { category: Feedback360Mapper.toPrismaRespondentCategory(patch.category) } : {}),
        ...(patch.responseStatus ? { responseStatus: Feedback360Mapper.toPrismaResponseStatus(patch.responseStatus) } : {}),
      },
    });
    return Feedback360Mapper.toRespondentDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.respondent.delete({ where: { id } });
  }

  private buildWhere(query: RespondentSearchQuery): Prisma.RespondentWhereInput {
    const { reviewId, respondentId, fullName, category, responseStatus, respondentNote, hrNote, positionId, positionTitle, teamId, teamTitle, invitedAt, canceledAt, respondedAt } = query;
    return {
      ...(reviewId ? { reviewId } : {}),
      ...(respondentId ? { respondentId } : {}),
      ...(fullName ? { fullName: { contains: fullName, mode: 'insensitive' } } : {}),
      ...(category ? { category: Feedback360Mapper.toPrismaRespondentCategory(category) } : {}),
      ...(responseStatus ? { responseStatus: Feedback360Mapper.toPrismaResponseStatus(responseStatus) } : {}),
      ...(respondentNote ? { respondentNote: { contains: respondentNote, mode: 'insensitive' } } : {}),
      ...(hrNote ? { hrNote: { contains: hrNote, mode: 'insensitive' } } : {}),
      ...(positionId ? { positionId } : {}),
      ...(positionTitle ? { positionTitle: { contains: positionTitle, mode: 'insensitive' } } : {}),
      ...(teamId ? { teamId } : {}),
      ...(teamTitle ? { teamTitle: { contains: teamTitle, mode: 'insensitive' } } : {}),
      ...(invitedAt ? { invitedAt } : {}),
      ...(canceledAt ? { canceledAt } : {}),
      ...(respondedAt ? { respondedAt } : {}),
    };
  }

  private buildOrder(query: RespondentSearchQuery): Prisma.RespondentOrderByWithRelationInput[] {
    const field = query.sortBy ?? RespondentSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
