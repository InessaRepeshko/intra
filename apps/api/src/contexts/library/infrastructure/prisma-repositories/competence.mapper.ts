import {
  Competence,
  Cluster,
  AnswerType as PrismaAnswerType,
  QuestionStatus as PrismaQuestionStatus,
  LibraryQuestion as PrismaLibraryQuestion,
  LibraryQuestionPosition as PrismaLibraryQuestionPosition,
} from '@intra/database';
import { CompetenceDomain } from '../../domain/competence.domain';
import { ClusterDomain } from '../../domain/cluster.domain';
import { QuestionDomain } from '../../domain/question.domain';
import { AnswerType } from '../../domain/enums/answer-type.enum';
import { QuestionStatus } from '../../domain/enums/question-status.enum';
import { QuestionPositionDomain } from '../../domain/question-position.domain';

type QuestionWithPositions = PrismaLibraryQuestion & { libraryQuestionPositions?: { positionId: number }[] };

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

  static toClusterDomain(cluster: Cluster): ClusterDomain {
    return ClusterDomain.create({
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

  static toQuestionDomain(question: QuestionWithPositions): QuestionDomain {
    return QuestionDomain.create({
      id: question.id,
      title: question.title,
      answerType: question.answerType as AnswerType,
      competenceId: question.competenceId,
      isForSelfassessment: question.isForSelfassessment ?? false,
      questionStatus: question.questionStatus as QuestionStatus,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      positionIds: question.libraryQuestionPositions?.map((q) => q.positionId) ?? [],
    });
  }

  static toQuestionPositionDomain(relation: PrismaLibraryQuestionPosition): QuestionPositionDomain {
    return QuestionPositionDomain.create({
      id: relation.id,
      questionId: relation.questionId,
      positionId: relation.positionId,
      createdAt: relation.createdAt,
    });
  }

  static toPrismaAnswerType(answerType: AnswerType): PrismaAnswerType {
    return answerType as PrismaAnswerType;
  }

  static toPrismaStatus(status: QuestionStatus): PrismaQuestionStatus {
    return status as PrismaQuestionStatus;
  }
}

