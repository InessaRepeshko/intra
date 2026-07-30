import { Cluster as PrismaCluster } from '@intra/database';
import Decimal from 'decimal.js';
import { ClusterDomain } from 'src/contexts/library/domain/cluster.domain';
import { ClusterMapper } from 'src/contexts/library/infrastructure/mappers/cluster.mapper';

describe('ClusterMapper', () => {
    const prismaCluster = {
        id: 1,
        competenceId: 7,
        lowerBound: new Decimal('0'),
        upperBound: new Decimal('5'),
        title: 'Top performer',
        description: 'Above 4.5',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    } as unknown as PrismaCluster;

    describe('toDomain', () => {
        it('converts a prisma row into a ClusterDomain, coercing decimals to numbers', () => {
            const domain = ClusterMapper.toDomain(prismaCluster);

            expect(domain).toBeInstanceOf(ClusterDomain);
            expect(domain.id).toBe(1);
            expect(domain.competenceId).toBe(7);
            expect(domain.lowerBound).toBe(0);
            expect(domain.upperBound).toBe(5);
            expect(domain.title).toBe('Top performer');
            expect(domain.description).toBe('Above 4.5');
            expect(domain.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(domain.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain into a Prisma create input', () => {
            const domain = ClusterDomain.create({
                competenceId: 7,
                lowerBound: 0,
                upperBound: 5,
                title: 'High',
                description: 'Above 4',
            });

            const prisma = ClusterMapper.toPrisma(domain);

            expect(prisma).toEqual({
                competenceId: 7,
                lowerBound: 0,
                upperBound: 5,
                title: 'High',
                description: 'Above 4',
            });
        });
    });
});
