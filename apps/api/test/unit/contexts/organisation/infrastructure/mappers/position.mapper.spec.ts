import { Position as PrismaPosition } from '@intra/database';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { PositionMapper } from 'src/contexts/organisation/infrastructure/mappers/position.mapper';

describe('PositionMapper', () => {
    const prismaPosition = {
        id: 1,
        title: 'Engineer',
        description: 'Software engineer',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    } as PrismaPosition;

    describe('toDomain', () => {
        it('converts a prisma row into a PositionDomain', () => {
            const domain = PositionMapper.toDomain(prismaPosition);

            expect(domain).toBeInstanceOf(PositionDomain);
            expect(domain.id).toBe(1);
            expect(domain.title).toBe('Engineer');
            expect(domain.description).toBe('Software engineer');
        });

        it('preserves null description from prisma', () => {
            const domain = PositionMapper.toDomain({
                ...prismaPosition,
                description: null,
            } as unknown as PrismaPosition);
            expect(domain.description).toBeNull();
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain into a Prisma create input', () => {
            const domain = PositionDomain.create({
                title: 'Engineer',
                description: 'Software engineer',
            });

            const prisma = PositionMapper.toPrisma(domain);

            expect(prisma).toEqual({
                title: 'Engineer',
                description: 'Software engineer',
            });
        });

        it('passes through null description when present on the domain', () => {
            const domain = PositionDomain.create({ title: 'Engineer' });

            const prisma = PositionMapper.toPrisma(domain);

            expect(prisma.description).toBeNull();
        });
    });
});
