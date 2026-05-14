import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { TeamMembershipDomain } from 'src/contexts/organisation/domain/team-membership.domain';

describe('TeamMembershipDomain', () => {
    const baseProps = { teamId: 1, memberId: 200 };

    describe('create', () => {
        it('creates a membership with every supplied field', () => {
            const user = UserDomain.create({
                id: 200,
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                status: IdentityStatus.ACTIVE,
                roles: [IdentityRole.EMPLOYEE],
            });

            const membership = TeamMembershipDomain.create({
                id: 1,
                teamId: 1,
                memberId: 200,
                isPrimary: true,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                user,
            });

            expect(membership.id).toBe(1);
            expect(membership.teamId).toBe(1);
            expect(membership.memberId).toBe(200);
            expect(membership.isPrimary).toBe(true);
            expect(membership.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(membership.user).toBe(user);
        });

        it('defaults isPrimary to false when not supplied', () => {
            const membership = TeamMembershipDomain.create(baseProps);
            expect(membership.isPrimary).toBe(false);
        });

        it('coerces null isPrimary to false', () => {
            const membership = TeamMembershipDomain.create({
                ...baseProps,
                isPrimary: null,
            });
            expect(membership.isPrimary).toBe(false);
        });
    });

    describe('withUser', () => {
        it('returns a new instance carrying the supplied user', () => {
            const membership = TeamMembershipDomain.create(baseProps);
            const user = UserDomain.create({
                id: 200,
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
            });

            const next = membership.withUser(user);

            expect(next).not.toBe(membership);
            expect(next.user).toBe(user);
            expect(membership.user).toBeUndefined();
        });
    });
});
