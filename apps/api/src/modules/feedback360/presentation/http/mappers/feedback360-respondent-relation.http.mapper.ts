import { Feedback360RespondentRelationDomain } from '../../../domain/feedback-respondent-relation/feedback360-respondent-relation.domain';
import { Feedback360RespondentRelation } from '../models/feedback360-respondent-relation.entity';

export class Feedback360RespondentRelationHttpMapper {
  static fromDomain(domain: Feedback360RespondentRelationDomain): Feedback360RespondentRelation {
    const entity = new Feedback360RespondentRelation();
    Object.assign(entity, {
      id: domain.id,
      feedback360Id: domain.feedback360Id,
      respondentId: domain.respondentId,
      respondentCategory: domain.respondentCategory,
      feedback360Status: domain.feedback360Status,
      respondentNote: domain.respondentNote,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
    return entity;
  }
}


