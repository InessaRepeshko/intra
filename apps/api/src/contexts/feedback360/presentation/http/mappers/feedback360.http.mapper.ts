import { CycleDomain } from '../../../domain/cycle.domain';
import { ReviewDomain } from '../../../domain/review.domain';
import { QuestionDomain } from '../../../domain/question.domain';
import { ReviewQuestionRelationDomain } from '../../../domain/review-question-relation.domain';
import { AnswerDomain } from '../../../domain/answer.domain';
import { RespondentDomain } from '../../../domain/respondent.domain';
import { ReviewerDomain } from '../../../domain/reviewer.domain';
import { ClusterScoreDomain } from '../../../domain/cluster-score.domain';
import { CycleResponse } from '../models/cycle.response';
import { ReviewResponse } from '../models/review.response';
import { QuestionResponse } from '../models/question.response';
import { ReviewQuestionRelationResponse } from '../models/review-question-relation.response';
import { AnswerResponse } from '../models/answer.response';
import { RespondentResponse } from '../models/respondent.response';
import { ReviewerResponse } from '../models/reviewer.response';
import { ClusterScoreResponse } from '../models/cluster-score.response';

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
    view.createdAt = domain.createdAt;
    view.updatedAt = domain.updatedAt;
    return view;
  }

  static toReviewResponse(domain: ReviewDomain): ReviewResponse {
    const view = new ReviewResponse();
    view.id = domain.id!;
    view.rateeId = domain.rateeId;
    view.rateeNote = domain.rateeNote ?? null;
    view.positionId = domain.positionId;
    view.hrId = domain.hrId;
    view.hrNote = domain.hrNote ?? null;
    view.cycleId = domain.cycleId ?? null;
    view.stage = domain.stage;
    view.createdAt = domain.createdAt;
    view.updatedAt = domain.updatedAt;
    return view;
  }

  static toQuestionResponse(domain: QuestionDomain): QuestionResponse {
    const view = new QuestionResponse();
    view.id = domain.id!;
    view.cycleId = domain.cycleId ?? null;
    view.libraryQuestionId = domain.libraryQuestionId ?? null;
    view.title = domain.title;
    view.answerType = domain.answerType;
    view.competenceId = domain.competenceId ?? null;
    view.positionId = domain.positionId ?? null;
    view.isForSelfassessment = domain.isForSelfassessment;
    view.createdAt = domain.createdAt;
    return view;
  }

  static toReviewQuestionRelationResponse(domain: ReviewQuestionRelationDomain): ReviewQuestionRelationResponse {
    const view = new ReviewQuestionRelationResponse();
    view.id = domain.id!;
    view.reviewId = domain.reviewId;
    view.libraryQuestionId = domain.libraryQuestionId;
    view.questionTitle = domain.questionTitle;
    view.answerType = domain.answerType;
    view.competenceId = domain.competenceId;
    view.isForSelfassessment = domain.isForSelfassessment;
    view.createdAt = domain.createdAt;
    return view;
  }

  static toAnswerResponse(domain: AnswerDomain): AnswerResponse {
    const view = new AnswerResponse();
    view.id = domain.id!;
    view.reviewId = domain.reviewId;
    view.libraryQuestionId = domain.libraryQuestionId;
    view.reviewQuestionId = domain.reviewQuestionId ?? null;
    view.respondentCategory = domain.respondentCategory;
    view.answerType = domain.answerType;
    view.numericalValue = domain.numericalValue ?? null;
    view.textValue = domain.textValue ?? null;
    view.createdAt = domain.createdAt;
    return view;
  }

  static toRespondentResponse(domain: RespondentDomain): RespondentResponse {
    const view = new RespondentResponse();
    view.id = domain.id!;
    view.reviewId = domain.reviewId;
    view.respondentId = domain.respondentId;
    view.respondentCategory = domain.respondentCategory;
    view.responseStatus = domain.responseStatus;
    view.respondentNote = domain.respondentNote ?? null;
    view.invitedAt = domain.invitedAt ?? null;
    view.respondedAt = domain.respondedAt ?? null;
    view.createdAt = domain.createdAt;
    view.updatedAt = domain.updatedAt;
    return view;
  }

  static toReviewerResponse(domain: ReviewerDomain): ReviewerResponse {
    const view = new ReviewerResponse();
    view.id = domain.id!;
    view.reviewId = domain.reviewId;
    view.userId = domain.userId;
    view.createdAt = domain.createdAt;
    return view;
  }

  static toClusterScoreResponse(domain: ClusterScoreDomain): ClusterScoreResponse {
    const view = new ClusterScoreResponse();
    view.id = domain.id!;
    view.cycleId = domain.cycleId ?? null;
    view.clusterId = domain.clusterId;
    view.userId = domain.userId;
    view.reviewId = domain.reviewId ?? null;
    view.score = domain.score;
    view.createdAt = domain.createdAt;
    view.updatedAt = domain.updatedAt;
    return view;
  }
}
