import { feedback360_stage } from '@prisma/client';
import { Feedback360 as DomainFeedback360 } from '../../../domain/model/feedback360';
import { Feedback360Response } from './feedback360.response';

export class Feedback360ResponseMapper {
  static toResponse(domain: DomainFeedback360): Feedback360Response {
    const p = domain.toPrimitives();
    return Object.assign(new Feedback360Response(), {
      id: p.id,
      rateeId: p.rateeId,
      rateeNote: p.rateeNote,
      positionId: p.positionId,
      hrId: p.hrId,
      hrNote: p.hrNote,
      cycleId: p.cycleId,
      stage: p.stage as unknown as feedback360_stage,
      reportId: p.reportId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    });
  }
}


