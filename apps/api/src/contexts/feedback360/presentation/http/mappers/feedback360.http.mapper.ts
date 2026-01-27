import { AnswerDomain } from '../../../domain/answer.domain';
import { ClusterScoreDomain } from '../../../domain/cluster-score.domain';
import { CycleClusterAnalyticsDomain } from '../../../domain/cycle-cluster-analytics.domain';
import { CycleDomain } from '../../../domain/cycle.domain';
import { QuestionDomain } from '../../../domain/question.domain';
import { RespondentDomain } from '../../../domain/respondent.domain';
import { ReviewQuestionRelationDomain } from '../../../domain/review-question-relation.domain';
import { ReviewDomain } from '../../../domain/review.domain';
import { ReviewerDomain } from '../../../domain/reviewer.domain';
import { AnswerResponse } from '../models/answer.response';
import { ClusterScoreResponse } from '../models/cluster-score.response';
import { CycleClusterAnalyticsResponse } from '../models/cycle-cluster-analytics.response';
import { CycleResponse } from '../models/cycle.response';
import { QuestionResponse } from '../models/question.response';
import { RespondentResponse } from '../models/respondent.response';
import { ReviewQuestionRelationResponse } from '../models/review-question-relation.response';
import { ReviewResponse } from '../models/review.response';
import { ReviewerResponse } from '../models/reviewer.response';

export class Feedback360HttpMapper {
    static toCycleResponse(domain: CycleDomain): CycleResponse {
        const view = new CycleResponse();
        view.id = domain.id!;
        view.title = domain.title;
        view.description = domain.description ?? null;
        view.hrId = domain.hrId;
        view.minRespondentsThreshold = domain.minRespondentsThreshold;
        view.stage = domain.stage;
        view.isActive = domain.isActive;
        view.startDate = domain.startDate;
        view.reviewDeadline = domain.reviewDeadline ?? null;
        view.approvalDeadline = domain.approvalDeadline ?? null;
        view.responseDeadline = domain.responseDeadline ?? null;
        view.endDate = domain.endDate;
        view.createdAt = domain.createdAt!;
        view.updatedAt = domain.updatedAt!;
        return view;
    }

    static toReviewResponse(domain: ReviewDomain): ReviewResponse {
        const view = new ReviewResponse();
        view.id = domain.id!;
        view.rateeId = domain.rateeId;
        view.rateeFullName = domain.rateeFullName;
        view.rateePositionId = domain.rateePositionId;
        view.rateePositionTitle = domain.rateePositionTitle;
        view.hrId = domain.hrId;
        view.hrFullName = domain.hrFullName;
        view.hrNote = domain.hrNote ?? null;
        view.teamId = domain.teamId ?? null;
        view.teamTitle = domain.teamTitle ?? null;
        view.managerId = domain.managerId ?? null;
        view.managerFullName = domain.managerFullName ?? null;
        view.managerPositionId = domain.managerPositionId ?? null;
        view.managerPositionTitle = domain.managerPositionTitle ?? null;
        view.cycleId = domain.cycleId ?? null;
        view.stage = domain.stage;
        view.reportId = domain.reportId ?? null;
        view.createdAt = domain.createdAt!;
        view.updatedAt = domain.updatedAt!;
        return view;
    }

    static toQuestionResponse(domain: QuestionDomain): QuestionResponse {
        const view = new QuestionResponse();
        view.id = domain.id!;
        view.cycleId = domain.cycleId ?? null;
        view.questionTemplateId = domain.questionTemplateId ?? null;
        view.title = domain.title;
        view.answerType = domain.answerType;
        view.competenceId = domain.competenceId ?? null;
        view.isForSelfassessment = domain.isForSelfassessment;
        view.createdAt = domain.createdAt!;
        return view;
    }

    static toReviewQuestionRelationResponse(
        domain: ReviewQuestionRelationDomain,
    ): ReviewQuestionRelationResponse {
        const view = new ReviewQuestionRelationResponse();
        view.id = domain.id!;
        view.reviewId = domain.reviewId;
        view.questionId = domain.questionId;
        view.questionTitle = domain.questionTitle;
        view.answerType = domain.answerType;
        view.competenceId = domain.competenceId;
        view.competenceTitle = domain.competenceTitle;
        view.isForSelfassessment = domain.isForSelfassessment;
        view.createdAt = domain.createdAt!;
        return view;
    }

    static toAnswerResponse(domain: AnswerDomain): AnswerResponse {
        const view = new AnswerResponse();
        view.id = domain.id!;
        view.reviewId = domain.reviewId;
        view.questionId = domain.questionId;
        view.respondentCategory = domain.respondentCategory;
        view.answerType = domain.answerType;
        view.numericalValue = domain.numericalValue ?? null;
        view.textValue = domain.textValue ?? null;
        view.createdAt = domain.createdAt!;
        return view;
    }

    static toRespondentResponse(domain: RespondentDomain): RespondentResponse {
        const view = new RespondentResponse();
        view.id = domain.id!;
        view.reviewId = domain.reviewId;
        view.respondentId = domain.respondentId;
        view.fullName = domain.fullName;
        view.category = domain.category;
        view.responseStatus = domain.responseStatus;
        view.respondentNote = domain.respondentNote ?? null;
        view.hrNote = domain.hrNote ?? null;
        view.positionId = domain.positionId;
        view.positionTitle = domain.positionTitle;
        view.teamId = domain.teamId ?? null;
        view.teamTitle = domain.teamTitle ?? null;
        view.invitedAt = domain.invitedAt ?? null;
        view.canceledAt = domain.canceledAt ?? null;
        view.respondedAt = domain.respondedAt ?? null;
        view.createdAt = domain.createdAt!;
        view.updatedAt = domain.updatedAt!;
        return view;
    }

    static toReviewerResponse(domain: ReviewerDomain): ReviewerResponse {
        const view = new ReviewerResponse();
        view.id = domain.id!;
        view.reviewId = domain.reviewId;
        view.reviewerId = domain.reviewerId;
        view.fullName = domain.fullName;
        view.positionId = domain.positionId;
        view.positionTitle = domain.positionTitle;
        view.teamId = domain.teamId ?? null;
        view.teamTitle = domain.teamTitle ?? null;
        view.createdAt = domain.createdAt!;
        return view;
    }

    static toClusterScoreResponse(
        domain: ClusterScoreDomain,
    ): ClusterScoreResponse {
        const view = new ClusterScoreResponse();
        view.id = domain.id!;
        view.cycleId = domain.cycleId ?? null;
        view.clusterId = domain.clusterId;
        view.rateeId = domain.rateeId;
        view.reviewId = domain.reviewId ?? null;
        view.score = domain.score;
        view.answersCount = domain.answersCount;
        view.createdAt = domain.createdAt!;
        view.updatedAt = domain.updatedAt!;
        return view;
    }

    static toCycleClusterAnalyticsResponse(
        domain: CycleClusterAnalyticsDomain,
    ): CycleClusterAnalyticsResponse {
        const view = new CycleClusterAnalyticsResponse();
        view.id = domain.id!;
        view.cycleId = domain.cycleId;
        view.clusterId = domain.clusterId;
        view.employeesCount = domain.employeesCount;
        view.minScore = domain.minScore;
        view.maxScore = domain.maxScore;
        view.averageScore = domain.averageScore;
        view.createdAt = domain.createdAt!;
        view.updatedAt = domain.updatedAt!;
        return view;
    }
}
