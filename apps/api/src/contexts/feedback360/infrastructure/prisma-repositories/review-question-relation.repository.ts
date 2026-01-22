import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  REVIEW_QUESTION_RELATION_REPOSITORY,
  ReviewQuestionRelationRepositoryPort,
} from '../../application/ports/review-question-relation.repository.port';
import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';
import { Feedback360Mapper } from './feedback360.mapper';

@Injectable()
export class ReviewQuestionRelationRepository implements ReviewQuestionRelationRepositoryPort {
  readonly [REVIEW_QUESTION_RELATION_REPOSITORY] = REVIEW_QUESTION_RELATION_REPOSITORY;

  constructor(private readonly prisma: PrismaService) { }

  async link(relation: ReviewQuestionRelationDomain): Promise<ReviewQuestionRelationDomain> {
    const created = await this.prisma.reviewQuestionRelation.upsert({
      where: {
        reviewId_questionId: {
          reviewId: relation.reviewId,
          questionId: relation.questionId,
        },
      },
      create: {
        reviewId: relation.reviewId,
        questionId: relation.questionId,
        questionTitle: relation.questionTitle,
        answerType: Feedback360Mapper.toPrismaAnswerType(relation.answerType),
        competenceId: relation.competenceId,
        competenceTitle: relation.competenceTitle,
        isForSelfassessment: relation.isForSelfassessment,
      },
      update: {
        questionTitle: relation.questionTitle,
        answerType: Feedback360Mapper.toPrismaAnswerType(relation.answerType),
        competenceId: relation.competenceId,
        competenceTitle: relation.competenceTitle,
        isForSelfassessment: relation.isForSelfassessment,
      },
    });

    return Feedback360Mapper.toQuestionRelationDomain(created);
  }

  async listByReview(reviewId: number): Promise<ReviewQuestionRelationDomain[]> {
    const relations = await this.prisma.reviewQuestionRelation.findMany({
      where: { reviewId },
    });
    return relations.map(Feedback360Mapper.toQuestionRelationDomain);
  }

  async unlink(reviewId: number, questionId: number): Promise<void> {
    await this.prisma.reviewQuestionRelation.delete({
      where: {
        reviewId_questionId: {
          reviewId,
          questionId,
        },
      },
    });
  }
}
