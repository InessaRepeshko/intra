import { RespondentDomain } from '../../domain/respondent.domain';
import { ResponseStatus } from '../../domain/enums/response-status.enum';
import { RespondentCategory } from '../../domain/enums/respondent-category.enum';

export const RESPONDENT_REPOSITORY = Symbol('FEEDBACK360.RESPONDENT_REPOSITORY');

export type RespondentSearchQuery = {
  reviewId?: number;
  respondentId?: number;
  category?: RespondentCategory;
  status?: ResponseStatus;
};

export type RespondentUpdatePayload = Partial<{
  responseStatus: ResponseStatus;
  respondentNote: string | null;
  invitedAt: Date | null;
  respondedAt: Date | null;
}>;

export interface RespondentRepositoryPort {
  create(relation: RespondentDomain): Promise<RespondentDomain>;
  list(query: RespondentSearchQuery): Promise<RespondentDomain[]>;
  updateById(id: number, patch: RespondentUpdatePayload): Promise<RespondentDomain>;
  deleteById(id: number): Promise<void>;
}
