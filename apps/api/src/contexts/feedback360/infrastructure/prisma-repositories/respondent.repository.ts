import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  RESPONDENT_REPOSITORY,
  RespondentRepositoryPort,
  RespondentSearchQuery,
  RespondentUpdatePayload,
} from '../../application/ports/respondent.repository.port';
import { RespondentDomain } from '../../domain/respondent.domain';
import { Feedback360Mapper } from './feedback360.mapper';

@Injectable()
export class RespondentRepository implements RespondentRepositoryPort {
  readonly [RESPONDENT_REPOSITORY] = RESPONDENT_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(relation: RespondentDomain): Promise<RespondentDomain> {
    const created = await this.prisma.respondent.create({
      data: {
        reviewId: relation.reviewId,
        respondentId: relation.respondentId,
        respondentCategory: Feedback360Mapper.toPrismaRespondentCategory(relation.respondentCategory),
        responseStatus: Feedback360Mapper.toPrismaResponseStatus(relation.responseStatus),
        respondentNote: relation.respondentNote,
        invitedAt: relation.invitedAt,
        respondedAt: relation.respondedAt,
      },
    });

    return Feedback360Mapper.toRespondentDomain(created);
  }

  async list(query: RespondentSearchQuery): Promise<RespondentDomain[]> {
    const relations = await this.prisma.respondent.findMany({
      where: {
        ...(query.reviewId ? { reviewId: query.reviewId } : {}),
        ...(query.respondentId ? { respondentId: query.respondentId } : {}),
        ...(query.category
          ? { respondentCategory: Feedback360Mapper.toPrismaRespondentCategory(query.category) }
          : {}),
        ...(query.status ? { responseStatus: Feedback360Mapper.toPrismaResponseStatus(query.status) } : {}),
      },
    });

    return relations.map(Feedback360Mapper.toRespondentDomain);
  }

  async updateById(id: number, patch: RespondentUpdatePayload): Promise<RespondentDomain> {
    const updated = await this.prisma.respondent.update({
      where: { id },
      data: {
        ...patch,
        ...(patch.responseStatus ? { responseStatus: Feedback360Mapper.toPrismaResponseStatus(patch.responseStatus) } : {}),
      },
    });
    return Feedback360Mapper.toRespondentDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.respondent.delete({ where: { id } });
  }
}
