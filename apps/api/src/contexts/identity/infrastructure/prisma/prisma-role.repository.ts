import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleRepositoryPort } from '../../application/ports/role.repository.port';
import { PrismaIdentityMapper } from './prisma-identity.mapper';
import { IdentityRole } from '../../domain/identity-role.enum';

@Injectable()
export class PrismaRoleRepository implements RoleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const roles = await this.prisma.role.findMany({ orderBy: { code: 'asc' } });
    return roles.map(PrismaIdentityMapper.toRoleDomain);
  }

  async findByCodes(codes: IdentityRole[]) {
    if (!codes.length) return [];
    const roles = await this.prisma.role.findMany({
      where: { code: { in: codes } },
    });
    return roles.map(PrismaIdentityMapper.toRoleDomain);
  }
}
