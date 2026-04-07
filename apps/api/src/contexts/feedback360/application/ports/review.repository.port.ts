import { ReviewSearchQuery, UpdateReviewPayload } from '@intra/shared-kernel';
import { ReviewDomain } from '../../domain/review.domain';

export const REVIEW_REPOSITORY = Symbol('FEEDBACK360.REVIEW_REPOSITORY');

export interface ReviewRepositoryPort {
    create(review: ReviewDomain): Promise<ReviewDomain>;
    findById(id: number): Promise<ReviewDomain | null>;
    search(query: ReviewSearchQuery): Promise<ReviewDomain[]>;
    updateById(id: number, patch: UpdateReviewPayload): Promise<ReviewDomain>;
    deleteById(id: number): Promise<void>;
    listByCycleId(cycleId: number): Promise<ReviewDomain[]>;
}
