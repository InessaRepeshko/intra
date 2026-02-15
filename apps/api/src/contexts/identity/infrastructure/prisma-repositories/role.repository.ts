<<<<<<< HEAD
import { IdentityRole } from '@intra/shared-kernel';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RoleRepositoryPort } from '../../application/ports/role.repository.port';
import { RoleMapper } from '../mappers/role.mapper';

@Injectable()
export class RoleRepository implements RoleRepositoryPort {
    constructor(private readonly prisma: PrismaService) {}

    async getAll() {
        const roles = await this.prisma.role.findMany({
            orderBy: { code: 'asc' },
        });
        return roles.map(RoleMapper.toDomain);
    }

    async findByCodes(codes: IdentityRole[]) {
        if (!codes.length) return [];
        const roles = await this.prisma.role.findMany({
            where: { code: { in: codes } },
        });
        return roles.map(RoleMapper.toDomain);
    }
}
=======
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { RoleRepositoryPort } from '../../application/ports/role.repository.port';
import { IdentityMapper } from './identity.mapper';
import { IdentityRole } from '../../domain/identity-role.enum';

@Injectable()
export class RoleRepository implements RoleRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const roles = await this.prisma.role.findMany({ orderBy: { code: 'asc' } });
    return roles.map(IdentityMapper.toRoleDomain);
  }

  async findByCodes(codes: IdentityRole[]) {
    if (!codes.length) return [];
    const roles = await this.prisma.role.findMany({
      where: { code: { in: codes } },
    });
    return roles.map(IdentityMapper.toRoleDomain);
  }
}
>>>>>>> origin/main
