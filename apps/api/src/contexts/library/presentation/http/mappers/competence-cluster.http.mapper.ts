import { CompetenceClusterDomain } from '../../../domain/competence-cluster.domain';
import { CompetenceClusterResponse } from '../models/competence-cluster.response';

export class CompetenceClusterHttpMapper {
  static toResponse(domain: CompetenceClusterDomain): CompetenceClusterResponse {
    const view = new CompetenceClusterResponse();
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

