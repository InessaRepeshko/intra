import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  FEEDBACK360_QUESTION_REPOSITORY,
  Feedback360QuestionRepositoryPort,
  Feedback360QuestionSearchQuery,
  Feedback360QuestionSortField,
} from '../../application/ports/feedback360-question.repository.port';
import { Feedback360QuestionDomain } from '../../domain/feedback360-question.domain';
import { PerformanceMapper } from './performance.mapper';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

@Injectable()
export class Feedback360QuestionRepository implements Feedback360QuestionRepositoryPort {
  readonly [FEEDBACK360_QUESTION_REPOSITORY] = FEEDBACK360_QUESTION_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(question: Feedback360QuestionDomain): Promise<Feedback360QuestionDomain> {
    const created = await this.prisma.feedback360Question.create({
      data: {
        cycleId: question.cycleId,
        questionId: question.questionId,
        title: question.title,
        answerType: PerformanceMapper.toPrismaAnswerType(question.answerType),
        competenceId: question.competenceId,
        positionId: question.positionId,
        isForSelfassessment: question.isForSelfassessment,
      },
    });

    return PerformanceMapper.toQuestionDomain(created);
  }

  async findById(id: number): Promise<Feedback360QuestionDomain | null> {
    const question = await this.prisma.feedback360Question.findUnique({ where: { id } });
    return question ? PerformanceMapper.toQuestionDomain(question) : null;
  }

  async search(query: Feedback360QuestionSearchQuery): Promise<Feedback360QuestionDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);
    const items = await this.prisma.feedback360Question.findMany({ where, orderBy });
    return items.map(PerformanceMapper.toQuestionDomain);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.feedback360Question.delete({ where: { id } });
  }

  private buildWhere(query: Feedback360QuestionSearchQuery): Prisma.Feedback360QuestionWhereInput {
    const { cycleId, positionId, competenceId, answerType, isForSelfassessment } = query;
    return {
      ...(cycleId ? { cycleId } : {}),
      ...(positionId ? { positionId } : {}),
      ...(competenceId ? { competenceId } : {}),
      ...(answerType ? { answerType: PerformanceMapper.toPrismaAnswerType(answerType) } : {}),
      ...(isForSelfassessment !== undefined ? { isForSelfassessment } : {}),
    };
  }

  private buildOrder(query: Feedback360QuestionSearchQuery): Prisma.Feedback360QuestionOrderByWithRelationInput[] {
    const field = query.sortBy ?? Feedback360QuestionSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
