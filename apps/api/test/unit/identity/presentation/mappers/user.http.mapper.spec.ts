import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { UserHttpMapper } from 'src/contexts/identity/presentation/http/mappers/user.http.mapper';

describe('UserHttpMapper', () => {
    describe('toResponse', () => {
        it('maps every domain field onto the response', () => {
            const domain = UserDomain.create({
                id: 1,
                firstName: 'Jane',
                secondName: 'M.',
                lastName: 'Doe',
                fullName: 'Jane M. Doe',
                email: 'jane@example.com',
                avatarUrl: 'https://example.com/a.png',
                status: IdentityStatus.ACTIVE,
                positionId: 3,
                teamId: 4,
                managerId: 5,
                roles: [IdentityRole.HR],
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            const response = UserHttpMapper.toResponse(domain);

            expect(response.id).toBe(1);
            expect(response.firstName).toBe('Jane');
            expect(response.secondName).toBe('M.');
            expect(response.lastName).toBe('Doe');
            expect(response.fullName).toBe('Jane M. Doe');
            expect(response.email).toBe('jane@example.com');
            expect(response.avatarUrl).toBe('https://example.com/a.png');
            expect(response.status).toBe(IdentityStatus.ACTIVE);
            expect(response.positionId).toBe(3);
            expect(response.teamId).toBe(4);
            expect(response.managerId).toBe(5);
            expect(response.roles).toEqual([IdentityRole.HR]);
            expect(response.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(response.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('returns null for missing optional fields and [] for roles', () => {
            const domain = UserDomain.create({
                id: 1,
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
            });

            const response = UserHttpMapper.toResponse(domain);

            expect(response.secondName).toBeNull();
            expect(response.avatarUrl).toBeNull();
            expect(response.positionId).toBeNull();
            expect(response.teamId).toBeNull();
            expect(response.managerId).toBeNull();
            expect(response.roles).toEqual([]);
        });
    });
});
