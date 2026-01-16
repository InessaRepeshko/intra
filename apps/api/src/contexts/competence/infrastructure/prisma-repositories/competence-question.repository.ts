import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  CompetenceQuestionRepositoryPort,
  CompetenceQuestionSearchQuery,
  CompetenceQuestionSortField,
  CompetenceQuestionUpdatePayload,
} from '../../application/ports/competence-question.repository.port';
import { CompetenceQuestionDomain } from '../../domain/competence-question.domain';
import { CompetenceMapper } from './competence.mapper';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

@Injectable()
export class CompetenceQuestionRepository implements CompetenceQuestionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(question: CompetenceQuestionDomain): Promise<CompetenceQuestionDomain> {
    const created = await this.prisma.question.create({
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

  async findById(id: number): Promise<CompetenceQuestionDomain | null> {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { questionPositions: { select: { positionId: true } } },
    });

    return question ? CompetenceMapper.toQuestionDomain(question) : null;
  }

  async search(query: CompetenceQuestionSearchQuery): Promise<CompetenceQuestionDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);

    const items = await this.prisma.question.findMany({
      where,
      orderBy,
      include: { questionPositions: { select: { positionId: true } } },
    });

    return items.map(CompetenceMapper.toQuestionDomain);
  }

  async updateById(id: number, patch: CompetenceQuestionUpdatePayload): Promise<CompetenceQuestionDomain> {
    const updated = await this.prisma.question.update({
      where: { id },
      data: {
        ...patch,
      },
      include: { questionPositions: { select: { positionId: true } } },
    });

    return CompetenceMapper.toQuestionDomain(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.question.delete({ where: { id } });
  }

  private buildWhere(query: CompetenceQuestionSearchQuery): Prisma.QuestionWhereInput {
    const { competenceId, positionId, status, answerType, isForSelfassessment, search } = query;

    return {
      ...(competenceId ? { competenceId } : {}),
      ...(positionId
        ? {
            questionPositions: {
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

  private buildOrder(query: CompetenceQuestionSearchQuery): Prisma.QuestionOrderByWithRelationInput[] {
    const field = query.sortBy ?? CompetenceQuestionSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}

