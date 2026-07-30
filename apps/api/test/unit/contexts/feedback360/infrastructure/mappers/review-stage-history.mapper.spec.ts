import { ReviewStageHistory as PrismaReviewStageHistory } from '@intra/database';
import { ReviewStage } from '@intra/shared-kernel';
import { ReviewStageHistoryDomain } from 'src/contexts/feedback360/domain/review-stage-history.domain';
import { ReviewStageHistoryMapper } from 'src/contexts/feedback360/infrastructure/mappers/review-stage-history.mapper';

describe('ReviewStageHistoryMapper', () => {
    const prismaHistory = {
        id: 13,
        reviewId: 50,
        fromStage: 'NEW' as PrismaReviewStageHistory['fromStage'],
        toStage: 'SELF_ASSESSMENT' as PrismaReviewStageHistory['toStage'],
        changedById: 8,
        changedByName: 'HR Manager',
        reason: 'Review updated',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaReviewStageHistory;

    describe('toDomain', () => {
        it('converts a prisma row into a ReviewStageHistoryDomain', () => {
            const domain = ReviewStageHistoryMapper.toDomain(prismaHistory);

            expect(domain).toBeInstanceOf(ReviewStageHistoryDomain);
            expect(domain.id).toBe(13);
            expect(domain.reviewId).toBe(50);
            expect(domain.fromStage).toBe(ReviewStage.NEW);
            expect(domain.toStage).toBe(ReviewStage.SELF_ASSESSMENT);
            expect(domain.changedById).toBe(8);
            expect(domain.changedByName).toBe('HR Manager');
            expect(domain.reason).toBe('Review updated');
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain into a Prisma create input', () => {
            const domain = ReviewStageHistoryDomain.create({
                reviewId: 50,
                fromStage: ReviewStage.IN_PROGRESS,
                toStage: ReviewStage.FINISHED,
                reason: 'All responses collected from respondents',
            });

            const prisma = ReviewStageHistoryMapper.toPrisma(domain);

            expect(prisma.reviewId).toBe(50);
            expect(prisma.fromStage).toBe('IN_PROGRESS');
            expect(prisma.toStage).toBe('FINISHED');
            expect(prisma.reason).toBe(
                'All responses collected from respondents',
            );
            expect(prisma.changedById).toBeNull();
            expect(prisma.changedByName).toBeNull();
        });
    });
});
