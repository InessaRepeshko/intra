import { Feedback360CycleDomain } from '../../../domain/cycle/feedback360-cycle.domain';
import { Feedback360Cycle } from '../models/feedback360-cycle.entity';

export class Feedback360CycleHttpMapper {
  static fromDomain(domain: Feedback360CycleDomain): Feedback360Cycle {
    const entity = new Feedback360Cycle();
    Object.assign(entity, {
      id: domain.id,
      title: domain.title,
      description: domain.description,
      hrId: domain.hrId,
      stage: domain.stage,
      isActive: domain.isActive,
      startDate: domain.startDate,
      reviewDeadline: domain.reviewDeadline,
      approvalDeadline: domain.approvalDeadline,
      surveyDeadline: domain.surveyDeadline,
      endDate: domain.endDate,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
    return entity;
  }
}


