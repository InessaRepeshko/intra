import {
    Prisma,
    ReviewStageHistory as PrismaReviewStageHistory,
} from '@intra/database';
import { ReviewStageHistoryDomain } from '../../domain/review-stage-history.domain';
import { ReviewMapper } from './review.mapper';

export class ReviewStageHistoryMapper {
    static toDomain(
        history: PrismaReviewStageHistory,
    ): ReviewStageHistoryDomain {
        return ReviewStageHistoryDomain.create({
            id: history.id,
            reviewId: history.reviewId,
            fromStage: ReviewMapper.fromPrismaStage(history.fromStage),
            toStage: ReviewMapper.fromPrismaStage(history.toStage),
            changedById: history.changedById,
            changedByName: history.changedByName,
            reason: history.reason,
            createdAt: history.createdAt,
        });
    }

    static toPrisma(
        history: ReviewStageHistoryDomain,
    ): Prisma.ReviewStageHistoryUncheckedCreateInput {
        return {
            reviewId: history.reviewId,
            fromStage: ReviewMapper.toPrismaStage(history.fromStage),
            toStage: ReviewMapper.toPrismaStage(history.toStage),
            changedById: history.changedById,
            changedByName: history.changedByName,
            reason: history.reason,
        };
    }
}
