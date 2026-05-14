import '../../../setup-env';

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { TeamService } from 'src/contexts/organisation/application/services/team.service';
import { TeamDomain } from 'src/contexts/organisation/domain/team.domain';
import { PrismaService } from 'src/database/prisma.service';
import {
    createOrganisationTestModule,
    resetOrganisationTables,
} from '../test-app-organisation';

describe('TeamService (integration)', () => {
    let module: TestingModule;
    let service: TeamService;
    let identityUsers: IdentityUserService;
    let prisma: PrismaService;
    let alice: UserDomain;
    let bob: UserDomain;

    beforeAll(async () => {
        module = await createOrganisationTestModule();
        service = module.get(TeamService);
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
            const created = await service.create({ title: 'Platform' });

            expect(created.id).toBeDefined();
            expect(created.title).toBe('Platform');
            expect(created.headId).toBeNull();

            const fromDb = await prisma.team.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).not.toBeNull();
        });

        it('verifies the head user exists when headId is supplied', async () => {
            const created = await service.create({
                title: 'Platform',
                headId: alice.id!,
            });
            expect(created.headId).toBe(alice.id);
        });

        it('throws NotFoundException for a missing head user', async () => {
            await expect(
                service.create({ title: 'Platform', headId: 999999 }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('search', () => {
        beforeEach(async () => {
            await service.create({ title: 'Platform Engineering' });
            await service.create({ title: 'Product Engineering' });
            await service.create({ title: 'Design' });
        });

        it('filters teams by title (case insensitive substring)', async () => {
            const result = await service.search({
                title: 'engineering',
            } as any);

            expect(result.map((t) => t.title).sort()).toEqual([
                'Platform Engineering',
                'Product Engineering',
            ]);
        });

        it('returns all teams without filter', async () => {
            const all = await service.search({} as any);
            expect(all).toHaveLength(3);
        });
    });

    describe('getById', () => {
        it('returns the team when found', async () => {
            const created = await service.create({ title: 'Platform' });

            await expect(service.getById(created.id!)).resolves.toBeInstanceOf(
                TeamDomain,
            );
        });

        it('throws NotFoundException when the team does not exist', async () => {
            await expect(service.getById(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('forwards the patch and persists the changes', async () => {
            const created = await service.create({ title: 'Platform' });

            const updated = await service.update(created.id!, {
                description: 'Updated',
                headId: alice.id!,
            });

            expect(updated.description).toBe('Updated');
            expect(updated.headId).toBe(alice.id);
        });

        it('throws NotFoundException for a missing team', async () => {
            await expect(
                service.update(999999, { title: 'X' }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('throws NotFoundException for a missing head user', async () => {
            const created = await service.create({ title: 'Platform' });

            await expect(
                service.update(created.id!, { headId: 999999 }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('delete', () => {
        it('removes a team that has no members', async () => {
            const created = await service.create({ title: 'Doomed' });

            await service.delete(created.id!);

            const fromDb = await prisma.team.findUnique({
                where: { id: created.id! },
            });
            expect(fromDb).toBeNull();
        });

        it('rejects deleting a team that still has members', async () => {
            const created = await service.create({ title: 'Has members' });
            await service.addMember(created.id!, {
                memberId: alice.id!,
                isPrimary: true,
            });

            await expect(service.delete(created.id!)).rejects.toBeInstanceOf(
                BadRequestException,
            );

            const stillThere = await prisma.team.findUnique({
                where: { id: created.id! },
            });
            expect(stillThere).not.toBeNull();
        });

        it('throws NotFoundException when the team does not exist', async () => {
            await expect(service.delete(999999)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('addMember / listMembers / removeMember', () => {
        it('adds a member without user data by default', async () => {
            const team = await service.create({ title: 'Platform' });

            const membership = await service.addMember(team.id!, {
                memberId: alice.id!,
                isPrimary: true,
            });

            expect(membership.id).toBeDefined();
            expect(membership.teamId).toBe(team.id);
            expect(membership.memberId).toBe(alice.id);
            expect(membership.isPrimary).toBe(true);
            expect(membership.user).toBeUndefined();

            const rows = await prisma.teamMembership.findMany({
                where: { teamId: team.id! },
            });
            expect(rows).toHaveLength(1);
        });

        it('attaches the user when withUser is set', async () => {
            const team = await service.create({ title: 'Platform' });

            const membership = await service.addMember(
                team.id!,
                { memberId: alice.id!, isPrimary: false },
                { withUser: true },
            );

            expect(membership.user).toBeDefined();
            expect(membership.user!.id).toBe(alice.id);
        });

        it('rejects adding a missing user', async () => {
            const team = await service.create({ title: 'Platform' });

            await expect(
                service.addMember(team.id!, {
                    memberId: 999999,
                    isPrimary: false,
                }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('rejects adding a member to a missing team', async () => {
            await expect(
                service.addMember(999999, {
                    memberId: alice.id!,
                    isPrimary: false,
                }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('listMembers returns memberships without users by default', async () => {
            const team = await service.create({ title: 'Platform' });
            await service.addMember(team.id!, {
                memberId: alice.id!,
                isPrimary: true,
            });
            await service.addMember(team.id!, {
                memberId: bob.id!,
                isPrimary: false,
            });

            const result = await service.listMembers(team.id!);

            expect(result).toHaveLength(2);
            result.forEach((m) => expect(m.user).toBeUndefined());
        });

        it('listMembers attaches users when withUsers is set', async () => {
            const team = await service.create({ title: 'Platform' });
            await service.addMember(team.id!, {
                memberId: alice.id!,
                isPrimary: false,
            });
            await service.addMember(team.id!, {
                memberId: bob.id!,
                isPrimary: false,
            });

            const result = await service.listMembers(team.id!, {
                withUsers: true,
            });

            const ids = result
                .map((m) => m.user?.id)
                .filter((id): id is number => id !== undefined);
            expect(ids.sort()).toEqual([alice.id!, bob.id!].sort());
        });

        it('removeMember deletes the membership row', async () => {
            const team = await service.create({ title: 'Platform' });
            await service.addMember(team.id!, {
                memberId: alice.id!,
                isPrimary: false,
            });

            await service.removeMember(team.id!, alice.id!);

            const rows = await prisma.teamMembership.findMany({
                where: { teamId: team.id! },
            });
            expect(rows).toEqual([]);
        });
    });
});
