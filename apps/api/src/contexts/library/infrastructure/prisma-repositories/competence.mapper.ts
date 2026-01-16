import {
  Competence,
  CompetenceCluster,
  CompetenceQuestionAnswerType as PrismaCompetenceQuestionAnswerType,
  CompetenceQuestionStatus as PrismaCompetenceQuestionStatus,
  Question,
  QuestionPositionRelation,
} from '@intra/database';
import { CompetenceDomain } from '../../domain/competence.domain';
import { CompetenceClusterDomain } from '../../domain/competence-cluster.domain';
import { CompetenceQuestionDomain } from '../../domain/competence-question.domain';
import { CompetenceQuestionAnswerType } from '../../domain/competence-question-answer-type.enum';
import { CompetenceQuestionStatus } from '../../domain/competence-question-status.enum';
import { CompetenceQuestionPositionDomain } from '../../domain/competence-question-position.domain';

type QuestionWithPositions = Question & { questionPositions?: { positionId: number }[] };

export class CompetenceMapper {
  static toCompetenceDomain(competence: Competence): CompetenceDomain {
    return CompetenceDomain.create({
      id: competence.id,
      code: competence.code,
      title: competence.title,
      description: competence.description,
      createdAt: competence.createdAt,
      updatedAt: competence.updatedAt,
    });
  }

  static toClusterDomain(cluster: CompetenceCluster): CompetenceClusterDomain {
    return CompetenceClusterDomain.create({
      id: cluster.id,
      competenceId: cluster.competenceId,
      cycleId: cluster.cycleId,
      lowerBound: cluster.lowerBound,
      upperBound: cluster.upperBound,
      minScore: cluster.minScore,
      maxScore: cluster.maxScore,
      averageScore: cluster.averageScore,
      employeesCount: cluster.employeesCount,
      createdAt: cluster.createdAt,
      updatedAt: cluster.updatedAt,
    });
  }

  static toQuestionDomain(question: QuestionWithPositions): CompetenceQuestionDomain {
    return CompetenceQuestionDomain.create({
      id: question.id,
      title: question.title,
      answerType: question.answerType as CompetenceQuestionAnswerType,
      competenceId: question.competenceId,
      isForSelfassessment: question.isForSelfassessment ?? false,
      questionStatus: question.questionStatus as CompetenceQuestionStatus,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      positionIds: question.questionPositions?.map((q) => q.positionId) ?? [],
    });
  }

  static toQuestionPositionDomain(relation: QuestionPositionRelation): CompetenceQuestionPositionDomain {
    return CompetenceQuestionPositionDomain.create({
      id: relation.id,
      questionId: relation.questionId,
      positionId: relation.positionId,
      createdAt: relation.createdAt,
    });
  }

  static toPrismaAnswerType(answerType: CompetenceQuestionAnswerType): PrismaCompetenceQuestionAnswerType {
    return answerType as PrismaCompetenceQuestionAnswerType;
  }

  static toPrismaStatus(status: CompetenceQuestionStatus): PrismaCompetenceQuestionStatus {
    return status as PrismaCompetenceQuestionStatus;
  }
}

