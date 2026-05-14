import { Review as PrismaReview } from '@intra/database';
import { ReviewStage } from '@intra/shared-kernel';
import { ReviewDomain } from 'src/contexts/feedback360/domain/review.domain';
import { ReviewMapper } from 'src/contexts/feedback360/infrastructure/mappers/review.mapper';

describe('ReviewMapper', () => {
    const prismaReview = {
        id: 1,
        rateeId: 10,
        rateeFullName: 'Jane Doe',
        rateePositionId: 3,
        rateePositionTitle: 'Engineer',
        hrId: 2,
        hrFullName: 'HR Manager',
        hrNote: 'note',
        teamId: 4,
        teamTitle: 'Team A',
        managerId: 5,
        managerFullName: 'Manager Name',
        managerPositionId: 6,
        managerPositionTitle: 'Engineering Lead',
        cycleId: 50,
        stage: 'IN_PROGRESS' as PrismaReview['stage'],
        reportId: 99,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-01T01:00:00.000Z'),
    } as PrismaReview;

    describe('toDomain', () => {
        it('converts a prisma row into a ReviewDomain instance', () => {
            const domain = ReviewMapper.toDomain(prismaReview);

            expect(domain).toBeInstanceOf(ReviewDomain);
            expect(domain.id).toBe(1);
            expect(domain.rateeFullName).toBe('Jane Doe');
            expect(domain.stage).toBe(ReviewStage.IN_PROGRESS);
            expect(domain.cycleId).toBe(50);
            expect(domain.reportId).toBe(99);
        });
    });

    describe('toPrisma', () => {
        it('serialises a ReviewDomain into a Prisma create input', () => {
            const domain = ReviewDomain.create({
                rateeId: 10,
                rateeFullName: 'Jane Doe',
                rateePositionId: 3,
                rateePositionTitle: 'Engineer',
                hrId: 2,
                hrFullName: 'HR Manager',
                stage: ReviewStage.SELF_ASSESSMENT,
            });

            const prisma = ReviewMapper.toPrisma(domain);

            expect(prisma.rateeId).toBe(10);
            expect(prisma.rateeFullName).toBe('Jane Doe');
            expect(prisma.hrId).toBe(2);
            expect(prisma.stage).toBe('SELF_ASSESSMENT');
            expect(prisma.cycleId).toBeNull();
            expect(prisma.reportId).toBeNull();
        });
    });

    describe('stage conversions', () => {
        it('uppercases the stage when going to Prisma', () => {
            expect(ReviewMapper.toPrismaStage(ReviewStage.IN_PROGRESS)).toBe(
                'IN_PROGRESS',
            );
        });

        it('uppercases the stage when coming from Prisma', () => {
            expect(
                ReviewMapper.fromPrismaStage(
                    'ANALYSIS' as PrismaReview['stage'],
                ),
            ).toBe(ReviewStage.ANALYSIS);
        });
    });
});
