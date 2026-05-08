import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { TeamDomain } from '../../domain/team.domain';
import { TeamMembershipDomain } from '../../domain/team-membership.domain';

export const ORG_TEAM_REPOSITORY = Symbol('ORG_STRUCTURE.TEAM_REPOSITORY');

export enum TeamSortField {
  ID = 'id',
  TITLE = 'title',
  DESCRIPTION = 'description',
  HEAD_ID = 'headId',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type TeamSearchQuery = {
  search?: string;
  headId?: number;
  sortBy?: TeamSortField;
  sortDirection?: SortDirection;
};

export type TeamUpdatePayload = Partial<{
  title: string;
  description: string | null;
  headId: number | null;
}>;

export interface TeamRepositoryPort {
  create(team: TeamDomain): Promise<TeamDomain>;
  findById(id: number): Promise<TeamDomain | null>;
  search(query: TeamSearchQuery): Promise<TeamDomain[]>;
  updateById(id: number, patch: TeamUpdatePayload): Promise<TeamDomain>;
  deleteById(id: number): Promise<void>;
  addMember(teamId: number, userId: number, isPrimary?: boolean | null): Promise<TeamMembershipDomain>;
  removeMember(teamId: number, userId: number): Promise<void>;
  listMembers(teamId: number): Promise<TeamMembershipDomain[]>;
}
