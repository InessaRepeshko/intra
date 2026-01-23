import {
  Review as PrismaReview,
  Cycle as PrismaCycle,
  Question as PrismaQuestion,
  ReviewQuestionRelation as PrismaReviewQuestionRelation,
  Answer as PrismaAnswer,
  Respondent as PrismaRespondent,
  Reviewer as PrismaReviewer,
  ClusterScore as PrismaClusterScore,
  CycleStage as PrismaCycleStage,
  ReviewStage as PrismaReviewStage,
  ResponseStatus as PrismaResponseStatus,
  RespondentCategory as PrismaRespondentCategory,
  AnswerType as PrismaAnswerType,
} from '@intra/database';
import { CycleDomain } from '../../domain/cycle.domain';
import { CycleStage } from '@intra/shared-kernel';
import { ReviewDomain } from '../../domain/review.domain';
import { ReviewStage } from '@intra/shared-kernel';
import { QuestionDomain } from '../../domain/question.domain';
import { AnswerType } from '@intra/shared-kernel';
import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';
import { AnswerDomain } from '../../domain/answer.domain';
import { RespondentCategory } from '@intra/shared-kernel';
import { RespondentDomain } from '../../domain/respondent.domain';
import { ResponseStatus } from '@intra/shared-kernel';
import { ReviewerDomain } from '../../domain/reviewer.domain';
import { ClusterScoreDomain } from '../../domain/cluster-score.domain';

export class Feedback360Mapper {
  static toCycleDomain(cycle: PrismaCycle): CycleDomain {
    return CycleDomain.create({
      id: cycle.id,
      title: cycle.title,
      description: cycle.description,
      hrId: cycle.hrId,
      minRespondentsThreshold: cycle.minRespondentsThreshold,
      stage: cycle.stage as CycleStage,
      isActive: cycle.isActive ?? true,
      startDate: cycle.startDate,
      reviewDeadline: cycle.reviewDeadline,
      approvalDeadline: cycle.approvalDeadline,
      responseDeadline: cycle.responseDeadline,
      endDate: cycle.endDate,
      createdAt: cycle.createdAt,
      updatedAt: cycle.updatedAt,
    });
  }

  static toReviewDomain(review: PrismaReview): ReviewDomain {
    return ReviewDomain.create({
      id: review.id,
      rateeId: review.rateeId,
      rateePositionId: review.rateePositionId,
      rateePositionTitle: review.rateePositionTitle,
      hrId: review.hrId,
      hrNote: review.hrNote,
      teamId: review.teamId,
      teamTitle: review.teamTitle,
      managerId: review.managerId,
      cycleId: review.cycleId,
      stage: review.stage as ReviewStage,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    });
  }

  static toQuestionDomain(question: PrismaQuestion): QuestionDomain {
    return QuestionDomain.create({
      id: question.id,
      cycleId: question.cycleId,
      questionTemplateId: question.questionTemplateId,
      title: question.title,
      answerType: question.answerType as AnswerType,
      competenceId: question.competenceId,
      isForSelfassessment: question.isForSelfassessment ?? false,
      createdAt: question.createdAt,
    });
  }

  static toQuestionRelationDomain(relation: PrismaReviewQuestionRelation): ReviewQuestionRelationDomain {
    return ReviewQuestionRelationDomain.create({
      id: relation.id,
      reviewId: relation.reviewId,
      questionId: relation.questionId,
      questionTitle: relation.questionTitle,
      answerType: relation.answerType as AnswerType,
      competenceId: relation.competenceId,
      competenceTitle: relation.competenceTitle,
      isForSelfassessment: relation.isForSelfassessment ?? false,
      createdAt: relation.createdAt,
    });
  }

  static toAnswerDomain(answer: PrismaAnswer): AnswerDomain {
    return AnswerDomain.create({
      id: answer.id,
      reviewId: answer.reviewId,
      questionId: answer.questionId,
      respondentCategory: answer.respondentCategory as RespondentCategory,
      answerType: answer.answerType as AnswerType,
      numericalValue: answer.numericalValue,
      textValue: answer.textValue,
    });
  }

  static toRespondentDomain(relation: PrismaRespondent): RespondentDomain {
    return RespondentDomain.create({
      id: relation.id,
      reviewId: relation.reviewId,
      respondentId: relation.respondentId,
      category: relation.category as RespondentCategory,
      responseStatus: relation.responseStatus as ResponseStatus,
      respondentNote: relation.respondentNote,
      hrNote: relation.hrNote,
      positionId: relation.positionId,
      positionTitle: relation.positionTitle,
      invitedAt: relation.invitedAt,
      canceledAt: relation.canceledAt,
      respondedAt: relation.respondedAt,
      createdAt: relation.createdAt,
      updatedAt: relation.updatedAt,
    });
  }

  static toReviewerDomain(relation: PrismaReviewer): ReviewerDomain {
    return ReviewerDomain.create({
      id: relation.id,
      reviewId: relation.reviewId,
      reviewerId: relation.reviewerId,
      positionId: relation.positionId,
      positionTitle: relation.positionTitle,
      createdAt: relation.createdAt,
    });
  }

  static toClusterScoreDomain(score: PrismaClusterScore): ClusterScoreDomain {
    return ClusterScoreDomain.create({
      id: score.id,
      cycleId: score.cycleId,
      clusterId: score.clusterId,
      rateeId: score.rateeId,
      reviewId: score.reviewId,
      score: score.score,
      createdAt: score.createdAt,
      updatedAt: score.updatedAt,
    });
  }

  static toPrismaCycleStage(domainStage: CycleStage): PrismaCycleStage {
    return domainStage.toString() as PrismaCycleStage;
  }

  static toPrismaReviewStage(domainStage: ReviewStage): PrismaReviewStage {
    return domainStage.toString() as PrismaReviewStage;
  }

  static toPrismaResponseStatus(domainStatus: ResponseStatus): PrismaResponseStatus {
    return domainStatus.toString() as PrismaResponseStatus;
  }

  static toPrismaRespondentCategory(domainCategory: RespondentCategory): PrismaRespondentCategory {
    return domainCategory.toString() as PrismaRespondentCategory;
  }

  static toPrismaAnswerType(domainType: AnswerType): PrismaAnswerType {
    return domainType.toString() as PrismaAnswerType;
  }

  static fromPrismaCycleStage(prismaStage: PrismaCycleStage): CycleStage {
    return prismaStage.toString() as CycleStage;
  }

  static fromPrismaReviewStage(prismaStage: PrismaReviewStage): ReviewStage {
    return prismaStage.toString() as ReviewStage;
  }

  static fromPrismaResponseStatus(prismaStatus: PrismaResponseStatus): ResponseStatus {
    return prismaStatus.toString() as ResponseStatus;
  }

  static fromPrismaRespondentCategory(prismaCategory: PrismaRespondentCategory): RespondentCategory {
    return prismaCategory.toString() as RespondentCategory;
  }

  static fromPrismaAnswerType(prismaType: PrismaAnswerType): AnswerType {
    return prismaType.toString() as AnswerType;
  }
}
