import {
    Cluster,
    Competence,
    AnswerType as PrismaAnswerType,
    CompetenceQuestionTemplateRelation as PrismaCompetenceQuestionTemplateRelation,
    PositionCompetenceRelation as PrismaPositionCompetenceRelation,
    PositionQuestionTemplateRelation as PrismaPositionQuestionTemplateRelation,
    QuestionTemplate as PrismaQuestionTemplate,
    QuestionTemplateStatus as PrismaQuestionTemplateStatus,
} from '@intra/database';
import { AnswerType, QuestionTemplateStatus } from '@intra/shared-kernel';
import { ClusterDomain } from '../../domain/cluster.domain';
import { CompetenceQuestionTemplateRelationDomain } from '../../domain/competence-question-template-relation.domain';
import { CompetenceDomain } from '../../domain/competence.domain';
import { PositionCompetenceRelationDomain } from '../../domain/position-competence-relation.domain';
import { PositionQuestionTemplateRelationDomain } from '../../domain/position-question-template-relation.domain';
import { QuestionTemplateDomain } from '../../domain/question-template.domain';

type QuestionWithPositions = PrismaQuestionTemplate & {
    positionRelations?: { positionId: number }[];
};

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
            lowerBound: cluster.lowerBound,
            upperBound: cluster.upperBound,
            title: cluster.title,
            description: cluster.description,
            createdAt: cluster.createdAt,
            updatedAt: cluster.updatedAt,
        });
    }

    static toQuestionTemplateDomain(
        question: QuestionWithPositions,
    ): QuestionTemplateDomain {
        return QuestionTemplateDomain.create({
            id: question.id,
            title: question.title,
            answerType: question.answerType as AnswerType,
            competenceId: question.competenceId,
            isForSelfassessment: question.isForSelfassessment ?? false,
            status: question.status as QuestionTemplateStatus,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
            positionIds:
                question.positionRelations?.map((q) => q.positionId) ?? [],
        });
    }

    static toPositionQuestionTemplateRelationDomain(
        relation: PrismaPositionQuestionTemplateRelation,
    ): PositionQuestionTemplateRelationDomain {
        return PositionQuestionTemplateRelationDomain.create({
            id: relation.id,
            questionTemplateId: relation.questionTemplateId,
            positionId: relation.positionId,
            createdAt: relation.createdAt,
        });
    }

    static toPositionCompetenceRelationDomain(
        relation: PrismaPositionCompetenceRelation,
    ): PositionCompetenceRelationDomain {
        return PositionCompetenceRelationDomain.create({
            id: relation.id,
            positionId: relation.positionId,
            competenceId: relation.competenceId,
            createdAt: relation.createdAt,
        });
    }

    static toCompetenceQuestionTemplateRelationDomain(
        relation: PrismaCompetenceQuestionTemplateRelation,
    ): CompetenceQuestionTemplateRelationDomain {
        return CompetenceQuestionTemplateRelationDomain.create({
            id: relation.id,
            competenceId: relation.competenceId,
            questionTemplateId: relation.questionTemplateId,
            createdAt: relation.createdAt,
        });
    }

    static toPrismaAnswerType(domainType: AnswerType): PrismaAnswerType {
        return domainType.toString() as PrismaAnswerType;
    }

    static toPrismaStatus(
        domainStatus: QuestionTemplateStatus,
    ): PrismaQuestionTemplateStatus {
        return domainStatus.toString() as PrismaQuestionTemplateStatus;
    }

    static fromPrismaAnswerType(prismaType: PrismaAnswerType): AnswerType {
        return prismaType.toString() as AnswerType;
    }

    static fromPrismaStatus(
        prismaStatus: PrismaQuestionTemplateStatus,
    ): QuestionTemplateStatus {
        return prismaStatus.toString() as QuestionTemplateStatus;
    }
}
