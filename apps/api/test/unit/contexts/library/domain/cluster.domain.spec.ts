import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';

describe('ClusterDomain', () => {
    const baseProps = {
        competenceId: 7,
        lowerBound: 0,
        upperBound: 5,
        title: 'Top performer',
        description: 'Above 4.5',
    };

    describe('create', () => {
        it('creates a cluster with every supplied property', () => {
            const cluster = ClusterDomain.create({
                id: 1,
                ...baseProps,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            expect(cluster.id).toBe(1);
            expect(cluster.competenceId).toBe(7);
            expect(cluster.lowerBound).toBe(0);
            expect(cluster.upperBound).toBe(5);
            expect(cluster.title).toBe('Top performer');
            expect(cluster.description).toBe('Above 4.5');
            expect(cluster.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(cluster.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('leaves id, createdAt, updatedAt undefined when not provided', () => {
            const cluster = ClusterDomain.create(baseProps);

            expect(cluster.id).toBeUndefined();
            expect(cluster.createdAt).toBeUndefined();
            expect(cluster.updatedAt).toBeUndefined();
        });
    });
});
