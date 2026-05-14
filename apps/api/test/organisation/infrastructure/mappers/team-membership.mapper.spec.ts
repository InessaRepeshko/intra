import { TeamMembership as PrismaTeamMembership } from '@intra/database';
import { TeamMembershipDomain } from 'src/contexts/organisation/domain/team-membership.domain';
import { TeamMembershipMapper } from 'src/contexts/organisation/infrastructure/mappers/team-membership.mapper';

describe('TeamMembershipMapper', () => {
    const prismaRow = {
        id: 1,
        teamId: 10,
        memberId: 200,
        isPrimary: true,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    } as PrismaTeamMembership;

    describe('toDomain', () => {
        it('converts a prisma row into a TeamMembershipDomain', () => {
            const domain = TeamMembershipMapper.toDomain(prismaRow);

            expect(domain).toBeInstanceOf(TeamMembershipDomain);
            expect(domain.id).toBe(1);
            expect(domain.teamId).toBe(10);
            expect(domain.memberId).toBe(200);
            expect(domain.isPrimary).toBe(true);
            expect(domain.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
        });
    });
});
