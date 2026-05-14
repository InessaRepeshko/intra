import { Team as PrismaTeam } from '@intra/database';
import { TeamDomain } from 'src/contexts/organisation/domain/team.domain';
import { TeamMapper } from 'src/contexts/organisation/infrastructure/mappers/team.mapper';

describe('TeamMapper', () => {
    const prismaTeam = {
        id: 1,
        title: 'Platform',
        description: 'Platform engineering',
        headId: 7,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    } as PrismaTeam;

    describe('toDomain', () => {
        it('converts a prisma row into a TeamDomain', () => {
            const domain = TeamMapper.toDomain(prismaTeam);

            expect(domain).toBeInstanceOf(TeamDomain);
            expect(domain.id).toBe(1);
            expect(domain.title).toBe('Platform');
            expect(domain.description).toBe('Platform engineering');
            expect(domain.headId).toBe(7);
        });

        it('preserves null description and headId from prisma', () => {
            const domain = TeamMapper.toDomain({
                ...prismaTeam,
                description: null,
                headId: null,
            } as unknown as PrismaTeam);
            expect(domain.description).toBeNull();
            expect(domain.headId).toBeNull();
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain into a Prisma create input', () => {
            const domain = TeamDomain.create({
                title: 'Platform',
                description: 'desc',
                headId: 7,
            });

            const prisma = TeamMapper.toPrisma(domain);

            expect(prisma).toEqual({
                title: 'Platform',
                description: 'desc',
                headId: 7,
            });
        });

        it('passes through null description and headId when present on the domain', () => {
            const domain = TeamDomain.create({ title: 'Platform' });

            const prisma = TeamMapper.toPrisma(domain);

            expect(prisma.description).toBeNull();
            expect(prisma.headId).toBeNull();
        });
    });
});
