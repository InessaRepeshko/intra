import { PositionHierarchyDomain } from 'src/contexts/organisation/domain/position-hierarchy.domain';

describe('PositionHierarchyDomain', () => {
    describe('create', () => {
        it('creates a hierarchy relation with every supplied field', () => {
            const relation = PositionHierarchyDomain.create({
                id: 1,
                superiorPositionId: 7,
                subordinatePositionId: 8,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(relation.id).toBe(1);
            expect(relation.superiorPositionId).toBe(7);
            expect(relation.subordinatePositionId).toBe(8);
            expect(relation.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('omits id and createdAt when not provided', () => {
            const relation = PositionHierarchyDomain.create({
                superiorPositionId: 7,
                subordinatePositionId: 8,
            });

            expect(relation.id).toBeUndefined();
            expect(relation.createdAt).toBeUndefined();
        });
    });
});
