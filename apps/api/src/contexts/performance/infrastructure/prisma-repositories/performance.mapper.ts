import {
  Feedback360,
  Feedback360Cycle,
  Feedback360Question,
  Feedback360QuestionRelation,
  Feedback360Answer,
  Feedback360RespondentRelation,
  Feedback360ReviewerRelation,
  Feedback360ClusterScore,
  CycleStage as PrismaCycleStage,
  Feedback360Stage as PrismaFeedback360Stage,
  Feedback360Status as PrismaFeedback360Status,
  RespondentCategory as PrismaRespondentCategory,
  AnswerType as PrismaAnswerType,
} from '@intra/database';
import { Feedback360CycleDomain } from '../../domain/feedback360-cycle.domain';
import { CycleStage } from '../../domain/enum/cycle-stage.enum';
import { Feedback360Domain } from '../../domain/feedback360.domain';
import { Feedback360Stage } from '../../domain/enum/feedback360-stage.enum';
import { Feedback360QuestionDomain } from '../../domain/feedback360-question.domain';
import { AnswerType } from 'src/contexts/library/domain/enums/answer-type.enum';
import { Feedback360QuestionRelationDomain } from '../../domain/feedback360-question-relation.domain';
import { Feedback360AnswerDomain } from '../../domain/feedback360-answer.domain';
import { RespondentCategory } from '../../domain/enum/respondent-category.enum';
import { Feedback360RespondentRelationDomain } from '../../domain/feedback360-respondent-relation.domain';
import { Feedback360Status } from '../../domain/enum/feedback360-status.enum';
import { Feedback360ReviewerRelationDomain } from '../../domain/feedback360-reviewer-relation.domain';
import { Feedback360ClusterScoreDomain } from '../../domain/feedback360-cluster-score.domain';

export class PerformanceMapper {
  static toCycleDomain(cycle: Feedback360Cycle): Feedback360CycleDomain {
    return Feedback360CycleDomain.create({
      id: cycle.id,
      title: cycle.title,
      description: cycle.description,
      hrId: cycle.hrId,
      stage: cycle.stage as CycleStage,
      isActive: cycle.isActive ?? true,
      startDate: cycle.startDate,
      reviewDeadline: cycle.reviewDeadline,
      approvalDeadline: cycle.approvalDeadline,
      surveyDeadline: cycle.surveyDeadline,
      endDate: cycle.endDate,
      createdAt: cycle.createdAt,
      updatedAt: cycle.updatedAt,
    });
  }

  static toFeedbackDomain(feedback: Feedback360): Feedback360Domain {
    return Feedback360Domain.create({
      id: feedback.id,
      rateeId: feedback.rateeId,
      rateeNote: feedback.rateeNote,
      positionId: feedback.positionId,
      hrId: feedback.hrId,
      hrNote: feedback.hrNote,
      cycleId: feedback.cycleId,
      stage: feedback.stage as Feedback360Stage,
      createdAt: feedback.createdAt,
      updatedAt: feedback.updatedAt,
    });
  }

  static toQuestionDomain(question: Feedback360Question): Feedback360QuestionDomain {
    return Feedback360QuestionDomain.create({
      id: question.id,
      cycleId: question.cycleId,
      questionId: question.questionId,
      title: question.title,
      answerType: question.answerType as AnswerType,
      competenceId: question.competenceId,
      positionId: question.positionId,
      isForSelfassessment: question.isForSelfassessment ?? false,
      createdAt: question.createdAt,
    });
  }

  static toQuestionRelationDomain(relation: Feedback360QuestionRelation): Feedback360QuestionRelationDomain {
    return Feedback360QuestionRelationDomain.create({
      id: relation.id,
      feedback360Id: relation.feedback360Id,
      questionId: relation.questionId,
      questionTitle: relation.questionTitle,
      answerType: relation.answerType as AnswerType,
      competenceId: relation.competenceId,
      isForSelfassessment: relation.isForSelfassessment ?? false,
      createdAt: relation.createdAt,
    });
  }

  static toAnswerDomain(answer: Feedback360Answer): Feedback360AnswerDomain {
    return Feedback360AnswerDomain.create({
      id: answer.id,
      feedback360Id: answer.feedback360Id,
      questionId: answer.questionId,
      feedback360QuestionId: answer.feedback360QuestionId,
      respondentCategory: answer.respondentCategory as RespondentCategory,
      answerType: answer.answerType as AnswerType,
      numericalValue: answer.numericalValue,
      textValue: answer.textValue,
      createdAt: answer.createdAt,
    });
  }

  static toRespondentDomain(relation: Feedback360RespondentRelation): Feedback360RespondentRelationDomain {
    return Feedback360RespondentRelationDomain.create({
      id: relation.id,
      feedback360Id: relation.feedback360Id,
      respondentId: relation.respondentId,
      respondentCategory: relation.respondentCategory as RespondentCategory,
      feedback360Status: relation.feedback360Status as Feedback360Status,
      respondentNote: relation.respondentNote,
      invitedAt: relation.invitedAt,
      respondedAt: relation.respondedAt,
      createdAt: relation.createdAt,
      updatedAt: relation.updatedAt,
    });
  }

  static toReviewerDomain(relation: Feedback360ReviewerRelation): Feedback360ReviewerRelationDomain {
    return Feedback360ReviewerRelationDomain.create({
      id: relation.id,
      feedback360Id: relation.feedback360Id,
      userId: relation.userId,
      createdAt: relation.createdAt,
    });
  }

  static toClusterScoreDomain(score: Feedback360ClusterScore): Feedback360ClusterScoreDomain {
    return Feedback360ClusterScoreDomain.create({
      id: score.id,
      cycleId: score.cycleId,
      clusterId: score.clusterId,
      userId: score.userId,
      feedback360Id: score.feedback360Id,
      score: score.score,
      createdAt: score.createdAt,
      updatedAt: score.updatedAt,
    });
  }

  static toPrismaCycleStage(stage: CycleStage): PrismaCycleStage {
    return stage as PrismaCycleStage;
  }

  static toPrismaFeedbackStage(stage: Feedback360Stage): PrismaFeedback360Stage {
    return stage as PrismaFeedback360Stage;
  }

  static toPrismaStatus(status: Feedback360Status): PrismaFeedback360Status {
    return status as PrismaFeedback360Status;
  }

  static toPrismaRespondentCategory(category: RespondentCategory): PrismaRespondentCategory {
    return category as PrismaRespondentCategory;
  }

  static toPrismaAnswerType(type: AnswerType): PrismaAnswerType {
    return type as PrismaAnswerType;
  }
}
