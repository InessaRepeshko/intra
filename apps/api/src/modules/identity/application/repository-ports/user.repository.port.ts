import { UserDomain } from '../../domain/user/user.domain';
import { UsersStatus } from '../../domain/user/users-status.enum';
import { UserSortField } from '../../domain/user/user-sort-field.enum';
import { SortDirection } from '../../domain/user/sort-direction.enum';

export const USER_REPOSITORY = Symbol('IDENTITY.USER_REPOSITORY');

export type UserSearchQuery = {
  skip?: number;
  take?: number;
  email?: string;
  search?: string;
  status?: UsersStatus;
  teamId?: number;
  positionId?: number;
  managerId?: number;
  sortBy?: UserSortField;
  sortDirection?: SortDirection;
};

export type UserSearchResult = {
  items: UserDomain[];
  count: number;
  total: number;
};

export interface UserRepositoryPort {
  create(user: UserDomain): Promise<UserDomain>;
  findAll(): Promise<UserDomain[]>;
  search(query?: UserSearchQuery): Promise<UserSearchResult>;
  findById(id: number): Promise<UserDomain | null>;
  updateById(id: number, patch: Partial<UserDomain>): Promise<UserDomain>;
  deleteById(id: number): Promise<void>;
}


