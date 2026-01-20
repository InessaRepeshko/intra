import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import { QuestionPositionRepositoryPort } from '../../application/ports/question-position.repository.port';
import { QuestionPositionDomain } from '../../domain/question-position.domain';
import { CompetenceMapper } from './competence.mapper';

@Injectable()
export class QuestionPositionRepository implements QuestionPositionRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async link(questionId: number, positionId: number): Promise<QuestionPositionDomain> {
    try {
      const relation = await this.prisma.libraryQuestionPosition.create({
        data: { questionId, positionId },
      });
      return CompetenceMapper.toQuestionPositionDomain(relation);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await this.prisma.libraryQuestionPosition.findUnique({
          where: { questionId_positionId: { questionId, positionId } },
        });
        if (existing) return CompetenceMapper.toQuestionPositionDomain(existing);
      }
      throw error;
    }
  }

  async unlink(questionId: number, positionId: number): Promise<void> {
    await this.prisma.libraryQuestionPosition.deleteMany({
      where: { questionId, positionId },
    });
  }

  async listByQuestion(questionId: number): Promise<QuestionPositionDomain[]> {
    const relations = await this.prisma.libraryQuestionPosition.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
    });

    return relations.map(CompetenceMapper.toQuestionPositionDomain);
  }

  async replace(questionId: number, positionIds: number[]): Promise<QuestionPositionDomain[]> {
    const unique = Array.from(new Set(positionIds));

    await this.prisma.$transaction(async (tx) => {
      const deleteFilter =
        unique.length > 0 ? { questionId, NOT: { positionId: { in: unique } } } : { questionId };
      await tx.libraryQuestionPosition.deleteMany({ where: deleteFilter });

      if (unique.length) {
        await tx.libraryQuestionPosition.createMany({
          data: unique.map((positionId) => ({ questionId, positionId })),
          skipDuplicates: true,
        });
      }
    });

    return this.listByQuestion(questionId);
  }
}

