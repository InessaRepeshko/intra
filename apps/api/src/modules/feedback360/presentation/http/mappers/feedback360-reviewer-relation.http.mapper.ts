import { Feedback360ReviewerRelationDomain } from '../../../domain/feedback-reviewer-relation/feedback360-reviewer-relation.domain';
import { Feedback360ReviewerRelation } from '../models/feedback360-reviewer-relation.entity';

export class Feedback360ReviewerRelationHttpMapper {
  static fromDomain(domain: Feedback360ReviewerRelationDomain): Feedback360ReviewerRelation {
    const entity = new Feedback360ReviewerRelation();
    Object.assign(entity, {
      id: domain.id,
      feedback360Id: domain.feedback360Id,
      userId: domain.userId,
      createdAt: domain.createdAt,
    });
    return entity;
  }
}


