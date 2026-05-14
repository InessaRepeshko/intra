import { IdentityRole, IdentityStatus } from '@intra/shared-kernel';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { UserDomain } from 'src/contexts/identity/domain/user.domain';
import { ORGANISATION_TEAM_REPOSITORY } from 'src/contexts/organisation/application/ports/team.repository.port';
import { TeamService } from 'src/contexts/organisation/application/services/team.service';
import { TeamMembershipDomain } from 'src/contexts/organisation/domain/team-membership.domain';
import { TeamDomain } from 'src/contexts/organisation/domain/team.domain';

function buildTeam(
    overrides: Partial<Parameters<typeof TeamDomain.create>[0]> = {},
): TeamDomain {
    return TeamDomain.create({
        id: 1,
        title: 'Platform',
        ...overrides,
    });
}

function buildUser(id = 200): UserDomain {
    return UserDomain.create({
        id,
        firstName: 'Jane',
        lastName: 'Doe',
        email: `user${id}@example.com`,
        status: IdentityStatus.ACTIVE,
        roles: [IdentityRole.EMPLOYEE],
    });
}

function buildMembership(
    overrides: Partial<Parameters<typeof TeamMembershipDomain.create>[0]> = {},
): TeamMembershipDomain {
    return TeamMembershipDomain.create({
        id: 1,
        teamId: 1,
        memberId: 200,
        ...overrides,
    });
}

