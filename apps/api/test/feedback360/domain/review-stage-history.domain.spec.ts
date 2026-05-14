import { ReviewStage } from '@intra/shared-kernel';
import { ReviewStageHistoryDomain } from 'src/contexts/feedback360/domain/review-stage-history.domain';

describe('ReviewStageHistoryDomain', () => {
    const baseProps = {
        reviewId: 1,
        fromStage: ReviewStage.NEW,
        toStage: ReviewStage.SELF_ASSESSMENT,
    };

    describe('create', () => {
        it('creates a history record with all supplied properties', () => {
            const history = ReviewStageHistoryDomain.create({
                id: 11,
                ...baseProps,
                changedById: 8,
                changedByName: 'HR Manager',
                reason: 'Review updated',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(history.id).toBe(11);
            expect(history.reviewId).toBe(1);
            expect(history.fromStage).toBe(ReviewStage.NEW);
            expect(history.toStage).toBe(ReviewStage.SELF_ASSESSMENT);
            expect(history.changedById).toBe(8);
            expect(history.changedByName).toBe('HR Manager');
            expect(history.reason).toBe('Review updated');
            expect(history.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('normalises missing actor/reason fields to null', () => {
            const history = ReviewStageHistoryDomain.create(baseProps);
            expect(history.changedById).toBeNull();
            expect(history.changedByName).toBeNull();
            expect(history.reason).toBeNull();
        });
    });
});
