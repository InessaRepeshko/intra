import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';

describe('UserDomain', () => {
    const baseProps = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
    };

    describe('create', () => {
        it('creates a user with every supplied property', () => {
            const user = UserDomain.create({
                id: 1,
                ...baseProps,
                secondName: 'M.',
                fullName: 'Custom Full Name',
                avatarUrl: 'https://example.com/avatar.png',
                status: IdentityStatus.INACTIVE,
                positionId: 3,
                teamId: 4,
                managerId: 5,
                roles: [IdentityRole.HR, IdentityRole.MANAGER],
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            expect(user.id).toBe(1);
            expect(user.firstName).toBe('Jane');
            expect(user.secondName).toBe('M.');
            expect(user.lastName).toBe('Doe');
            expect(user.fullName).toBe('Custom Full Name');
            expect(user.email).toBe('jane@example.com');
            expect(user.avatarUrl).toBe('https://example.com/avatar.png');
            expect(user.status).toBe(IdentityStatus.INACTIVE);
            expect(user.positionId).toBe(3);
            expect(user.teamId).toBe(4);
            expect(user.managerId).toBe(5);
            expect(user.roles).toEqual([IdentityRole.HR, IdentityRole.MANAGER]);
            expect(user.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(user.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('builds fullName from first/last when secondName is missing', () => {
            const user = UserDomain.create(baseProps);
            expect(user.fullName).toBe('Jane Doe');
        });

        it('builds fullName including secondName when supplied', () => {
            const user = UserDomain.create({
                ...baseProps,
                secondName: 'M.',
            });
            expect(user.fullName).toBe('Jane M. Doe');
        });

        it('defaults status to ACTIVE, avatarUrl/positionId/teamId/managerId to null, roles to []', () => {
            const user = UserDomain.create(baseProps);
            expect(user.status).toBe(IdentityStatus.ACTIVE);
            expect(user.avatarUrl).toBeNull();
            expect(user.positionId).toBeNull();
            expect(user.teamId).toBeNull();
            expect(user.managerId).toBeNull();
            expect(user.roles).toEqual([]);
        });
    });

    describe('withRoles', () => {
        it('returns a new instance with the supplied roles', () => {
            const user = UserDomain.create(baseProps);
            const next = user.withRoles([IdentityRole.ADMIN]);

            expect(next).not.toBe(user);
            expect(next.roles).toEqual([IdentityRole.ADMIN]);
            expect(user.roles).toEqual([]);
        });
    });

    describe('withPatch', () => {
        it('returns a new instance with the supplied patch applied', () => {
            const user = UserDomain.create({
                ...baseProps,
                id: 1,
                positionId: 10,
            });
            const next = user.withPatch({ positionId: 20, teamId: 30 });

            expect(next).not.toBe(user);
            expect(next.positionId).toBe(20);
            expect(next.teamId).toBe(30);
            expect(user.positionId).toBe(10);
        });

        it('rebuilds fullName when name parts are patched (via default fallback)', () => {
            const user = UserDomain.create({
                ...baseProps,
                fullName: 'Jane Doe',
            });
            const next = user.withPatch({
                firstName: 'Jenny',
                fullName: undefined,
            });
            // fullName falls back to buildFullName(firstName, secondName, lastName)
            expect(next.fullName).toBe('Jenny Doe');
        });
    });
});
