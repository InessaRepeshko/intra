import { ReviewQuestionRelationDomain } from '../../../domain/review-question-relation.domain';
import { ReviewQuestionRelationResponse } from '../models/review-question-relation.response';

export class ReviewQuestionRelationHttpMapper {
    static toResponse(
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
}
