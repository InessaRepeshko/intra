import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  FEEDBACK360_ANSWER_REPOSITORY,
  Feedback360AnswerRepositoryPort,
  Feedback360AnswerSearchQuery,
} from '../../application/ports/feedback360-answer.repository.port';
import { Feedback360AnswerDomain } from '../../domain/feedback360-answer.domain';
import { PerformanceMapper } from './performance.mapper';

@Injectable()
export class Feedback360AnswerRepository implements Feedback360AnswerRepositoryPort {
  readonly [FEEDBACK360_ANSWER_REPOSITORY] = FEEDBACK360_ANSWER_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async create(answer: Feedback360AnswerDomain): Promise<Feedback360AnswerDomain> {
    const created = await this.prisma.feedback360Answer.create({
      data: {
        feedback360Id: answer.feedback360Id,
        questionId: answer.questionId,
        feedback360QuestionId: answer.feedback360QuestionId,
        respondentCategory: PerformanceMapper.toPrismaRespondentCategory(answer.respondentCategory),
        answerType: PerformanceMapper.toPrismaAnswerType(answer.answerType),
        numericalValue: answer.numericalValue,
        textValue: answer.textValue,
      },
    });

    return PerformanceMapper.toAnswerDomain(created);
  }

  async list(query: Feedback360AnswerSearchQuery): Promise<Feedback360AnswerDomain[]> {
    const answers = await this.prisma.feedback360Answer.findMany({
      where: {
        ...(query.feedback360Id ? { feedback360Id: query.feedback360Id } : {}),
        ...(query.respondentCategory
          ? { respondentCategory: PerformanceMapper.toPrismaRespondentCategory(query.respondentCategory) }
          : {}),
      },
    });
    return answers.map(PerformanceMapper.toAnswerDomain);
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.feedback360Answer.delete({ where: { id } });
  }
}
