import { Inject, Injectable } from '@nestjs/common';
import type { RoleRepositoryPort } from '../ports/role.repository.port';
import { IDENTITY_ROLE_REPOSITORY } from '../ports/role.repository.port';
import { RoleDomain } from '../../domain/role.domain';
import { IdentityRole } from '../../domain/enums/identity-role.enum';

@Injectable()
export class IdentityRoleService {
  constructor(
    @Inject(IDENTITY_ROLE_REPOSITORY) private readonly roles: RoleRepositoryPort,
  ) { }

  async list(): Promise<RoleDomain[]> {
    return this.roles.getAll();
  }

  async getByCodes(codes: IdentityRole[]): Promise<RoleDomain[]> {
    return this.roles.findByCodes(codes);
  }
}
