import { Feedback360RespondentRelationDomain } from '../../domain/feedback-respondent-relation/feedback360-respondent-relation.domain';
import { Feedback360Status } from '../../domain/enums/feedback360-status.enum';
import { RespondentCategory } from '../../domain/enums/respondent-category.enum';

export const FEEDBACK360_RESPONDENT_RELATION_REPOSITORY = Symbol(
  'FEEDBACK360.FEEDBACK360_RESPONDENT_RELATION_REPOSITORY',
);

export type Feedback360RespondentRelationSearchQuery = {
  skip?: number;
  take?: number;
  feedback360Id?: number;
  respondentId?: number;
  respondentCategory?: RespondentCategory;
  feedback360Status?: Feedback360Status;
  search?: string; // respondentNote contains
};

export type Feedback360RespondentRelationSearchResult = {
  items: Feedback360RespondentRelationDomain[];
  count: number;
  total: number;
};

export interface Feedback360RespondentRelationRepositoryPort {
  create(entity: Feedback360RespondentRelationDomain): Promise<Feedback360RespondentRelationDomain>;
  search(query?: Feedback360RespondentRelationSearchQuery): Promise<Feedback360RespondentRelationSearchResult>;
  findById(id: number): Promise<Feedback360RespondentRelationDomain | null>;
  updateById(
    id: number,
    patch: Partial<Feedback360RespondentRelationDomain>,
  ): Promise<Feedback360RespondentRelationDomain>;
  deleteById(id: number): Promise<void>;
}


