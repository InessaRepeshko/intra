import { TeamDomain } from 'src/contexts/organisation/domain/team.domain';

describe('TeamDomain', () => {
    const baseProps = { title: 'Platform' };

    describe('create', () => {
        it('creates a team with every supplied property', () => {
            const team = TeamDomain.create({
                id: 1,
                title: 'Platform',
                description: 'Platform engineering',
                headId: 99,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            });

            expect(team.id).toBe(1);
            expect(team.title).toBe('Platform');
            expect(team.description).toBe('Platform engineering');
            expect(team.headId).toBe(99);
            expect(team.createdAt).toEqual(
                new Date('2025-01-01T00:00:00.000Z'),
            );
            expect(team.updatedAt).toEqual(
                new Date('2025-01-02T00:00:00.000Z'),
            );
        });

        it('defaults description and headId to null', () => {
            const team = TeamDomain.create(baseProps);
            expect(team.description).toBeNull();
            expect(team.headId).toBeNull();
        });
    });

    describe('withPatch', () => {
        it('returns a new instance carrying the supplied patch', () => {
            const team = TeamDomain.create({
                id: 1,
                title: 'Platform',
                description: 'Old',
                headId: 1,
            });

            const next = team.withPatch({ headId: 7 });

            expect(next).not.toBe(team);
            expect(next.headId).toBe(7);
            expect(next.title).toBe('Platform');
            expect(team.headId).toBe(1);
        });
    });
});
