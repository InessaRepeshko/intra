import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { TeamMembershipDomain } from 'src/contexts/organisation/domain/team-membership.domain';
import { TeamMembershipHttpMapper } from 'src/contexts/organisation/presentation/http/mappers/team-membership.http.mapper';

describe('TeamMembershipHttpMapper', () => {
    describe('toResponse', () => {
        it('maps the basic membership without the user when none is set', () => {
            const domain = TeamMembershipDomain.create({
                id: 1,
                teamId: 10,
                memberId: 200,
                isPrimary: false,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            });

            const response = TeamMembershipHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.teamId).toBe(10);
            expect(response.memberId).toBe(200);
            expect(response.isPrimary).toBe(false);
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(response.user).toBeUndefined();
        });

        it('includes the user when the domain carries one', () => {
            const user = UserDomain.create({
                id: 200,
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                status: IdentityStatus.ACTIVE,
                roles: [IdentityRole.EMPLOYEE],
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-01T00:00:00.000Z'),
            });
            const domain = TeamMembershipDomain.create({
                id: 1,
                teamId: 10,
                memberId: 200,
                isPrimary: true,
                user,
            });

            const response = TeamMembershipHttpMapper.toResponse(domain);

            expect(response.user).toBeDefined();
            expect(response.user!.id).toBe(200);
            expect(response.user!.fullName).toBe('Jane Doe');
        });
    });
});
