import { ReviewerDomain } from 'src/contexts/feedback360/domain/reviewer.domain';
import { ReviewerHttpMapper } from 'src/contexts/feedback360/presentation/http/mappers/reviewer.http.mapper';

describe('ReviewerHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = ReviewerDomain.create({
                id: 1,
                reviewId: 10,
                reviewerId: 20,
                fullName: 'Reviewer One',
                positionId: 3,
                positionTitle: 'Senior Engineer',
                teamId: 4,
                teamTitle: 'Team B',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response = ReviewerHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.reviewId).toBe(10);
            expect(response.reviewerId).toBe(20);
            expect(response.fullName).toBe('Reviewer One');
            expect(response.positionId).toBe(3);
            expect(response.positionTitle).toBe('Senior Engineer');
            expect(response.teamId).toBe(4);
            expect(response.teamTitle).toBe('Team B');
        });

        it('returns null for missing team fields', () => {
            const domain = ReviewerDomain.create({
                reviewId: 1,
                reviewerId: 2,
                fullName: 'Reviewer',
                positionId: 1,
                positionTitle: 'Eng',
            });

            const response = ReviewerHttpMapper.toResponse(domain);
            expect(response.teamId).toBeNull();
            expect(response.teamTitle).toBeNull();
        });
    });
});
