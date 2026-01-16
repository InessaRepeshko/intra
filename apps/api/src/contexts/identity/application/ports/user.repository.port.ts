import { IdentityRole } from '../../domain/identity-role.enum';
import { IdentityUserStatus } from '../../domain/identity-user-status.enum';
import { UserDomain } from '../../domain/user.domain';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export const IDENTITY_USER_REPOSITORY = Symbol('IDENTITY.USER_REPOSITORY');

export enum UserSortField {
  ID = 'id',
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  FULL_NAME = 'fullName',
  EMAIL = 'email',
  STATUS = 'status',
  POSITION_ID = 'positionId',
  TEAM_ID = 'teamId',
  MANAGER_ID = 'managerId',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export type UserSearchQuery = {
  search?: string;
  email?: string;
  status?: IdentityUserStatus;
  teamId?: number;
  positionId?: number;
  managerId?: number;
  sortBy?: UserSortField;
  sortDirection?: SortDirection;
};

export type UserUpdatePayload = Partial<{
  firstName: string;
  secondName: string | null;
  lastName: string;
  fullName: string | null;
  passwordHash: string;
  status: IdentityUserStatus;
  positionId: number | null;
  teamId: number | null;
  managerId: number | null;
}>;

export interface UserRepositoryPort {
  create(user: UserDomain): Promise<UserDomain>;
  findById(id: number, opts?: { withRoles?: boolean }): Promise<UserDomain | null>;
  search(query: UserSearchQuery): Promise<UserDomain[]>;
  updateById(id: number, patch: UserUpdatePayload): Promise<UserDomain>;
  deleteById(id: number): Promise<void>;
  replaceRoles(userId: number, roles: IdentityRole[]): Promise<UserDomain>;
}
