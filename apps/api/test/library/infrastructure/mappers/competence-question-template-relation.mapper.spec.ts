import { CompetenceQuestionTemplateRelation as PrismaCompetenceQuestionTemplateRelation } from '@intra/database';
import { CompetenceQuestionTemplateRelationDomain } from 'src/contexts/library/domain/competence-question-template-relation.domain';
import { CompetenceQuestionTemplateRelationMapper } from 'src/contexts/library/infrastructure/mappers/competence-question-template-relation.mapper';

describe('CompetenceQuestionTemplateRelationMapper', () => {
    const prismaRow = {
        id: 1,
        competenceId: 7,
        questionTemplateId: 50,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaCompetenceQuestionTemplateRelation;

    describe('toDomain', () => {
        it('converts a prisma row into a CompetenceQuestionTemplateRelationDomain', () => {
            const domain =
                CompetenceQuestionTemplateRelationMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(
                CompetenceQuestionTemplateRelationDomain,
            );
            expect(domain.id).toBe(1);
            expect(domain.competenceId).toBe(7);
            expect(domain.questionTemplateId).toBe(50);
            expect(domain.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });
    });
});
