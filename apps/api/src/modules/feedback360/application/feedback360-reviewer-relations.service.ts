import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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

export type UpdateFeedback360ReviewerRelationInput = {
  feedback360Id?: number;
  userId?: number;
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
    try {
      return await this.relRepo.create(rel);
    } catch (e: any) {
      // Prisma unique constraint (feedback360Id+userId): @@unique([feedback360Id, userId])
      if (e?.code === 'P2002') throw new ConflictException('Reviewer relation already exists');
      throw e;
    }
  }

  async search(query?: Feedback360ReviewerRelationSearchQuery): Promise<Feedback360ReviewerRelationSearchResult> {
    return this.relRepo.search(query);
  }

  async findOne(id: number): Promise<Feedback360ReviewerRelationDomain> {
    const found = await this.relRepo.findById(id);
    if (!found) throw new NotFoundException('Feedback360ReviewerRelation not found');
    return found;
  }

  async update(id: number, patch: UpdateFeedback360ReviewerRelationInput): Promise<Feedback360ReviewerRelationDomain> {
    const existing = await this.findOne(id);

    if (patch.feedback360Id !== undefined && patch.feedback360Id !== existing.feedback360Id) {
      await this.ensureFeedbackExists(patch.feedback360Id);
    }
    if (patch.userId !== undefined && patch.userId !== existing.userId) {
      await this.ensureUserExists(patch.userId);
    }

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


