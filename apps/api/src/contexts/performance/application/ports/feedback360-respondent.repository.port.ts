import { Feedback360RespondentRelationDomain } from '../../domain/feedback360-respondent-relation.domain';
import { Feedback360Status } from '../../domain/enum/feedback360-status.enum';
import { RespondentCategory } from '../../domain/enum/respondent-category.enum';

export const FEEDBACK360_RESPONDENT_REPOSITORY = Symbol('PERFORMANCE.FEEDBACK360_RESPONDENT_REPOSITORY');

export type Feedback360RespondentSearchQuery = {
  feedback360Id?: number;
  respondentId?: number;
  category?: RespondentCategory;
  status?: Feedback360Status;
};

export type Feedback360RespondentUpdatePayload = Partial<{
  feedback360Status: Feedback360Status;
  respondentNote: string | null;
  invitedAt: Date | null;
  respondedAt: Date | null;
}>;

export interface Feedback360RespondentRepositoryPort {
  create(relation: Feedback360RespondentRelationDomain): Promise<Feedback360RespondentRelationDomain>;
  list(query: Feedback360RespondentSearchQuery): Promise<Feedback360RespondentRelationDomain[]>;
  updateById(id: number, patch: Feedback360RespondentUpdatePayload): Promise<Feedback360RespondentRelationDomain>;
  deleteById(id: number): Promise<void>;
}
