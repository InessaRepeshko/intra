import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDENTITY_READ } from './external-ports/identity-read.port';
import type { IdentityReadPort } from './external-ports/identity-read.port';
import { FEEDBACK360_REPOSITORY } from './repository-ports/feedback360.repository.port';
import type { Feedback360RepositoryPort } from './repository-ports/feedback360.repository.port';
import { FEEDBACK360_REVIEWER_RELATION_REPOSITORY } from './repository-ports/feedback360-reviewer-relation.repository.port';
import type {
  Feedback360ReviewerRelationRepositoryPort,
  Feedback360ReviewerRelationSearchQuery,
  Feedback360ReviewerRelationSearchResult,
} from './repository-ports/feedback360-reviewer-relation.repository.port';
import { Feedback360ReviewerRelationDomain } from '../domain/feedback-reviewer-relation/feedback360-reviewer-relation.domain';

export type CreateFeedback360ReviewerRelationInput = {
  feedback360Id: number;
  userId: number;
};

@Injectable()
export class Feedback360ReviewerRelationsService {
  constructor(
    @Inject(FEEDBACK360_REVIEWER_RELATION_REPOSITORY)
    private readonly relRepo: Feedback360ReviewerRelationRepositoryPort,
    @Inject(FEEDBACK360_REPOSITORY) private readonly feedbackRepo: Feedback360RepositoryPort,
    @Inject(IDENTITY_READ) private readonly identity: IdentityReadPort,
  ) {}

  async create(input: CreateFeedback360ReviewerRelationInput): Promise<Feedback360ReviewerRelationDomain> {
    await this.ensureFeedbackExists(input.feedback360Id);
    await this.ensureUserExists(input.userId);

    const rel = new Feedback360ReviewerRelationDomain({
      feedback360Id: input.feedback360Id,
      userId: input.userId,
    });
    return this.relRepo.create(rel);
  }

  async search(query?: Feedback360ReviewerRelationSearchQuery): Promise<Feedback360ReviewerRelationSearchResult> {
    return this.relRepo.search(query);
  }

  async findOne(id: number): Promise<Feedback360ReviewerRelationDomain> {
    const found = await this.relRepo.findById(id);
    if (!found) throw new NotFoundException('Feedback360ReviewerRelation not found');
    return found;
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


