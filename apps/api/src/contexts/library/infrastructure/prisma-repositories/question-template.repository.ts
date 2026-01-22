import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  QuestionTemplateRepositoryPort,
  QuestionTemplateSearchQuery,
  QuestionTemplateSortField,
  QuestionTemplateUpdatePayload,
} from '../../application/ports/question-template.repository.port';
import { QuestionTemplateDomain } from '../../domain/question-template.domain';
import { LibraryMapper } from './library.mapper';
import { SortDirection } from '@intra/shared-kernel';

@Injectable()
export class QuestionTemplateRepository implements QuestionTemplateRepositoryPort {
  constructor(private readonly prisma: PrismaService) { }

  async create(question: QuestionTemplateDomain): Promise<QuestionTemplateDomain> {
    const created = await this.prisma.libraryQuestion.create({
      data: {
        title: question.title,
        answerType: question.answerType,
        competenceId: question.competenceId,
        isForSelfassessment: question.isForSelfassessment,
        questionStatus: question.status,
      },
    });

    return LibraryMapper.toQuestionTemplateDomain(created);
  }

  async findById(id: number): Promise<QuestionTemplateDomain | null> {
    const question = await this.prisma.libraryQuestion.findUnique({
      where: { id },
      include: { libraryQuestionPositions: { select: { positionId: true } } },
    });

    return question ? LibraryMapper.toQuestionTemplateDomain(question) : null;
  }

  async search(query: QuestionTemplateSearchQuery): Promise<QuestionTemplateDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);

    const items = await this.prisma.libraryQuestion.findMany({
      where,
      orderBy,
      include: { libraryQuestionPositions: { select: { positionId: true } } },
    });

    return items.map(LibraryMapper.toQuestionTemplateDomain);
  }

  async updateById(id: number, patch: QuestionTemplateUpdatePayload): Promise<QuestionTemplateDomain> {
    const updated = await this.prisma.libraryQuestion.update({
      where: { id },
      data: {
        ...patch,
      },
      include: { libraryQuestionPositions: { select: { positionId: true } } },
    });

    return LibraryMapper.toQuestionTemplateDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.libraryQuestion.delete({ where: { id } });
  }

  private buildWhere(query: QuestionTemplateSearchQuery): Prisma.LibraryQuestionWhereInput {
    const { competenceId, positionId, status: status, answerType, isForSelfassessment, search } = query;

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

  private buildOrder(query: QuestionTemplateSearchQuery): Prisma.LibraryQuestionOrderByWithRelationInput[] {
    const field = query.sortBy ?? QuestionTemplateSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}

