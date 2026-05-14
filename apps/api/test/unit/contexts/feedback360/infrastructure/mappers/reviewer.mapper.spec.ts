import { Reviewer as PrismaReviewer } from '@intra/database';
import { ReviewerDomain } from 'src/contexts/feedback360/domain/reviewer.domain';
import { ReviewerMapper } from 'src/contexts/feedback360/infrastructure/mappers/reviewer.mapper';

describe('ReviewerMapper', () => {
    const prismaReviewer = {
        id: 1,
        reviewId: 10,
        reviewerId: 20,
        fullName: 'Reviewer One',
        positionId: 3,
        positionTitle: 'Senior Engineer',
        teamId: 4,
        teamTitle: 'Team B',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaReviewer;

    describe('toDomain', () => {
        it('converts a prisma row into a ReviewerDomain instance', () => {
            const domain = ReviewerMapper.toDomain(prismaReviewer);

            expect(domain).toBeInstanceOf(ReviewerDomain);
            expect(domain.id).toBe(1);
            expect(domain.reviewId).toBe(10);
            expect(domain.reviewerId).toBe(20);
            expect(domain.fullName).toBe('Reviewer One');
            expect(domain.positionId).toBe(3);
            expect(domain.positionTitle).toBe('Senior Engineer');
            expect(domain.teamId).toBe(4);
            expect(domain.teamTitle).toBe('Team B');
            expect(domain.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });
    });

    describe('toPrisma', () => {
        it('serialises a ReviewerDomain into a Prisma create input', () => {
            const domain = ReviewerDomain.create({
                reviewId: 10,
                reviewerId: 20,
                fullName: 'Reviewer One',
                positionId: 3,
                positionTitle: 'Senior Engineer',
                teamId: null,
                teamTitle: null,
            });

            const prisma = ReviewerMapper.toPrisma(domain);

            expect(prisma).toEqual({
                reviewId: 10,
                reviewerId: 20,
                fullName: 'Reviewer One',
                positionId: 3,
                positionTitle: 'Senior Engineer',
                teamId: null,
                teamTitle: null,
            });
        });
    });
});
