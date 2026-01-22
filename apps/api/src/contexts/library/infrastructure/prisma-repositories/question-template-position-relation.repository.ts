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
      const relation = await this.prisma.libraryQuestionPosition.create({
        data: { questionId, positionId },
      });
      return LibraryMapper.toQuestionTemplatePositionRelationDomain(relation);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existing = await this.prisma.libraryQuestionPosition.findUnique({
          where: { questionId_positionId: { questionId, positionId } },
        });
        if (existing) return LibraryMapper.toQuestionTemplatePositionRelationDomain(existing);
      }
      throw error;
    }
  }

  async unlink(questionId: number, positionId: number): Promise<void> {
    await this.prisma.libraryQuestionPosition.deleteMany({
      where: { questionId, positionId },
    });
  }

  async listByQuestion(questionId: number): Promise<QuestionTemplatePositionRelationDomain[]> {
    const relations = await this.prisma.libraryQuestionPosition.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
    });

    return relations.map(LibraryMapper.toQuestionTemplatePositionRelationDomain);
  }

  async replace(questionId: number, positionIds: number[]): Promise<QuestionTemplatePositionRelationDomain[]> {
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

