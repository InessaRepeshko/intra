import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  FEEDBACK360_RESPONDENT_REPOSITORY,
  Feedback360RespondentRepositoryPort,
  Feedback360RespondentSearchQuery,
  Feedback360RespondentUpdatePayload,
} from '../../application/ports/feedback360-respondent.repository.port';
import { Feedback360RespondentRelationDomain } from '../../domain/feedback360-respondent-relation.domain';
import { PerformanceMapper } from './performance.mapper';

@Injectable()
export class Feedback360RespondentRepository implements Feedback360RespondentRepositoryPort {
  readonly [FEEDBACK360_RESPONDENT_REPOSITORY] = FEEDBACK360_RESPONDENT_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(relation: Feedback360RespondentRelationDomain): Promise<Feedback360RespondentRelationDomain> {
    const created = await this.prisma.feedback360RespondentRelation.create({
      data: {
        feedback360Id: relation.feedback360Id,
        respondentId: relation.respondentId,
        respondentCategory: PerformanceMapper.toPrismaRespondentCategory(relation.respondentCategory),
        feedback360Status: PerformanceMapper.toPrismaStatus(relation.feedback360Status),
        respondentNote: relation.respondentNote,
        invitedAt: relation.invitedAt,
        respondedAt: relation.respondedAt,
      },
    });

    return PerformanceMapper.toRespondentDomain(created);
  }

  async list(query: Feedback360RespondentSearchQuery): Promise<Feedback360RespondentRelationDomain[]> {
    const relations = await this.prisma.feedback360RespondentRelation.findMany({
      where: {
        ...(query.feedback360Id ? { feedback360Id: query.feedback360Id } : {}),
        ...(query.respondentId ? { respondentId: query.respondentId } : {}),
        ...(query.category
          ? { respondentCategory: PerformanceMapper.toPrismaRespondentCategory(query.category) }
          : {}),
        ...(query.status ? { feedback360Status: PerformanceMapper.toPrismaStatus(query.status) } : {}),
      },
    });

    return relations.map(PerformanceMapper.toRespondentDomain);
  }

  async updateById(id: number, patch: Feedback360RespondentUpdatePayload): Promise<Feedback360RespondentRelationDomain> {
    const updated = await this.prisma.feedback360RespondentRelation.update({
      where: { id },
      data: {
        ...patch,
        ...(patch.feedback360Status ? { feedback360Status: PerformanceMapper.toPrismaStatus(patch.feedback360Status) } : {}),
      },
    });
    return PerformanceMapper.toRespondentDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.feedback360RespondentRelation.delete({ where: { id } });
  }
}
