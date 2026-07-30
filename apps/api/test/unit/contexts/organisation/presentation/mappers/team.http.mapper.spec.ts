import { TeamDomain } from 'src/contexts/organisation/domain/team.domain';
import { TeamHttpMapper } from 'src/contexts/organisation/presentation/http/mappers/team.http.mapper';

describe('TeamHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = TeamDomain.create({
                id: 1,
                title: 'Platform',
                description: 'desc',
                headId: 7,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            const response = TeamHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.title).toBe('Platform');
            expect(response.description).toBe('desc');
            expect(response.headId).toBe(7);
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(response.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('passes null description and headId through to the response', () => {
            const domain = TeamDomain.create({ id: 1, title: 'Platform' });
            const response = TeamHttpMapper.toResponse(domain);
            expect(response.description).toBeNull();
            expect(response.headId).toBeNull();
        });
    });
});
