import { Feedback360Domain } from '../../../domain/feedback/feedback360.domain';
import { Feedback360 } from '../models/feedback360.entity';

export class Feedback360HttpMapper {
  static fromDomain(domain: Feedback360Domain): Feedback360 {
    const entity = new Feedback360();
    Object.assign(entity, {
      id: domain.id,
      rateeId: domain.rateeId,
      rateeNote: domain.rateeNote,
      positionId: domain.positionId,
      hrId: domain.hrId,
      hrNote: domain.hrNote,
      cycleId: domain.cycleId,
      stage: domain.stage,
      reportId: domain.reportId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
    return entity;
  }
}


