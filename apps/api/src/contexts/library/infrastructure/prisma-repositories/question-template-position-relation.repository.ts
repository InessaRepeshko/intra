import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import { QuestionTemplatePositionRelationRepositoryPort } from '../../application/ports/question-template-position-relation.repository.port';
import { QuestionTemplatePositionRelationDomain } from '../../domain/question-template-position-relation.domain';
import { LibraryMapper } from './library.mapper';

@Injectable()
export class QuestionTemplatePositionRelationRepository implements QuestionTemplatePositionRelationRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async link(questionId: number, positionId: number): Promise<QuestionTemplatePositionRelationDomain> {
    try {
      const relation = await this.prisma.questionTemplatePositionRelation.create({
        data: { questionTemplateId: questionId, positionId },
      });
      return LibraryMapper.toQuestionTemplatePositionRelationDomain(relation);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await this.prisma.questionTemplatePositionRelation.findUnique({
          where: { questionTemplateId_positionId: { questionTemplateId: questionId, positionId } },
        });
        if (existing) return LibraryMapper.toQuestionTemplatePositionRelationDomain(existing);
      }
      throw error;
    }
  }

  async unlink(questionId: number, positionId: number): Promise<void> {
    await this.prisma.questionTemplatePositionRelation.deleteMany({
      where: { questionTemplateId: questionId, positionId },
    });
  }

  async listByQuestion(questionId: number): Promise<QuestionTemplatePositionRelationDomain[]> {
    const relations = await this.prisma.questionTemplatePositionRelation.findMany({
      where: { questionTemplateId: questionId },
      orderBy: { createdAt: 'desc' },
    });

    return relations.map(LibraryMapper.toQuestionTemplatePositionRelationDomain);
  }

  async replace(questionId: number, positionIds: number[]): Promise<QuestionTemplatePositionRelationDomain[]> {
    const unique = Array.from(new Set(positionIds));

    await this.prisma.$transaction(async (tx) => {
      const deleteFilter =
        unique.length > 0 ? { questionTemplateId: questionId, NOT: { positionId: { in: unique } } } : { questionTemplateId: questionId };
      await tx.questionTemplatePositionRelation.deleteMany({ where: deleteFilter });

      if (unique.length) {
        await tx.questionTemplatePositionRelation.createMany({
          data: unique.map((positionId) => ({ questionTemplateId: questionId, positionId })),
          skipDuplicates: true,
        });
      }
    });

    return this.listByQuestion(questionId);
  }
}

