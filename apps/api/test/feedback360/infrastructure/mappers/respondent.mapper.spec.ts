import { Respondent as PrismaRespondent } from '@intra/database';
import { RespondentCategory, ResponseStatus } from '@intra/shared-kernel';
import { RespondentDomain } from 'src/contexts/feedback360/domain/respondent.domain';
import { RespondentMapper } from 'src/contexts/feedback360/infrastructure/mappers/respondent.mapper';

describe('RespondentMapper', () => {
    const prismaRespondent = {
        id: 1,
        reviewId: 10,
        respondentId: 20,
        fullName: 'John Smith',
        category: 'TEAM' as PrismaRespondent['category'],
        responseStatus: 'PENDING' as PrismaRespondent['responseStatus'],
        respondentNote: 'note',
        hrNote: 'hr note',
        positionId: 3,
        positionTitle: 'Engineer',
        teamId: 4,
        teamTitle: 'Team A',
        invitedAt: new Date('2025-01-01T00:00:00.000Z'),
        canceledAt: null,
        respondedAt: null,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    } as PrismaRespondent;

    describe('toDomain', () => {
        it('converts a prisma row into a RespondentDomain instance', () => {
            const domain = RespondentMapper.toDomain(prismaRespondent);

            expect(domain).toBeInstanceOf(RespondentDomain);
            expect(domain.id).toBe(1);
            expect(domain.reviewId).toBe(10);
            expect(domain.respondentId).toBe(20);
            expect(domain.fullName).toBe('John Smith');
            expect(domain.category).toBe(RespondentCategory.TEAM);
            expect(domain.responseStatus).toBe(ResponseStatus.PENDING);
            expect(domain.teamId).toBe(4);
            expect(domain.teamTitle).toBe('Team A');
        });
    });

    describe('toPrisma', () => {
        it('serialises a RespondentDomain into a Prisma create input', () => {
            const domain = RespondentDomain.create({
                reviewId: 10,
                respondentId: 20,
                fullName: 'John Smith',
                category: RespondentCategory.SELF_ASSESSMENT,
                responseStatus: ResponseStatus.IN_PROGRESS,
                positionId: 3,
                positionTitle: 'Engineer',
            });

            const prisma = RespondentMapper.toPrisma(domain);

            expect(prisma.reviewId).toBe(10);
            expect(prisma.respondentId).toBe(20);
            expect(prisma.fullName).toBe('John Smith');
            expect(prisma.category).toBe('SELF_ASSESSMENT');
            expect(prisma.responseStatus).toBe('IN_PROGRESS');
            expect(prisma.positionId).toBe(3);
            expect(prisma.positionTitle).toBe('Engineer');
        });
    });

    describe('enum conversions', () => {
        it('uppercases the response status in both directions', () => {
            expect(
                RespondentMapper.toPrismaResponseStatus(
                    ResponseStatus.COMPLETED,
                ),
            ).toBe('COMPLETED');
            expect(
                RespondentMapper.fromPrismaResponseStatus(
                    'CANCELED' as PrismaRespondent['responseStatus'],
                ),
            ).toBe(ResponseStatus.CANCELED);
        });

        it('uppercases the category in both directions', () => {
            expect(
                RespondentMapper.toPrismaCategory(RespondentCategory.OTHER),
            ).toBe('OTHER');
            expect(
                RespondentMapper.fromPrismaCategory(
                    'TEAM' as PrismaRespondent['category'],
                ),
            ).toBe(RespondentCategory.TEAM);
        });
    });
});
