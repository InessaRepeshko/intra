jest.mock('better-auth', () => ({ betterAuth: jest.fn(() => ({})) }));
jest.mock('better-auth/adapters/prisma', () => ({
    prismaAdapter: jest.fn(() => ({})),
}));

import { TeamService } from 'src/contexts/organisation/application/services/team.service';
import { TeamMembershipDomain } from 'src/contexts/organisation/domain/team-membership.domain';
import { TeamDomain } from 'src/contexts/organisation/domain/team.domain';
import { TeamsController } from 'src/contexts/organisation/presentation/http/controllers/teams.controller';

function buildTeam(): TeamDomain {
    return TeamDomain.create({
        id: 1,
        title: 'Platform',
        description: 'desc',
        headId: 7,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
        updatedAt: new Date('2025-01-02T00:00:00.000Z'),
    });
}

function buildMembership(memberId = 200): TeamMembershipDomain {
    return TeamMembershipDomain.create({
        id: memberId,
        teamId: 1,
        memberId,
        isPrimary: false,
        createdAt: new Date('2025-01-01T00:00:00.000Z'),
    });
}

describe('TeamsController', () => {
    let controller: TeamsController;
    let service: any;

    beforeEach(() => {
        service = {
            create: jest.fn(),
            search: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            addMember: jest.fn(),
            removeMember: jest.fn(),
            listMembers: jest.fn(),
        };

        controller = new TeamsController(service as unknown as TeamService);
    });

    describe('create', () => {
        it('forwards the dto and maps the response', async () => {
            service.create.mockResolvedValue(buildTeam());

            const result = await controller.create({
                title: 'Platform',
                description: 'desc',
                headId: 7,
            } as any);

            expect(service.create).toHaveBeenCalledWith({
                title: 'Platform',
                description: 'desc',
                headId: 7,
            });
            expect(result.id).toBe(1);
        });
    });

    describe('search', () => {
        it('maps every team to a response', async () => {
            service.search.mockResolvedValue([buildTeam()]);
            const result = await controller.search({} as any);
            expect(service.search).toHaveBeenCalledWith({});
            expect(result).toHaveLength(1);
        });
    });

    describe('getById', () => {
        it('parses the id and forwards to the service', async () => {
            service.getById.mockResolvedValue(buildTeam());
            const result = await controller.getById('1');
            expect(service.getById).toHaveBeenCalledWith(1);
            expect(result.id).toBe(1);
        });
    });

    describe('update', () => {
        it('parses the id and forwards the dto', async () => {
            service.update.mockResolvedValue(buildTeam());
            await controller.update('1', { title: 'X' } as any);
            expect(service.update).toHaveBeenCalledWith(1, { title: 'X' });
        });
    });

    describe('delete', () => {
        it('parses the id and forwards to the service', async () => {
            await controller.delete('1');
            expect(service.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('addMember', () => {
        it('parses the id, forwards the dto with withUser, and maps the response', async () => {
            service.addMember.mockResolvedValue(buildMembership());

            const result = await controller.addMember('1', {
                memberId: 200,
                isPrimary: true,
            } as any);

            expect(service.addMember).toHaveBeenCalledWith(
                1,
                { memberId: 200, isPrimary: true },
                { withUser: true },
            );
            expect(result.memberId).toBe(200);
        });
    });

    describe('listMembers', () => {
        it('maps every membership to a response and requests user data', async () => {
            service.listMembers.mockResolvedValue([
                buildMembership(200),
                buildMembership(201),
            ]);

            const result = await controller.listMembers('1');

            expect(service.listMembers).toHaveBeenCalledWith(1, {
                withUsers: true,
            });
            expect(result).toHaveLength(2);
            expect(result.map((r) => r.memberId)).toEqual([200, 201]);
        });
    });

    describe('removeMember', () => {
        it('parses both ids and forwards the call', async () => {
            await controller.removeMember('1', '200');
            expect(service.removeMember).toHaveBeenCalledWith(1, 200);
        });
    });
});
