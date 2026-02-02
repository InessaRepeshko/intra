import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REVIEW_STAGE_HISTORY_REPOSITORY,
    ReviewStageHistoryRepositoryPort,
} from '../../application/ports/review-stage-history.repository.port';
import { ReviewStageHistoryDomain } from '../../domain/review-stage-history.domain';
import { Feedback360Mapper } from './feedback360.mapper';

@Injectable()
export class ReviewStageHistoryRepository
    implements ReviewStageHistoryRepositoryPort {
    readonly [REVIEW_STAGE_HISTORY_REPOSITORY] =
        REVIEW_STAGE_HISTORY_REPOSITORY;

    constructor(private readonly prisma: PrismaService) { }

    async create(
        history: ReviewStageHistoryDomain,
    ): Promise<ReviewStageHistoryDomain> {
        const created = await this.prisma.reviewStageHistory.create({
            data: {
                reviewId: history.reviewId,
                fromStage: Feedback360Mapper.toPrismaReviewStage(
                    history.fromStage,
                ),
                toStage: Feedback360Mapper.toPrismaReviewStage(history.toStage),
                changedById: history.changedById,
                changedByName: history.changedByName,
                reason: history.reason,
            },
        });
        return Feedback360Mapper.toReviewStageHistoryDomain(created);
    }

    async findByReviewId(
        reviewId: number,
    ): Promise<ReviewStageHistoryDomain[]> {
        const items = await this.prisma.reviewStageHistory.findMany({
            where: { reviewId },
            orderBy: { createdAt: 'asc' },
        });
        return items.map(Feedback360Mapper.toReviewStageHistoryDomain);
    }

    async findById(id: number): Promise<ReviewStageHistoryDomain | null> {
        const item = await this.prisma.reviewStageHistory.findUnique({
            where: { id },
        });
        return item ? Feedback360Mapper.toReviewStageHistoryDomain(item) : null;
    }
}
