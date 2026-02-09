import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
    REVIEW_STAGE_HISTORY_REPOSITORY,
    ReviewStageHistoryRepositoryPort,
} from '../../application/ports/review-stage-history.repository.port';
import { ReviewStageHistoryDomain } from '../../domain/review-stage-history.domain';
import { ReviewStageHistoryMapper } from '../mappers/review-stage-history.mapper';

@Injectable()
export class ReviewStageHistoryRepository implements ReviewStageHistoryRepositoryPort {
    readonly [REVIEW_STAGE_HISTORY_REPOSITORY] =
        REVIEW_STAGE_HISTORY_REPOSITORY;

    constructor(private readonly prisma: PrismaService) {}

    async create(
        history: ReviewStageHistoryDomain,
    ): Promise<ReviewStageHistoryDomain> {
        const created = await this.prisma.reviewStageHistory.create({
            data: ReviewStageHistoryMapper.toPrisma(history),
        });
        return ReviewStageHistoryMapper.toDomain(created);
    }

    async findByReviewId(
        reviewId: number,
    ): Promise<ReviewStageHistoryDomain[]> {
        const items = await this.prisma.reviewStageHistory.findMany({
            where: { reviewId },
            orderBy: { createdAt: 'asc' },
        });
        return items.map(ReviewStageHistoryMapper.toDomain);
    }

    async findById(id: number): Promise<ReviewStageHistoryDomain | null> {
        const item = await this.prisma.reviewStageHistory.findUnique({
            where: { id },
        });
        return item ? ReviewStageHistoryMapper.toDomain(item) : null;
    }
}
