import { PositionHierarchy as PrismaPositionHierarchy } from '@intra/database';
import { PositionHierarchyDomain } from 'src/contexts/organisation/domain/position-hierarchy.domain';
import { PositionHierarchyMapper } from 'src/contexts/organisation/infrastructure/mappers/position-hierarchy.mapper';

describe('PositionHierarchyMapper', () => {
    const prismaRow = {
        id: 1,
        superiorPositionId: 7,
        subordinatePositionId: 8,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaPositionHierarchy;

    describe('toDomain', () => {
        it('converts a prisma row into a PositionHierarchyDomain', () => {
            const domain = PositionHierarchyMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(PositionHierarchyDomain);
            expect(domain.id).toBe(1);
            expect(domain.superiorPositionId).toBe(7);
            expect(domain.subordinatePositionId).toBe(8);
            expect(domain.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });
    });
});
