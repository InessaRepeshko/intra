import { ReviewerDomain } from 'src/contexts/feedback360/domain/reviewer.domain';

describe('ReviewerDomain', () => {
    const baseProps = {
        reviewId: 10,
        reviewerId: 20,
        fullName: 'Reviewer One',
        positionId: 3,
        positionTitle: 'Senior Engineer',
    };

    describe('create', () => {
        it('creates a reviewer with all supplied properties', () => {
            const reviewer = ReviewerDomain.create({
                id: 1,
                ...baseProps,
                teamId: 4,
                teamTitle: 'Team B',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(reviewer.id).toBe(1);
            expect(reviewer.reviewId).toBe(10);
            expect(reviewer.reviewerId).toBe(20);
            expect(reviewer.fullName).toBe('Reviewer One');
            expect(reviewer.positionId).toBe(3);
            expect(reviewer.positionTitle).toBe('Senior Engineer');
            expect(reviewer.teamId).toBe(4);
            expect(reviewer.teamTitle).toBe('Team B');
            expect(reviewer.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('normalises missing team fields to null', () => {
            const reviewer = ReviewerDomain.create(baseProps);
            expect(reviewer.teamId).toBeNull();
            expect(reviewer.teamTitle).toBeNull();
        });
    });
});
