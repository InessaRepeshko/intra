import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  QUESTION_REPOSITORY,
  QuestionRepositoryPort,
  QuestionSearchQuery,
  QuestionSortField,
} from '../../application/ports/question.repository.port';
import { QuestionDomain } from '../../domain/question.domain';
import { Feedback360Mapper } from './feedback360.mapper';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

@Injectable()
export class QuestionRepository implements QuestionRepositoryPort {
  readonly [QUESTION_REPOSITORY] = QUESTION_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(question: QuestionDomain): Promise<QuestionDomain> {
    const created = await this.prisma.reviewQuestion.create({
      data: {
        cycleId: question.cycleId,
        libraryQuestionId: question.libraryQuestionId,
        title: question.title,
        answerType: Feedback360Mapper.toPrismaAnswerType(question.answerType),
        competenceId: question.competenceId,
        positionId: question.positionId,
        isForSelfassessment: question.isForSelfassessment,
      },
    });

    return Feedback360Mapper.toQuestionDomain(created);
  }

  async findById(id: number): Promise<QuestionDomain | null> {
    const question = await this.prisma.reviewQuestion.findUnique({ where: { id } });
    return question ? Feedback360Mapper.toQuestionDomain(question) : null;
  }

  async search(query: QuestionSearchQuery): Promise<QuestionDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);
    const items = await this.prisma.reviewQuestion.findMany({ where, orderBy });
    return items.map(Feedback360Mapper.toQuestionDomain);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.reviewQuestion.delete({ where: { id } });
  }

  private buildWhere(query: QuestionSearchQuery): Prisma.ReviewQuestionWhereInput {
    const { cycleId, positionId, competenceId, answerType, isForSelfassessment } = query;
    return {
      ...(cycleId ? { cycleId } : {}),
      ...(positionId ? { positionId } : {}),
      ...(competenceId ? { competenceId } : {}),
      ...(answerType ? { answerType: Feedback360Mapper.toPrismaAnswerType(answerType) } : {}),
      ...(isForSelfassessment !== undefined ? { isForSelfassessment } : {}),
    };
  }

  private buildOrder(query: QuestionSearchQuery): Prisma.ReviewQuestionOrderByWithRelationInput[] {
    const field = query.sortBy ?? QuestionSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
