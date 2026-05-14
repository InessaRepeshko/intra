import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionHttpMapper } from 'src/contexts/organisation/presentation/http/mappers/position.http.mapper';

describe('PositionHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = PositionDomain.create({
                id: 1,
                title: 'Engineer',
                description: 'desc',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            const response = PositionHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.title).toBe('Engineer');
            expect(response.description).toBe('desc');
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(response.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('passes null description through to the response', () => {
            const domain = PositionDomain.create({ id: 1, title: 'Engineer' });
            const response = PositionHttpMapper.toResponse(domain);
            expect(response.description).toBeNull();
        });
    });
});
