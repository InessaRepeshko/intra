import { Feedback360CycleDomain } from '../../../domain/feedback360-cycle.domain';
import { Feedback360Domain } from '../../../domain/feedback360.domain';
import { Feedback360QuestionDomain } from '../../../domain/feedback360-question.domain';
import { Feedback360QuestionRelationDomain } from '../../../domain/feedback360-question-relation.domain';
import { Feedback360AnswerDomain } from '../../../domain/feedback360-answer.domain';
import { Feedback360RespondentRelationDomain } from '../../../domain/feedback360-respondent-relation.domain';
import { Feedback360ReviewerRelationDomain } from '../../../domain/feedback360-reviewer-relation.domain';
import { Feedback360ClusterScoreDomain } from '../../../domain/feedback360-cluster-score.domain';
import { CycleResponse } from '../models/cycle.response';
import { FeedbackResponse } from '../models/feedback.response';
import { FeedbackQuestionResponse } from '../models/feedback-question.response';
import { FeedbackQuestionRelationResponse } from '../models/feedback-question-relation.response';
import { FeedbackAnswerResponse } from '../models/feedback-answer.response';
import { FeedbackRespondentResponse } from '../models/feedback-respondent.response';
import { FeedbackReviewerResponse } from '../models/feedback-reviewer.response';
import { ClusterScoreResponse } from '../models/cluster-score.response';

export class PerformanceHttpMapper {
  static toCycleResponse(domain: Feedback360CycleDomain): CycleResponse {
    const view = new CycleResponse();
    view.id = domain.id!;
    view.title = domain.title;
    view.description = domain.description ?? null;
    view.hrId = domain.hrId;
    view.stage = domain.stage;
    view.isActive = domain.isActive;
    view.startDate = domain.startDate;
    view.reviewDeadline = domain.reviewDeadline ?? null;
    view.approvalDeadline = domain.approvalDeadline ?? null;
    view.surveyDeadline = domain.surveyDeadline ?? null;
    view.endDate = domain.endDate;
    view.createdAt = domain.createdAt;
    view.updatedAt = domain.updatedAt;
    return view;
  }

  static toFeedbackResponse(domain: Feedback360Domain): FeedbackResponse {
    const view = new FeedbackResponse();
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

  static toFeedbackQuestionResponse(domain: Feedback360QuestionDomain): FeedbackQuestionResponse {
    const view = new FeedbackQuestionResponse();
    view.id = domain.id!;
    view.cycleId = domain.cycleId ?? null;
    view.questionId = domain.questionId ?? null;
    view.title = domain.title;
    view.answerType = domain.answerType;
    view.competenceId = domain.competenceId ?? null;
    view.positionId = domain.positionId ?? null;
    view.isForSelfassessment = domain.isForSelfassessment;
    view.createdAt = domain.createdAt;
    return view;
  }

  static toQuestionRelationResponse(domain: Feedback360QuestionRelationDomain): FeedbackQuestionRelationResponse {
    const view = new FeedbackQuestionRelationResponse();
    view.id = domain.id!;
    view.feedback360Id = domain.feedback360Id;
    view.questionId = domain.questionId;
    view.questionTitle = domain.questionTitle;
    view.answerType = domain.answerType;
    view.competenceId = domain.competenceId;
    view.isForSelfassessment = domain.isForSelfassessment;
    view.createdAt = domain.createdAt;
    return view;
  }

  static toAnswerResponse(domain: Feedback360AnswerDomain): FeedbackAnswerResponse {
    const view = new FeedbackAnswerResponse();
    view.id = domain.id!;
    view.feedback360Id = domain.feedback360Id;
    view.questionId = domain.questionId;
    view.feedback360QuestionId = domain.feedback360QuestionId ?? null;
    view.respondentCategory = domain.respondentCategory;
    view.answerType = domain.answerType;
    view.numericalValue = domain.numericalValue ?? null;
    view.textValue = domain.textValue ?? null;
    view.createdAt = domain.createdAt;
    return view;
  }

  static toRespondentResponse(domain: Feedback360RespondentRelationDomain): FeedbackRespondentResponse {
    const view = new FeedbackRespondentResponse();
    view.id = domain.id!;
    view.feedback360Id = domain.feedback360Id;
    view.respondentId = domain.respondentId;
    view.respondentCategory = domain.respondentCategory;
    view.feedback360Status = domain.feedback360Status;
    view.respondentNote = domain.respondentNote ?? null;
    view.invitedAt = domain.invitedAt ?? null;
    view.respondedAt = domain.respondedAt ?? null;
    view.createdAt = domain.createdAt;
    view.updatedAt = domain.updatedAt;
    return view;
  }

  static toReviewerResponse(domain: Feedback360ReviewerRelationDomain): FeedbackReviewerResponse {
    const view = new FeedbackReviewerResponse();
    view.id = domain.id!;
    view.feedback360Id = domain.feedback360Id;
    view.userId = domain.userId;
    view.createdAt = domain.createdAt;
    return view;
  }

  static toClusterScoreResponse(domain: Feedback360ClusterScoreDomain): ClusterScoreResponse {
    const view = new ClusterScoreResponse();
    view.id = domain.id!;
    view.cycleId = domain.cycleId ?? null;
    view.clusterId = domain.clusterId;
    view.userId = domain.userId;
    view.feedback360Id = domain.feedback360Id ?? null;
    view.score = domain.score;
    view.createdAt = domain.createdAt;
    view.updatedAt = domain.updatedAt;
    return view;
  }
}
