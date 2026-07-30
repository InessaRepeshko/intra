import '../../../setup-env';

import { SortDirection, TeamSortField } from '@intra/shared-kernel';
import { TestingModule } from '@nestjs/testing';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { TeamMembershipDomain } from 'src/contexts/organisation/domain/team-membership.domain';
import { TeamDomain } from 'src/contexts/organisation/domain/team.domain';
import { TeamRepository } from 'src/contexts/organisation/infrastructure/prisma-repositories/team.repository';
import { PrismaService } from 'src/database/prisma.service';
import {
    createOrganisationTestModule,
    resetOrganisationTables,
} from '../test-app-organisation';

describe('TeamRepository (integration)', () => {
    let module: TestingModule;
    let repo: TeamRepository;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let alice: UserDomain;
    let bob: UserDomain;

    beforeAll(async () => {
        module = await createOrganisationTestModule();
        repo = module.get(TeamRepository);
        identityUsers = module.get(IdentityUserService);
        prisma = module.get(PrismaService);
    });

    beforeEach(async () => {
        await resetOrganisationTables(prisma);
        alice = await identityUsers.create({
            firstName: 'Alice',
            lastName: 'Brown',
            email: `alice.${Date.now()}@example.com`,
        } as any);
        bob = await identityUsers.create({
            firstName: 'Bob',
            lastName: 'Green',
            email: `bob.${Date.now()}@example.com`,
        } as any);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('create', () => {
        it('persists a team without a head', async () => {
            const created = await repo.create(
                TeamDomain.create({ title: 'Platform' }),
            );

            expect(created.id).toBeDefined();
            expect(created.headId).toBeNull();

            const fromDb = await prisma.team.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb!.title).toBe('Platform');
        });

        it('persists a team with a head pointing to a real user', async () => {
            const created = await repo.create(
                TeamDomain.create({
                    title: 'Platform',
                    headId: alice.id!,
                }),
            );

            expect(created.headId).toBe(alice.id);
        });
    });

    describe('findById / search', () => {
        beforeEach(async () => {
            await repo.create(TeamDomain.create({ title: 'Alpha' }));
            await repo.create(TeamDomain.create({ title: 'Beta' }));
            await repo.create(
                TeamDomain.create({
                    title: 'Gamma',
                    headId: alice.id!,
                }),
            );
        });

        it('findById returns the team when found', async () => {
            const all = await repo.search({} as any);
            const target = all[0];

            await expect(repo.findById(target.id!)).resolves.toBeInstanceOf(
                TeamDomain,
            );
        });

        it('findById returns null for a missing id', async () => {
            await expect(repo.findById(999999)).resolves.toBeNull();
        });

        it('search filters by headId', async () => {
            const result = await repo.search({ headId: alice.id! } as any);

            expect(result).toHaveLength(1);
            expect(result[0].title).toBe('Gamma');
        });

        it('search supports descending sort on title', async () => {
            const result = await repo.search({
                sortBy: TeamSortField.TITLE,
                sortDirection: SortDirection.DESC,
            } as any);

            const titles = result.map((t) => t.title);
            expect(titles).toEqual([...titles].sort().reverse());
        });
    });

    describe('updateById', () => {
        it('persists the patched fields', async () => {
            const created = await repo.create(
                TeamDomain.create({ title: 'Platform' }),
            );

            const updated = await repo.updateById(created.id!, {
                description: 'new desc',
            });

            expect(updated.description).toBe('new desc');
        });
    });

    describe('deleteById', () => {
        it('removes the team row', async () => {
            const created = await repo.create(
                TeamDomain.create({ title: 'Doomed' }),
            );

            await repo.deleteById(created.id!);

            const fromDb = await prisma.team.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });
    });

    describe('addMember / removeMember / listMembers', () => {
        it('addMember creates the membership row', async () => {
            const team = await repo.create(
                TeamDomain.create({ title: 'Platform' }),
            );

            const membership = await repo.addMember(team.id!, alice.id!, true);

            expect(membership).toBeInstanceOf(TeamMembershipDomain);
            expect(membership.teamId).toBe(team.id);
            expect(membership.memberId).toBe(alice.id);
            expect(membership.isPrimary).toBe(true);
        });

        it('addMember is idempotent (returns existing on unique conflict)', async () => {
            const team = await repo.create(
                TeamDomain.create({ title: 'Platform' }),
            );

            const first = await repo.addMember(team.id!, alice.id!, true);
            const second = await repo.addMember(team.id!, alice.id!, true);

            expect(second.id).toBe(first.id);

            const rows = await prisma.teamMembership.findMany({
                where: { teamId: team.id! },
            });
            expect(rows).toHaveLength(1);
        });

        it('coerces a missing isPrimary to false', async () => {
            const team = await repo.create(
                TeamDomain.create({ title: 'Platform' }),
            );

            const membership = await repo.addMember(team.id!, alice.id!);

            expect(membership.isPrimary).toBe(false);
        });

        it('listMembers returns all memberships for the team', async () => {
            const team = await repo.create(
                TeamDomain.create({ title: 'Platform' }),
            );
            await repo.addMember(team.id!, alice.id!, true);
            await repo.addMember(team.id!, bob.id!, false);

            const result = await repo.listMembers(team.id!);

            expect(result).toHaveLength(2);
            expect(result.map((m) => m.memberId).sort()).toEqual(
                [alice.id!, bob.id!].sort(),
            );
        });

        it('removeMember deletes the membership row', async () => {
            const team = await repo.create(
                TeamDomain.create({ title: 'Platform' }),
            );
            await repo.addMember(team.id!, alice.id!, true);

            await repo.removeMember(team.id!, alice.id!);

            const rows = await prisma.teamMembership.findMany({
                where: { teamId: team.id! },
            });
            expect(rows).toEqual([]);
        });
    });
});
