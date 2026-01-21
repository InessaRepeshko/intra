import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  QuestionRepositoryPort,
  QuestionSearchQuery,
  QuestionSortField,
  QuestionUpdatePayload,
} from '../../application/ports/question.repository.port';
import { QuestionDomain } from '../../domain/question.domain';
import { CompetenceMapper } from './competence.mapper';
import { SortDirection } from '@intra/shared-kernel';

@Injectable()
export class QuestionRepository implements QuestionRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async create(question: QuestionDomain): Promise<QuestionDomain> {
    const created = await this.prisma.libraryQuestion.create({
      data: {
        title: question.title,
        answerType: question.answerType,
        competenceId: question.competenceId,
        isForSelfassessment: question.isForSelfassessment,
        questionStatus: question.questionStatus,
      },
    });

    return CompetenceMapper.toQuestionDomain(created);
  }

  async findById(id: number): Promise<QuestionDomain | null> {
    const question = await this.prisma.libraryQuestion.findUnique({
      where: { id },
      include: { libraryQuestionPositions: { select: { positionId: true } } },
    });

    return question ? CompetenceMapper.toQuestionDomain(question) : null;
  }

  async search(query: QuestionSearchQuery): Promise<QuestionDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);

    const items = await this.prisma.libraryQuestion.findMany({
      where,
      orderBy,
      include: { libraryQuestionPositions: { select: { positionId: true } } },
    });

    return items.map(CompetenceMapper.toQuestionDomain);
  }

  async updateById(id: number, patch: QuestionUpdatePayload): Promise<QuestionDomain> {
    const updated = await this.prisma.libraryQuestion.update({
      where: { id },
      data: {
        ...patch,
      },
      include: { libraryQuestionPositions: { select: { positionId: true } } },
    });

    return CompetenceMapper.toQuestionDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.libraryQuestion.delete({ where: { id } });
  }

  private buildWhere(query: QuestionSearchQuery): Prisma.LibraryQuestionWhereInput {
    const { competenceId, positionId, status, answerType, isForSelfassessment, search } = query;

    return {
      ...(competenceId ? { competenceId } : {}),
      ...(positionId
        ? {
          libraryQuestionPositions: {
            some: { positionId },
          },
        }
        : {}),
      ...(status ? { questionStatus: status } : {}),
      ...(answerType ? { answerType } : {}),
      ...(isForSelfassessment !== undefined ? { isForSelfassessment } : {}),
      ...(search
        ? {
          title: { contains: search, mode: 'insensitive' },
        }
        : {}),
    };
  }

  private buildOrder(query: QuestionSearchQuery): Prisma.LibraryQuestionOrderByWithRelationInput[] {
    const field = query.sortBy ?? QuestionSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}

