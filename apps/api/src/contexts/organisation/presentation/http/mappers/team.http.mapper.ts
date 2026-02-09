import { TeamDomain } from '../../../domain/team.domain';
import { TeamResponse } from '../models/team.response';

export class TeamHttpMapper {
    static toResponse(domain: TeamDomain): TeamResponse {
        const view = new TeamResponse();
        view.id = domain.id!;
        view.title = domain.title;
        view.description = domain.description;
        view.headId = domain.headId;
        view.createdAt = domain.createdAt!;
        view.updatedAt = domain.updatedAt!;
        return view;
    }
}
