import { CompetenceQuestionTemplateRelationDomain } from 'src/contexts/library/domain/competence-question-template-relation.domain';

describe('CompetenceQuestionTemplateRelationDomain', () => {
    describe('create', () => {
        it('creates a relation with every supplied field', () => {
            const relation = CompetenceQuestionTemplateRelationDomain.create({
                id: 1,
                competenceId: 7,
                questionTemplateId: 50,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            expect(relation.id).toBe(1);
            expect(relation.competenceId).toBe(7);
            expect(relation.questionTemplateId).toBe(50);
            expect(relation.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });

        it('omits id and createdAt when not provided', () => {
            const relation = CompetenceQuestionTemplateRelationDomain.create({
                competenceId: 7,
                questionTemplateId: 50,
            });

            expect(relation.id).toBeUndefined();
            expect(relation.createdAt).toBeUndefined();
        });
    });
});