describe('TeamService', () => {
    let service: TeamService;
    let teams: any;
    let identityUsers: any;

    beforeEach(async () => {
        teams = {
            create: jest.fn(),
            search: jest.fn(),
            findById: jest.fn(),
            updateById: jest.fn(),
            deleteById: jest.fn(),
            addMember: jest.fn(),
            removeMember: jest.fn(),
            listMembers: jest.fn(),
        };
        identityUsers = { getById: jest.fn() };

        const module = await Test.createTestingModule({
            providers: [
                TeamService,
                { provide: ORGANISATION_TEAM_REPOSITORY, useValue: teams },
                { provide: IdentityUserService, useValue: identityUsers },
            ],
        }).compile();

        service = module.get(TeamService);
    });

    describe('create', () => {
        it('persists the team with null fallbacks for description and headId', async () => {
            teams.create.mockImplementation(async (t: TeamDomain) => t);

            await service.create({ title: 'Platform' });

            const passed = teams.create.mock.calls[0][0] as TeamDomain;
            expect(passed).toBeInstanceOf(TeamDomain);
            expect(passed.description).toBeNull();
            expect(passed.headId).toBeNull();
            expect(identityUsers.getById).not.toHaveBeenCalled();
        });

        it('verifies the head user exists when headId is supplied', async () => {
            identityUsers.getById.mockResolvedValue(buildUser());
            teams.create.mockImplementation(async (t: TeamDomain) => t);

            await service.create({ title: 'Platform', headId: 200 });

            expect(identityUsers.getById).toHaveBeenCalledWith(200);
        });

        it('skips the head verification when headId is null', async () => {
            teams.create.mockImplementation(async (t: TeamDomain) => t);

            await service.create({ title: 'Platform', headId: null });

            expect(identityUsers.getById).not.toHaveBeenCalled();
        });
    });

    describe('search', () => {
        it('delegates to the repository', async () => {
            teams.search.mockResolvedValue([buildTeam()]);
            const result = await service.search({});
            expect(teams.search).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('returns the team when found', async () => {
            const team = buildTeam();
            teams.findById.mockResolvedValue(team);
            await expect(service.getById(1)).resolves.toBe(team);
        });

        it('throws NotFoundException when missing', async () => {
            teams.findById.mockResolvedValue(null);
            await expect(service.getById(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('throws NotFoundException when the team does not exist', async () => {
            teams.findById.mockResolvedValue(null);
            await expect(
                service.update(1, { title: 'X' }),
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it('verifies the head user when headId is supplied', async () => {
            teams.findById.mockResolvedValue(buildTeam());
            identityUsers.getById.mockResolvedValue(buildUser());
            teams.updateById.mockResolvedValue(buildTeam());

            await service.update(1, { headId: 200 });

            expect(identityUsers.getById).toHaveBeenCalledWith(200);
        });

        it('skips head verification when headId is null', async () => {
            teams.findById.mockResolvedValue(buildTeam());
            teams.updateById.mockResolvedValue(buildTeam());

            await service.update(1, { headId: null });

            expect(identityUsers.getById).not.toHaveBeenCalled();
        });

        it('forwards the patch to the repository', async () => {
            teams.findById.mockResolvedValue(buildTeam());
            teams.updateById.mockResolvedValue(buildTeam());

            await service.update(1, {
                title: 'New',
                description: 'X',
            });

            expect(teams.updateById).toHaveBeenCalledWith(1, {
                title: 'New',
                description: 'X',
            });
        });
    });

    describe('delete', () => {
        it('throws NotFoundException when the team does not exist', async () => {
            teams.findById.mockResolvedValue(null);
            await expect(service.delete(1)).rejects.toBeInstanceOf(
                NotFoundException,
            );
        });

        it('rejects when the team still has members', async () => {
            teams.findById.mockResolvedValue(buildTeam());
            teams.listMembers.mockResolvedValue([buildMembership()]);

            await expect(service.delete(1)).rejects.toBeInstanceOf(
                BadRequestException,
            );
            expect(teams.deleteById).not.toHaveBeenCalled();
        });

        it('deletes the team when no members are linked', async () => {
            teams.findById.mockResolvedValue(buildTeam());
            teams.listMembers.mockResolvedValue([]);

            await service.delete(1);

            expect(teams.deleteById).toHaveBeenCalledWith(1);
        });
    });

    describe('addMember', () => {
        it('verifies the team and user, then adds the membership without user data by default', async () => {
            teams.findById.mockResolvedValue(buildTeam());
            identityUsers.getById.mockResolvedValue(buildUser());
            const membership = buildMembership();
            teams.addMember.mockResolvedValue(membership);

            const result = await service.addMember(1, {
                memberId: 200,
                isPrimary: true,
            } as any);

            expect(teams.addMember).toHaveBeenCalledWith(1, 200, true);
            expect(result).toBe(membership);
            expect(result.user).toBeUndefined();
        });

        it('attaches the user to the membership when withUser is set', async () => {
            teams.findById.mockResolvedValue(buildTeam());
            const user = buildUser();
            identityUsers.getById.mockResolvedValue(user);
            teams.addMember.mockResolvedValue(buildMembership());

            const result = await service.addMember(
                1,
                { memberId: 200, isPrimary: true } as any,
                { withUser: true },
            );

            expect(result.user).toBe(user);
        });
    });

    describe('removeMember', () => {
        it('verifies the team exists before delegating', async () => {
            teams.findById.mockResolvedValue(buildTeam());

            await service.removeMember(1, 200);

            expect(teams.removeMember).toHaveBeenCalledWith(1, 200);
        });
    });

    describe('listMembers', () => {
        it('returns memberships without attached users when withUsers is false', async () => {
            teams.findById.mockResolvedValue(buildTeam());
            const memberships = [
                buildMembership({ memberId: 200 }),
                buildMembership({ memberId: 201 }),
            ];
            teams.listMembers.mockResolvedValue(memberships);

            const result = await service.listMembers(1);

            expect(result).toBe(memberships);
            expect(identityUsers.getById).not.toHaveBeenCalled();
        });

        it('attaches users to every membership when withUsers is true', async () => {
            teams.findById.mockResolvedValue(buildTeam());
            teams.listMembers.mockResolvedValue([
                buildMembership({ memberId: 200 }),
                buildMembership({ memberId: 201 }),
            ]);
            identityUsers.getById.mockImplementation(async (id: number) =>
                buildUser(id),
            );

            const result = await service.listMembers(1, { withUsers: true });

            expect(result).toHaveLength(2);
            expect(result[0].user?.id).toBe(200);
            expect(result[1].user?.id).toBe(201);
        });

        it('falls back to the bare membership when the user lookup fails', async () => {
            teams.findById.mockResolvedValue(buildTeam());
            const original = buildMembership({ memberId: 200 });
            teams.listMembers.mockResolvedValue([original]);
            identityUsers.getById.mockRejectedValue(new Error('boom'));

            const result = await service.listMembers(1, { withUsers: true });

            // service catches the error and returns the original membership
            expect(result[0]).toBe(original);
            expect(result[0].user).toBeUndefined();
        });
    });
});
