import { ReviewerDomain } from '../../../domain/reviewer.domain';
import { ReviewerResponse } from '../models/reviewer.response';

export class ReviewerHttpMapper {
    static toResponse(domain: ReviewerDomain): ReviewerResponse {
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
}
