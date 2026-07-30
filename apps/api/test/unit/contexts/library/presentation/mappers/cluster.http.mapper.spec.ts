import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';
import { ClusterHttpMapper } from 'src/contexts/library/presentation/http/mappers/cluster.http.mapper';

describe('ClusterHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = ClusterDomain.create({
                id: 1,
                competenceId: 7,
                lowerBound: 0,
                upperBound: 5,
                title: 'Top performer',
                description: 'Above 4.5',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            const response = ClusterHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.competenceId).toBe(7);
            expect(response.lowerBound).toBe(0);
            expect(response.upperBound).toBe(5);
            expect(response.title).toBe('Top performer');
            expect(response.description).toBe('Above 4.5');
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(response.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });
    });
});
