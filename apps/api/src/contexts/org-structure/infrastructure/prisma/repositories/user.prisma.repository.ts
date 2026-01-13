import { Injectable } from '@nestjs/common';
import { users_status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrgUserDomain } from '../../../domain/entities/user.domain';
import { UsersStatus } from '../../../domain/value-objects/users-status.enum';
import { OrgUserRepositoryPort } from '../../../domain/repositories/user.repository.port';

@Injectable()
export class OrgUserPrismaRepository implements OrgUserRepositoryPort {
  constructor(private readonly db: PrismaService) {}

  async findById(id: number): Promise<OrgUserDomain | null> {
    const row = await this.db.user.findUnique({ where: { id } });
    if (!row) return null;

    return new OrgUserDomain({
      id: row.id,
      firstName: row.firstName,
      secondName: row.secondName,
      lastName: row.lastName,
      fullName: row.fullName,
      email: row.email,
      passwordHash: row.passwordHash,
      status: row.status as users_status | UsersStatus,
      positionId: row.positionId,
      teamId: row.teamId,
      managerId: row.managerId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

