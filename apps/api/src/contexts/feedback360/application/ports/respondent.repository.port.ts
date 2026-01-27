import { RespondentDomain } from '../../domain/respondent.domain';
import { UpdateRespondentPayload, RespondentSearchQuery } from '@intra/shared-kernel'; 

export const RESPONDENT_REPOSITORY = Symbol('FEEDBACK360.RESPONDENT_REPOSITORY');

export interface RespondentRepositoryPort {
  create(relation: RespondentDomain): Promise<RespondentDomain>;
  listByReview(reviewId: number, query: RespondentSearchQuery): Promise<RespondentDomain[]>;
  updateById(id: number, patch: UpdateRespondentPayload): Promise<RespondentDomain>;
  deleteById(id: number): Promise<void>;
}
