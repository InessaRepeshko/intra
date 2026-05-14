import {
    Position as PrismaPosition,
    PositionHierarchy as PrismaPositionHierarchy,
    Team as PrismaTeam,
    TeamMembership as PrismaTeamMembership,
} from '@intra/database';
import { PositionHierarchyDomain } from 'src/contexts/organisation/domain/position-hierarchy.domain';
import { PositionDomain } from 'src/contexts/organisation/domain/position.domain';
import { TeamMembershipDomain } from 'src/contexts/organisation/domain/team-membership.domain';
import { TeamDomain } from 'src/contexts/organisation/domain/team.domain';
import { OrganisationMapper } from 'src/contexts/organisation/infrastructure/mappers/organisation.mapper';

describe('OrganisationMapper', () => {
    describe('toTeamDomain', () => {
        it('converts a prisma team row into a TeamDomain', () => {
            const prismaTeam = {
                id: 1,
                title: 'Platform',
                description: 'Platform engineering',
                headId: 7,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            } as PrismaTeam;

            const domain = OrganisationMapper.toTeamDomain(prismaTeam);

            expect(domain).toBeInstanceOf(TeamDomain);
            expect(domain.id).toBe(1);
            expect(domain.title).toBe('Platform');
            expect(domain.headId).toBe(7);
        });
    });

    describe('toTeamMembershipDomain', () => {
        it('converts a prisma membership row into a TeamMembershipDomain', () => {
            const prismaRow = {
                id: 1,
                teamId: 10,
                memberId: 200,
                isPrimary: true,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            } as PrismaTeamMembership;

            const domain =
                OrganisationMapper.toTeamMembershipDomain(prismaRow);

            expect(domain).toBeInstanceOf(TeamMembershipDomain);
            expect(domain.teamId).toBe(10);
            expect(domain.memberId).toBe(200);
            expect(domain.isPrimary).toBe(true);
        });
    });

    describe('toPositionDomain', () => {
        it('converts a prisma position row into a PositionDomain', () => {
            const prismaPosition = {
                id: 1,
                title: 'Engineer',
                description: 'Software engineer',
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
                updatedAt: new Date('2025-01-02T00:00:00.000Z'),
            } as PrismaPosition;

            const domain =
                OrganisationMapper.toPositionDomain(prismaPosition);

            expect(domain).toBeInstanceOf(PositionDomain);
            expect(domain.id).toBe(1);
            expect(domain.title).toBe('Engineer');
            expect(domain.description).toBe('Software engineer');
        });
    });

    describe('toPositionHierarchyDomain', () => {
        it('converts a prisma hierarchy relation into a PositionHierarchyDomain', () => {
            const prismaRow = {
                id: 1,
                superiorPositionId: 7,
                subordinatePositionId: 8,
                createdAt: new Date('2025-01-01T00:00:00.000Z'),
            } as PrismaPositionHierarchy;

            const domain =
                OrganisationMapper.toPositionHierarchyDomain(prismaRow);

            expect(domain).toBeInstanceOf(PositionHierarchyDomain);
            expect(domain.superiorPositionId).toBe(7);
            expect(domain.subordinatePositionId).toBe(8);
        });
    });
});
