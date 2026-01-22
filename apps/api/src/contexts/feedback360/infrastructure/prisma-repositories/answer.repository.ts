import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  ANSWER_REPOSITORY,
  AnswerRepositoryPort,
  AnswerSearchQuery,
} from '../../application/ports/answer.repository.port';
import { AnswerDomain } from '../../domain/answer.domain';
import { Feedback360Mapper } from './feedback360.mapper';

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
    const answers = await this.prisma.answer.findMany({
      where: {
        ...(query.reviewId ? { reviewId: query.reviewId } : {}),
        ...(query.respondentCategory
          ? { respondentCategory: Feedback360Mapper.toPrismaRespondentCategory(query.respondentCategory) }
          : {}),
      },
    });
    return answers.map(Feedback360Mapper.toAnswerDomain);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.answer.delete({ where: { id } });
  }
}
