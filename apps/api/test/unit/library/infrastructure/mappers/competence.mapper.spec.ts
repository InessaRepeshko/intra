import { Competence as PrismaCompetence } from '@intra/database';
import { CompetenceDomain } from 'src/contexts/library/domain/competence.domain';
import { CompetenceMapper } from 'src/contexts/library/infrastructure/mappers/competence.mapper';

describe('CompetenceMapper', () => {
    const prismaCompetence = {
        id: 1,
        code: 'TWK',
        title: 'Teamwork',
        description: 'Working with peers',
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    } as PrismaCompetence;

    describe('toDomain', () => {
        it('converts a prisma row into a CompetenceDomain', () => {
            const domain = CompetenceMapper.toDomain(prismaCompetence);

            expect(domain).toBeInstanceOf(CompetenceDomain);
            expect(domain.id).toBe(1);
            expect(domain.code).toBe('TWK');
            expect(domain.title).toBe('Teamwork');
            expect(domain.description).toBe('Working with peers');
        });

        it('preserves null code/description coming from the database', () => {
            const domain = CompetenceMapper.toDomain({
                ...prismaCompetence,
                code: null,
                description: null,
            } as unknown as PrismaCompetence);

            expect(domain.code).toBeNull();
            expect(domain.description).toBeNull();
        });
    });

    describe('toPrisma', () => {
        it('serialises a domain into a Prisma create input', () => {
            const domain = CompetenceDomain.create({
                code: 'TWK',
                title: 'Teamwork',
                description: 'desc',
            });

            const prisma = CompetenceMapper.toPrisma(domain);

            expect(prisma).toEqual({
                code: 'TWK',
                title: 'Teamwork',
                description: 'desc',
            });
        });

        it('passes through null code/description when present on the domain', () => {
            const domain = CompetenceDomain.create({
                title: 'Teamwork',
            });

            const prisma = CompetenceMapper.toPrisma(domain);

            expect(prisma.code).toBeNull();
            expect(prisma.description).toBeNull();
        });
    });
});
