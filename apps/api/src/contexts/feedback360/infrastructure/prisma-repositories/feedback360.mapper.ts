import {
    Answer as PrismaAnswer,
    AnswerType as PrismaAnswerType,
    ClusterScore as PrismaClusterScore,
    ClusterScoreAnalytics as PrismaClusterScoreAnalytics,
    Cycle as PrismaCycle,
    CycleStage as PrismaCycleStage,
    Question as PrismaQuestion,
    Respondent as PrismaRespondent,
    RespondentCategory as PrismaRespondentCategory,
    ResponseStatus as PrismaResponseStatus,
    Review as PrismaReview,
    Reviewer as PrismaReviewer,
    ReviewQuestionRelation as PrismaReviewQuestionRelation,
    ReviewStage as PrismaReviewStage,
} from '@intra/database';
import {
    AnswerType,
    CycleStage,
    RespondentCategory,
    ResponseStatus,
    ReviewStage,
} from '@intra/shared-kernel';
import { AnswerDomain } from '../../domain/answer.domain';
import { ClusterScoreAnalyticsDomain } from '../../domain/cluster-score-analytics.domain';
import { ClusterScoreDomain } from '../../domain/cluster-score.domain';
import { CycleDomain } from '../../domain/cycle.domain';
import { QuestionDomain } from '../../domain/question.domain';
import { RespondentDomain } from '../../domain/respondent.domain';
import { ReviewQuestionRelationDomain } from '../../domain/review-question-relation.domain';
import { ReviewDomain } from '../../domain/review.domain';
import { ReviewerDomain } from '../../domain/reviewer.domain';

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
            rateeFullName: review.rateeFullName,
            rateePositionId: review.rateePositionId,
            rateePositionTitle: review.rateePositionTitle,
            hrId: review.hrId,
            hrFullName: review.hrFullName,
            hrNote: review.hrNote,
            teamId: review.teamId,
            teamTitle: review.teamTitle,
            managerId: review.managerId,
            managerFullName: review.managerFullName,
            managerPositionId: review.managerPositionId,
            managerPositionTitle: review.managerPositionTitle,
            cycleId: review.cycleId,
            stage: review.stage as ReviewStage,
            reportId: review.reportId,
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

    static toQuestionRelationDomain(
        relation: PrismaReviewQuestionRelation,
    ): ReviewQuestionRelationDomain {
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
            fullName: relation.fullName,
            category: relation.category as RespondentCategory,
            responseStatus: relation.responseStatus as ResponseStatus,
            respondentNote: relation.respondentNote,
            hrNote: relation.hrNote,
            positionId: relation.positionId,
            positionTitle: relation.positionTitle,
            teamId: relation.teamId,
            teamTitle: relation.teamTitle,
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
            fullName: relation.fullName,
            positionId: relation.positionId,
            positionTitle: relation.positionTitle,
            teamId: relation.teamId,
            teamTitle: relation.teamTitle,
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
            answersCount: score.answersCount,
            createdAt: score.createdAt,
            updatedAt: score.updatedAt,
        });
    }

    static toClusterScoreAnalyticsDomain(
        analytics: PrismaClusterScoreAnalytics,
    ): ClusterScoreAnalyticsDomain {
        return ClusterScoreAnalyticsDomain.create({
            id: analytics.id,
            cycleId: analytics.cycleId,
            clusterId: analytics.clusterId,
            employeesCount: analytics.employeesCount,
            minScore: analytics.minScore,
            maxScore: analytics.maxScore,
            averageScore: analytics.averageScore,
            createdAt: analytics.createdAt,
            updatedAt: analytics.updatedAt,
        });
    }

    static toPrismaCycleStage(domainStage: CycleStage): PrismaCycleStage {
        return domainStage.toString() as PrismaCycleStage;
    }

    static toPrismaReviewStage(domainStage: ReviewStage): PrismaReviewStage {
        return domainStage.toString() as PrismaReviewStage;
    }

    static toPrismaResponseStatus(
        domainStatus: ResponseStatus,
    ): PrismaResponseStatus {
        return domainStatus.toString() as PrismaResponseStatus;
    }

    static toPrismaRespondentCategory(
        domainCategory: RespondentCategory,
    ): PrismaRespondentCategory {
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

    static fromPrismaResponseStatus(
        prismaStatus: PrismaResponseStatus,
    ): ResponseStatus {
        return prismaStatus.toString() as ResponseStatus;
    }

    static fromPrismaRespondentCategory(
        prismaCategory: PrismaRespondentCategory,
    ): RespondentCategory {
        return prismaCategory.toString() as RespondentCategory;
    }

    static fromPrismaAnswerType(prismaType: PrismaAnswerType): AnswerType {
        return prismaType.toString() as AnswerType;
    }
}
