import { ClusterDomain } from '../../../domain/cluster.domain';
import { ClusterResponse } from '../models/cluster.response';

export class ClusterHttpMapper {
  static toResponse(domain: ClusterDomain): ClusterResponse {
    const view = new ClusterResponse();
    view.id = domain.id!;
    view.competenceId = domain.competenceId;
    view.lowerBound = domain.lowerBound;
    view.upperBound = domain.upperBound;
    view.title = domain.title;
    view.description = domain.description;
    view.createdAt = domain.createdAt!;
    view.updatedAt = domain.updatedAt!;
    return view;
  }
}

