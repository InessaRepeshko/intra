import {
  Competence,
  Cluster,
  AnswerType as PrismaAnswerType,
  QuestionTemplateStatus as PrismaQuestionTemplateStatus,
  QuestionTemplate as PrismaQuestionTemplate,
  QuestionTemplatePositionRelation as PrismaQuestionTemplatePositionRelation,
} from '@intra/database';
import { CompetenceDomain } from '../../domain/competence.domain';
import { ClusterDomain } from '../../domain/cluster.domain';
import { QuestionTemplateDomain } from '../../domain/question-template.domain';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateStatus } from '@intra/shared-kernel';
import { QuestionTemplatePositionRelationDomain } from '../../domain/question-template-position-relation.domain';

type QuestionWithPositions = PrismaQuestionTemplate & { positionRelations?: { positionId: number }[] };

export class LibraryMapper {
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

  static toQuestionTemplateDomain(question: QuestionWithPositions): QuestionTemplateDomain {
    return QuestionTemplateDomain.create({
      id: question.id,
      title: question.title,
      answerType: question.answerType as AnswerType,
      competenceId: question.competenceId,
      isForSelfassessment: question.isForSelfassessment ?? false,
      status: question.status as QuestionTemplateStatus,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      positionIds: question.positionRelations?.map((q) => q.positionId) ?? [],
    });
  }

  static toQuestionTemplatePositionRelationDomain(relation: PrismaQuestionTemplatePositionRelation): QuestionTemplatePositionRelationDomain {
    return QuestionTemplatePositionRelationDomain.create({
      id: relation.id,
      questionTemplateId: relation.questionTemplateId,
      positionId: relation.positionId,
      createdAt: relation.createdAt,
    });
  }

  static toPrismaAnswerType(answerType: AnswerType): PrismaAnswerType {
    return answerType as PrismaAnswerType;
  }

  static toPrismaStatus(status: QuestionTemplateStatus): PrismaQuestionTemplateStatus {
    return status as PrismaQuestionTemplateStatus;
  }
}

