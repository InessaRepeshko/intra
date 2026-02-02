import { ReviewStageHistoryDomain } from '../../domain/review-stage-history.domain';

export const REVIEW_STAGE_HISTORY_REPOSITORY = Symbol(
    'FEEDBACK360.REVIEW_STAGE_HISTORY_REPOSITORY',
);

export interface ReviewStageHistoryRepositoryPort {
    create(
        history: ReviewStageHistoryDomain,
    ): Promise<ReviewStageHistoryDomain>;
    findByReviewId(reviewId: number): Promise<ReviewStageHistoryDomain[]>;
    findById(id: number): Promise<ReviewStageHistoryDomain | null>;
}
