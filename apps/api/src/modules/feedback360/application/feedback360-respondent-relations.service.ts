import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDENTITY_READ } from './external-ports/identity-read.port';
import type { IdentityReadPort } from './external-ports/identity-read.port';
import { FEEDBACK360_REPOSITORY } from './repository-ports/feedback360.repository.port';
import type { Feedback360RepositoryPort } from './repository-ports/feedback360.repository.port';
import {
  FEEDBACK360_RESPONDENT_RELATION_REPOSITORY,
} from './repository-ports/feedback360-respondent-relation.repository.port';
import type {
  Feedback360RespondentRelationRepositoryPort,
  Feedback360RespondentRelationSearchQuery,
  Feedback360RespondentRelationSearchResult,
} from './repository-ports/feedback360-respondent-relation.repository.port';
import { Feedback360RespondentRelationDomain } from '../domain/feedback-respondent-relation/feedback360-respondent-relation.domain';
import { Feedback360Status } from '../domain/enums/feedback360-status.enum';
import { RespondentCategory } from '../domain/enums/respondent-category.enum';

export type CreateFeedback360RespondentRelationInput = {
  feedback360Id: number;
  respondentId: number;
  respondentCategory: RespondentCategory;
  feedback360Status?: Feedback360Status;
  respondentNote?: string | null;
};

export type UpdateFeedback360RespondentRelationInput = {
  respondentCategory?: RespondentCategory;
  feedback360Status?: Feedback360Status;
  respondentNote?: string | null;
};

@Injectable()
export class Feedback360RespondentRelationsService {
  constructor(
    @Inject(FEEDBACK360_RESPONDENT_RELATION_REPOSITORY)
    private readonly relRepo: Feedback360RespondentRelationRepositoryPort,
    @Inject(FEEDBACK360_REPOSITORY) private readonly feedbackRepo: Feedback360RepositoryPort,
    @Inject(IDENTITY_READ) private readonly identity: IdentityReadPort,
  ) {}

  async create(input: CreateFeedback360RespondentRelationInput): Promise<Feedback360RespondentRelationDomain> {
    await this.ensureFeedbackExists(input.feedback360Id);
    await this.ensureUserExists(input.respondentId);

    const rel = new Feedback360RespondentRelationDomain({
      feedback360Id: input.feedback360Id,
      respondentId: input.respondentId,
      respondentCategory: input.respondentCategory,
      feedback360Status: input.feedback360Status ?? Feedback360Status.PENDING,
      respondentNote: input.respondentNote ?? null,
    });

    return this.relRepo.create(rel);
  }

  async search(query?: Feedback360RespondentRelationSearchQuery): Promise<Feedback360RespondentRelationSearchResult> {
    return this.relRepo.search(query);
  }

  async findOne(id: number): Promise<Feedback360RespondentRelationDomain> {
    const found = await this.relRepo.findById(id);
    if (!found) throw new NotFoundException('Feedback360RespondentRelation not found');
    return found;
  }

  async update(id: number, patch: UpdateFeedback360RespondentRelationInput): Promise<Feedback360RespondentRelationDomain> {
    await this.findOne(id);
    return this.relRepo.updateById(id, patch);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.relRepo.deleteById(id);
  }

  private async ensureFeedbackExists(feedback360Id: number): Promise<void> {
    const found = await this.feedbackRepo.findById(feedback360Id);
    if (!found) throw new NotFoundException('Feedback360 not found');
  }

  private async ensureUserExists(userId: number): Promise<void> {
    const ok = await this.identity.userExists(userId);
    if (!ok) throw new NotFoundException('User not found');
  }
}


