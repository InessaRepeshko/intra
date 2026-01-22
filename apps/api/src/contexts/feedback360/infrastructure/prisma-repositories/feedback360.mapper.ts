import {
  Review as PrismaReview,
  Cycle as PrismaCycle,
  ReviewQuestion as PrismaReviewQuestion,
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
      rateeNote: review.rateeNote,
      positionId: review.positionId,
      hrId: review.hrId,
      hrNote: review.hrNote,
      cycleId: review.cycleId,
      stage: review.stage as ReviewStage,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    });
  }

  static toQuestionDomain(question: PrismaReviewQuestion): QuestionDomain {
    return QuestionDomain.create({
      id: question.id,
      cycleId: question.cycleId,
      libraryQuestionId: question.libraryQuestionId,
      title: question.title,
      answerType: question.answerType as AnswerType,
      competenceId: question.competenceId,
      positionId: question.positionId,
      isForSelfassessment: question.isForSelfassessment ?? false,
      createdAt: question.createdAt,
    });
  }

  static toQuestionRelationDomain(relation: PrismaReviewQuestionRelation): ReviewQuestionRelationDomain {
    return ReviewQuestionRelationDomain.create({
      id: relation.id,
      reviewId: relation.reviewId,
      libraryQuestionId: relation.libraryQuestionId,
      questionTitle: relation.questionTitle,
      answerType: relation.answerType as AnswerType,
      competenceId: relation.competenceId,
      isForSelfassessment: relation.isForSelfassessment ?? false,
      createdAt: relation.createdAt,
    });
  }

  static toAnswerDomain(answer: PrismaAnswer): AnswerDomain {
    return AnswerDomain.create({
      id: answer.id,
      reviewId: answer.reviewId,
      libraryQuestionId: answer.libraryQuestionId,
      reviewQuestionId: answer.reviewQuestionId,
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
      respondentCategory: relation.respondentCategory as RespondentCategory,
      responseStatus: relation.responseStatus as ResponseStatus,
      respondentNote: relation.respondentNote,
      invitedAt: relation.invitedAt,
      respondedAt: relation.respondedAt,
      createdAt: relation.createdAt,
      updatedAt: relation.updatedAt,
    });
  }

  static toReviewerDomain(relation: PrismaReviewer): ReviewerDomain {
    return ReviewerDomain.create({
      id: relation.id,
      reviewId: relation.reviewId,
      userId: relation.userId,
      createdAt: relation.createdAt,
    });
  }

  static toClusterScoreDomain(score: PrismaClusterScore): ClusterScoreDomain {
    return ClusterScoreDomain.create({
      id: score.id,
      cycleId: score.cycleId,
      clusterId: score.clusterId,
      userId: score.userId,
      reviewId: score.reviewId,
      score: score.score,
      createdAt: score.createdAt,
      updatedAt: score.updatedAt,
    });
  }

  static toPrismaCycleStage(stage: CycleStage): PrismaCycleStage {
    return stage as PrismaCycleStage;
  }

  static toPrismaReviewStage(stage: ReviewStage): PrismaReviewStage {
    return stage as PrismaReviewStage;
  }

  static toPrismaResponseStatus(status: ResponseStatus): PrismaResponseStatus {
    return status as PrismaResponseStatus;
  }

  static toPrismaRespondentCategory(category: RespondentCategory): PrismaRespondentCategory {
    return category as PrismaRespondentCategory;
  }

  static toPrismaAnswerType(type: AnswerType): PrismaAnswerType {
    return type as PrismaAnswerType;
  }
}
