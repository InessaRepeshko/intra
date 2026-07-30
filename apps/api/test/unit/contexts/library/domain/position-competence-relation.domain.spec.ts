import { PositionCompetenceRelationDomain } from 'src/contexts/library/domain/position-competence-relation.domain';

describe('PositionCompetenceRelationDomain', () => {
    describe('create', () => {
        it('creates a relation with every supplied field', () => {
            const relation = PositionCompetenceRelationDomain.create({
                id: 1,
                positionId: 11,
                competenceId: 7,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(relation.id).toBe(1);
            expect(relation.positionId).toBe(11);
            expect(relation.competenceId).toBe(7);
            expect(relation.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('omits id and createdAt when not provided', () => {
            const relation = PositionCompetenceRelationDomain.create({
                positionId: 11,
                competenceId: 7,
            });

            expect(relation.id).toBeUndefined();
            expect(relation.createdAt).toBeUndefined();
        });
    });
});
