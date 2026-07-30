import { IdentityRole } from '@intra/shared-kernel';
import { RoleDomain } from 'src/contexts/identity/domain/role.domain';

describe('RoleDomain', () => {
    describe('constructor', () => {
        it('creates a role with every supplied property', () => {
            const role = new RoleDomain({
                id: 1,
                code: IdentityRole.HR,
                title: 'HR',
                description: 'Human resources',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            expect(role.id).toBe(1);
            expect(role.code).toBe(IdentityRole.HR);
            expect(role.title).toBe('HR');
            expect(role.description).toBe('Human resources');
            expect(role.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(role.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('normalises missing description to null', () => {
            const role = new RoleDomain({
                code: IdentityRole.ADMIN,
                title: 'Admin',
            });

            expect(role.description).toBeNull();
        });

        it('preserves explicit null description', () => {
            const role = new RoleDomain({
                code: IdentityRole.EMPLOYEE,
                title: 'Employee',
                description: null,
            });

            expect(role.description).toBeNull();
        });
    });
});
