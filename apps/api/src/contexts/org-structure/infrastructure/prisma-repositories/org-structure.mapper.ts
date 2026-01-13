import { Position, PositionHierarchy, Team, TeamMembership } from '@prisma/client';
import { TeamDomain } from '../../domain/team.domain';
import { TeamMembershipDomain } from '../../domain/team-membership.domain';
import { PositionDomain } from '../../domain/position.domain';
import { PositionHierarchyDomain } from '../../domain/position-hierarchy.domain';

export class OrgStructureMapper {
  static toTeamDomain(team: Team): TeamDomain {
    return TeamDomain.create({
      id: team.id,
      title: team.title,
      description: team.description,
      headId: team.headId,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    });
  }

  static toTeamMembershipDomain(membership: TeamMembership): TeamMembershipDomain {
    return TeamMembershipDomain.create({
      id: membership.id,
      teamId: membership.teamId,
      userId: membership.userId,
      isPrimary: membership.isPrimary,
      createdAt: membership.createdAt,
    });
  }

  static toPositionDomain(position: Position): PositionDomain {
    return PositionDomain.create({
      id: position.id,
      title: position.title,
      description: position.description,
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    });
  }

  static toPositionHierarchyDomain(relation: PositionHierarchy): PositionHierarchyDomain {
    return PositionHierarchyDomain.create({
      id: relation.id,
      parentPositionId: relation.parentPositionId,
      childPositionId: relation.childPositionId,
      createdAt: relation.createdAt,
    });
  }
}
