import { CycleDomain } from '../../../domain/cycle.domain';
import { CycleResponse } from '../models/cycle.response';

export class CycleHttpMapper {
    static toResponse(domain: CycleDomain): CycleResponse {
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
}
