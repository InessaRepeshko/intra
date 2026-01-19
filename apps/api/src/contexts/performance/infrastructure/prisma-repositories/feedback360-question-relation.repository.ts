import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  FEEDBACK360_QUESTION_RELATION_REPOSITORY,
  Feedback360QuestionRelationRepositoryPort,
} from '../../application/ports/feedback360-question-relation.repository.port';
import { Feedback360QuestionRelationDomain } from '../../domain/feedback360-question-relation.domain';
import { PerformanceMapper } from './performance.mapper';

@Injectable()
export class Feedback360QuestionRelationRepository implements Feedback360QuestionRelationRepositoryPort {
  readonly [FEEDBACK360_QUESTION_RELATION_REPOSITORY] = FEEDBACK360_QUESTION_RELATION_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async link(relation: Feedback360QuestionRelationDomain): Promise<Feedback360QuestionRelationDomain> {
    const created = await this.prisma.feedback360QuestionRelation.upsert({
      where: {
        feedback360Id_questionId: {
          feedback360Id: relation.feedback360Id,
          questionId: relation.questionId,
        },
      },
      create: {
        feedback360Id: relation.feedback360Id,
        questionId: relation.questionId,
        questionTitle: relation.questionTitle,
        answerType: PerformanceMapper.toPrismaAnswerType(relation.answerType),
        competenceId: relation.competenceId,
        isForSelfassessment: relation.isForSelfassessment,
      },
      update: {
        questionTitle: relation.questionTitle,
        answerType: PerformanceMapper.toPrismaAnswerType(relation.answerType),
        competenceId: relation.competenceId,
        isForSelfassessment: relation.isForSelfassessment,
      },
    });

    return PerformanceMapper.toQuestionRelationDomain(created);
  }

  async listByFeedback(feedback360Id: number): Promise<Feedback360QuestionRelationDomain[]> {
    const relations = await this.prisma.feedback360QuestionRelation.findMany({
      where: { feedback360Id },
    });
    return relations.map(PerformanceMapper.toQuestionRelationDomain);
  }

  async unlink(feedback360Id: number, questionId: number): Promise<void> {
    await this.prisma.feedback360QuestionRelation.delete({
      where: {
        feedback360Id_questionId: {
          feedback360Id,
          questionId,
        },
      },
    });
  }
}
