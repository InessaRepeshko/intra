import { PositionCompetenceRelation as PrismaPositionCompetenceRelation } from '@intra/database';
import { PositionCompetenceRelationDomain } from 'src/contexts/library/domain/position-competence-relation.domain';
import { PositionCompetenceRelationMapper } from 'src/contexts/library/infrastructure/mappers/position-competence-relation.mapper';

describe('PositionCompetenceRelationMapper', () => {
    const prismaRow = {
        id: 1,
        positionId: 11,
        competenceId: 7,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaPositionCompetenceRelation;

    describe('toDomain', () => {
        it('converts a prisma row into a PositionCompetenceRelationDomain', () => {
            const domain =
                PositionCompetenceRelationMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(PositionCompetenceRelationDomain);
            expect(domain.id).toBe(1);
            expect(domain.positionId).toBe(11);
            expect(domain.competenceId).toBe(7);
            expect(domain.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });
    });
});
