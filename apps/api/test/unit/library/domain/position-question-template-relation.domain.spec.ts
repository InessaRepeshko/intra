import { PositionQuestionTemplateRelationDomain } from 'src/contexts/library/domain/position-question-template-relation.domain';

describe('PositionQuestionTemplateRelationDomain', () => {
    describe('create', () => {
        it('creates a relation with every supplied field', () => {
            const relation = PositionQuestionTemplateRelationDomain.create({
                id: 1,
                questionTemplateId: 50,
                positionId: 11,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(relation.id).toBe(1);
            expect(relation.questionTemplateId).toBe(50);
            expect(relation.positionId).toBe(11);
            expect(relation.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('omits id and createdAt when not provided', () => {
            const relation = PositionQuestionTemplateRelationDomain.create({
                questionTemplateId: 50,
                positionId: 11,
            });

            expect(relation.id).toBeUndefined();
            expect(relation.createdAt).toBeUndefined();
        });
    });
});
