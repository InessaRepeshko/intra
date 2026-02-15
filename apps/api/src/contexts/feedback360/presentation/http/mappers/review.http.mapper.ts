import { ReviewDomain } from '../../../domain/review.domain';
import { ReviewResponse } from '../models/review.response';

export class ReviewHttpMapper {
    static toResponse(domain: ReviewDomain): ReviewResponse {
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
}
