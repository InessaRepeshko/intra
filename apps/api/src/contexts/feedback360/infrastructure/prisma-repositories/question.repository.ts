import { Injectable } from '@nestjs/common';
import { Prisma } from '@intra/database';
import { PrismaService } from 'src/database/prisma.service';
import {
  QUESTION_REPOSITORY,
  QuestionRepositoryPort,
} from '../../application/ports/question.repository.port';
import { QuestionDomain } from '../../domain/question.domain';
import { Feedback360Mapper } from './feedback360.mapper';
import { SortDirection, QuestionSearchQuery, QuestionSortField } from '@intra/shared-kernel';

@Injectable()
export class QuestionRepository implements QuestionRepositoryPort {
  readonly [QUESTION_REPOSITORY] = QUESTION_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(question: QuestionDomain): Promise<QuestionDomain> {
    const created = await this.prisma.question.create({
      data: {
        cycleId: question.cycleId,
        questionTemplateId: question.questionTemplateId,
        title: question.title,
        answerType: Feedback360Mapper.toPrismaAnswerType(question.answerType),
        competenceId: question.competenceId,
        isForSelfassessment: question.isForSelfassessment,
      },
    });

    return Feedback360Mapper.toQuestionDomain(created);
  }

  async findById(id: number): Promise<QuestionDomain | null> {
    const question = await this.prisma.question.findUnique({ where: { id } });
    return question ? Feedback360Mapper.toQuestionDomain(question) : null;
  }

  async search(query: QuestionSearchQuery): Promise<QuestionDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);
    const items = await this.prisma.question.findMany({ where, orderBy });
    return items.map(Feedback360Mapper.toQuestionDomain);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.question.delete({ where: { id } });
  }

  private buildWhere(query: QuestionSearchQuery): Prisma.QuestionWhereInput {
    const { cycleId, questionTemplateId, competenceId, answerType, isForSelfassessment, title } = query;
    return {
      ...(cycleId ? { cycleId } : {}),
      ...(questionTemplateId ? { questionTemplateId } : {}),
      ...(title ? { title: { contains: title, mode: 'insensitive' } } : {}),
      ...(answerType ? { answerType: Feedback360Mapper.toPrismaAnswerType(answerType) } : {}),
      ...(competenceId ? { competenceId } : {}),
      ...(isForSelfassessment !== undefined ? { isForSelfassessment } : {}),
    };
  }

  private buildOrder(query: QuestionSearchQuery): Prisma.QuestionOrderByWithRelationInput[] {
    const field = query.sortBy ?? QuestionSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
