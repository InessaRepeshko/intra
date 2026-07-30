import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';

describe('CompetenceDomain', () => {
    const baseProps = {
        title: 'Teamwork',
    };

    describe('create', () => {
        it('creates a competence with every supplied property', () => {
            const competence = CompetenceDomain.create({
                id: 1,
                code: 'TWK',
                title: 'Teamwork',
                description: 'Working with peers',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            expect(competence.id).toBe(1);
            expect(competence.code).toBe('TWK');
            expect(competence.title).toBe('Teamwork');
            expect(competence.description).toBe('Working with peers');
            expect(competence.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(competence.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('normalises missing code and description to null', () => {
            const competence = CompetenceDomain.create(baseProps);

            expect(competence.code).toBeNull();
            expect(competence.description).toBeNull();
        });

        it('preserves explicit null code and description', () => {
            const competence = CompetenceDomain.create({
                ...baseProps,
                code: null,
                description: null,
            });

            expect(competence.code).toBeNull();
            expect(competence.description).toBeNull();
        });
    });
});
