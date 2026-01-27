import { CompetenceDomain } from '../../../domain/competence.domain';
import { CompetenceResponse } from '../models/competence.response';

export class CompetenceHttpMapper {
    static toResponse(domain: CompetenceDomain): CompetenceResponse {
        const view = new CompetenceResponse();
        view.id = domain.id!;
        view.code = domain.code;
        view.title = domain.title;
        view.description = domain.description;
        view.createdAt = domain.createdAt!;
        view.updatedAt = domain.updatedAt!;
        return view;
    }
}
