import { ClusterDomain } from '../../../domain/cluster.domain';
import { ClusterResponse } from '../models/cluster.response';

export class ClusterHttpMapper {
  static toResponse(domain: ClusterDomain): ClusterResponse {
    const view = new ClusterResponse();
    view.id = domain.id!;
    view.competenceId = domain.competenceId;
    view.cycleId = domain.cycleId;
    view.lowerBound = domain.lowerBound;
    view.upperBound = domain.upperBound;
    view.minScore = domain.minScore;
    view.maxScore = domain.maxScore;
    view.averageScore = domain.averageScore;
    view.employeesCount = domain.employeesCount;
    view.createdAt = domain.createdAt;
    view.updatedAt = domain.updatedAt;
    return view;
  }
}

