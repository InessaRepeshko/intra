import { IdentityRole } from '../../domain/enums/identity-role.enum';
import { RoleDomain } from '../../domain/role.domain';

export const IDENTITY_ROLE_REPOSITORY = Symbol('IDENTITY.ROLE_REPOSITORY');

export interface RoleRepositoryPort {
  getAll(): Promise<RoleDomain[]>;
  findByCodes(codes: IdentityRole[]): Promise<RoleDomain[]>;
}
