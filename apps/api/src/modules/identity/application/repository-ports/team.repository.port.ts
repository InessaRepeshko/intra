import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { TeamSortField } from '../../domain/team/team-sort-field.enum';
import { TeamDomain } from '../../domain/team/team.domain';

export const TEAM_REPOSITORY = Symbol('IDENTITY.TEAM_REPOSITORY');

export type TeamSearchQuery = {
  skip?: number;
  take?: number;
  title?: string;
  description?: string;
  search?: string;
  headId?: number;
  memberId?: number;
  sortBy?: TeamSortField;
  sortDirection?: SortDirection;
};

export type TeamSearchResult = {
  items: TeamDomain[];
  count: number;
  total: number;
};

export interface TeamRepositoryPort {
  create(team: TeamDomain): Promise<TeamDomain>;
  findAll(): Promise<TeamDomain[]>;
  search(query?: TeamSearchQuery): Promise<TeamSearchResult>;
  findById(id: number): Promise<TeamDomain | null>;
  updateById(id: number, patch: Partial<TeamDomain>): Promise<TeamDomain>;
  deleteById(id: number): Promise<void>;
}


