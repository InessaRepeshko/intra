import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetenceHttpMapper } from 'src/contexts/library/presentation/http/mappers/competence.http.mapper';

describe('CompetenceHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = CompetenceDomain.create({
                id: 1,
                code: 'TWK',
                title: 'Teamwork',
                description: 'Working with peers',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            const response = CompetenceHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.code).toBe('TWK');
            expect(response.title).toBe('Teamwork');
            expect(response.description).toBe('Working with peers');
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(response.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('passes null code/description through to the response', () => {
            const domain = CompetenceDomain.create({
                id: 1,
                title: 'Teamwork',
            });

            const response = CompetenceHttpMapper.toResponse(domain);

            expect(response.code).toBeNull();
            expect(response.description).toBeNull();
        });
    });
});
