import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import { CompetenceQuestionPositionRepositoryPort } from '../../application/ports/competence-question-position.repository.port';
import { CompetenceQuestionPositionDomain } from '../../domain/competence-question-position.domain';
import { CompetenceMapper } from './competence.mapper';

@Injectable()
export class CompetenceQuestionPositionRepository implements CompetenceQuestionPositionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async link(questionId: number, positionId: number): Promise<CompetenceQuestionPositionDomain> {
    try {
      const relation = await this.prisma.questionPositionRelation.create({
        data: { questionId, positionId },
      });
      return CompetenceMapper.toQuestionPositionDomain(relation);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await this.prisma.questionPositionRelation.findUnique({
          where: { questionId_positionId: { questionId, positionId } },
        });
        if (existing) return CompetenceMapper.toQuestionPositionDomain(existing);
      }
      throw error;
    }
  }

  async unlink(questionId: number, positionId: number): Promise<void> {
    await this.prisma.questionPositionRelation.deleteMany({
      where: { questionId, positionId },
    });
  }

  async listByQuestion(questionId: number): Promise<CompetenceQuestionPositionDomain[]> {
    const relations = await this.prisma.questionPositionRelation.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
    });

    return relations.map(CompetenceMapper.toQuestionPositionDomain);
  }

  async replace(questionId: number, positionIds: number[]): Promise<CompetenceQuestionPositionDomain[]> {
    const unique = Array.from(new Set(positionIds));

    await this.prisma.$transaction(async (tx) => {
      const deleteFilter =
        unique.length > 0 ? { questionId, NOT: { positionId: { in: unique } } } : { questionId };
      await tx.questionPositionRelation.deleteMany({ where: deleteFilter });

      if (unique.length) {
        await tx.questionPositionRelation.createMany({
          data: unique.map((positionId) => ({ questionId, positionId })),
          skipDuplicates: true,
        });
      }
    });

    return this.listByQuestion(questionId);
  }
}

