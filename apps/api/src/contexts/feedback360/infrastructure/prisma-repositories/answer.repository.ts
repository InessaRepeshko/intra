import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  ANSWER_REPOSITORY,
  AnswerRepositoryPort,
  AnswerSearchQuery,
  AnswerSortField,
} from '../../application/ports/answer.repository.port';
import { AnswerDomain } from '../../domain/answer.domain';
import { Feedback360Mapper } from './feedback360.mapper';
import { SortDirection } from '@intra/shared-kernel';
import { Prisma } from '@intra/database';

@Injectable()
export class AnswerRepository implements AnswerRepositoryPort {
  readonly [ANSWER_REPOSITORY] = ANSWER_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(answer: AnswerDomain): Promise<AnswerDomain> {
    const created = await this.prisma.answer.create({
      data: {
        reviewId: answer.reviewId,
        questionId: answer.questionId,
        respondentCategory: Feedback360Mapper.toPrismaRespondentCategory(answer.respondentCategory),
        answerType: Feedback360Mapper.toPrismaAnswerType(answer.answerType),
        numericalValue: answer.numericalValue,
        textValue: answer.textValue,
        createdAt: answer.createdAt,
      },
    });

    return Feedback360Mapper.toAnswerDomain(created);
  }

  async list(query: AnswerSearchQuery): Promise<AnswerDomain[]> {
    const where = this.buildWhere(query);
    const orderBy = this.buildOrder(query);
    const answers = await this.prisma.answer.findMany({ where, orderBy });
    return answers.map(Feedback360Mapper.toAnswerDomain);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.answer.delete({ where: { id } });
  }

  private buildWhere(query: AnswerSearchQuery): Prisma.AnswerWhereInput {
    const { reviewId, questionId, respondentCategory, answerType, numericalValue, textValue } = query;
    return {
      ...(reviewId ? { reviewId } : {}),
      ...(questionId ? { questionId } : {}),
      ...(respondentCategory ? { respondentCategory: Feedback360Mapper.toPrismaRespondentCategory(respondentCategory) } : {}),
      ...(answerType ? { answerType: Feedback360Mapper.toPrismaAnswerType(answerType) } : {}),
      ...(numericalValue ? { numericalValue } : {}),
      ...(textValue ? { textValue: { contains: textValue, mode: 'insensitive' } } : {}),
    };
  }

  private buildOrder(query: AnswerSearchQuery): Prisma.AnswerOrderByWithRelationInput[] {
    const field = query.sortBy ?? AnswerSortField.ID;
    const direction = query.sortDirection ?? SortDirection.ASC;
    return [{ [field]: direction.toLowerCase() as Prisma.SortOrder }];
  }
}
