import { PositionQuestionTemplateRelation as PrismaPositionQuestionTemplateRelation } from '@intra/database';
import { PositionQuestionTemplateRelationDomain } from 'src/contexts/library/domain/position-question-template-relation.domain';
import { PositionQuestionTemplateRelationMapper } from 'src/contexts/library/infrastructure/mappers/position-question-template-relation.mapper';

describe('PositionQuestionTemplateRelationMapper', () => {
    const prismaRow = {
        id: 1,
        questionTemplateId: 50,
        positionId: 11,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaPositionQuestionTemplateRelation;

    describe('toDomain', () => {
        it('converts a prisma row into a PositionQuestionTemplateRelationDomain', () => {
            const domain =
                PositionQuestionTemplateRelationMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(
                PositionQuestionTemplateRelationDomain,
            );
            expect(domain.id).toBe(1);
            expect(domain.questionTemplateId).toBe(50);
            expect(domain.positionId).toBe(11);
            expect(domain.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });
    });
});
