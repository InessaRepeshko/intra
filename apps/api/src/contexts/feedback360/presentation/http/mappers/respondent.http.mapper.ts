import { RespondentDomain } from '../../../domain/respondent.domain';
import { RespondentResponse } from '../models/respondent.response';

export class RespondentHttpMapper {
    static toResponse(domain: RespondentDomain): RespondentResponse {
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
}
