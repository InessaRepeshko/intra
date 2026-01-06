import { Injectable } from '@nestjs/common';
import { Prisma, User as PrismaUser, users_status } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRepositoryPort, UserSearchQuery, UserSearchResult } from '../../application/repository-ports/user.repository.port';
import { UserDomain } from '../../domain/user/user.domain';
import { UsersStatus } from '../../domain/user/users-status.enum';
import { UserSortField } from '../../domain/user/user-sort-field.enum';
import { SortDirection } from '../../domain/user/sort-direction.enum';
import { PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE } from 'src/common/constants/pagination.constants';

@Injectable()
export class UserPrismaRepository implements UserRepositoryPort {
  constructor(private readonly db: PrismaService) {}

  async create(user: UserDomain): Promise<UserDomain> {
    const created = await this.db.user.create({ data: this.toPrismaCreate(user) });
    return this.fromPrisma(created);
  }

  async findAll(): Promise<UserDomain[]> {
    const rows = await this.db.user.findMany();
    return rows.map((u) => this.fromPrisma(u));
  }

  async search(query: UserSearchQuery = {}): Promise<UserSearchResult> {
    const take = Math.min(query.take ?? PAGINATION_DEFAULT_TAKE, PAGINATION_MAX_TAKE);
    const skip = query.skip ?? 0;

    const where: Prisma.UserWhereInput = {
      ...(query.status !== undefined ? { status: query.status as users_status } : {}),
      ...(query.teamId !== undefined ? { teamId: query.teamId } : {}),
      ...(query.positionId !== undefined ? { positionId: query.positionId } : {}),
      ...(query.managerId !== undefined ? { managerId: query.managerId } : {}),
      ...(query.email ? { email: { contains: query.email } } : {}),
      ...(query.search
        ? {
            OR: [
              { email: { contains: query.search } },
              { fullName: { contains: query.search } },
              { firstName: { contains: query.search } },
              { secondName: { contains: query.search } },
              { lastName: { contains: query.search } },
            ],
          }
        : {}),
    };

    const sortDirection = query.sortDirection ?? SortDirection.ASC;
    const orderBy = this.buildOrderBy(query.sortBy, sortDirection);

    const [total, rows] = await Promise.all([
      this.db.user.count({ where }),
      this.db.user.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
    ]);

    const items = rows.map((u) => this.fromPrisma(u));
    return { total, count: items.length, items };
  }

  private buildOrderBy(
    sortBy?: UserSortField,
    sortDirection: SortDirection = SortDirection.ASC,
  ): Prisma.UserOrderByWithRelationInput[] {
    if (!sortBy) {
      // Default sorting
      return [{ lastName: 'asc' }, { firstName: 'asc' }, { id: 'asc' }];
    }

    const direction = sortDirection === SortDirection.DESC ? 'desc' : 'asc';

    const orderByMap: Record<UserSortField, Prisma.UserOrderByWithRelationInput> = {
      [UserSortField.ID]: { id: direction },
      [UserSortField.FIRST_NAME]: { firstName: direction },
      [UserSortField.SECOND_NAME]: { secondName: direction },
      [UserSortField.LAST_NAME]: { lastName: direction },
      [UserSortField.FULL_NAME]: { fullName: direction },
      [UserSortField.EMAIL]: { email: direction },
      [UserSortField.STATUS]: { status: direction },
      [UserSortField.POSITION_ID]: { positionId: direction },
      [UserSortField.TEAM_ID]: { teamId: direction },
      [UserSortField.MANAGER_ID]: { managerId: direction },
      [UserSortField.CREATED_AT]: { createdAt: direction },
      [UserSortField.UPDATED_AT]: { updatedAt: direction },
    };

    // Always add id as secondary sort for consistent ordering
    return [orderByMap[sortBy], { id: 'asc' }];
  }

  async findById(id: number): Promise<UserDomain | null> {
    const row = await this.db.user.findUnique({ where: { id } });
    return row ? this.fromPrisma(row) : null;
  }

  async updateById(id: number, patch: Partial<UserDomain>): Promise<UserDomain> {
    const updated = await this.db.user.update({ where: { id }, data: this.toPrismaUpdate(patch) });
    return this.fromPrisma(updated);
  }

  async deleteById(id: number): Promise<void> {
    await this.db.user.delete({ where: { id } });
  }

  private fromPrisma(row: PrismaUser): UserDomain {
    return new UserDomain({
      id: row.id,
      firstName: row.firstName,
      secondName: row.secondName,
      lastName: row.lastName,
      fullName: row.fullName,
      email: row.email,
      passwordHash: row.passwordHash,
      status: row.status as unknown as UsersStatus,
      positionId: row.positionId,
      teamId: row.teamId,
      managerId: row.managerId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private toPrismaCreate(domain: UserDomain): Prisma.UserUncheckedCreateInput {
    return {
      firstName: domain.firstName,
      secondName: domain.secondName,
      lastName: domain.lastName,
      fullName: domain.fullName,
      email: domain.email,
      passwordHash: domain.passwordHash,
      ...(domain.status ? { status: domain.status as unknown as users_status } : {}),
      positionId: domain.positionId,
      teamId: domain.teamId,
      managerId: domain.managerId,
    };
  }

  private toPrismaUpdate(domain: Partial<UserDomain>): Prisma.UserUncheckedUpdateInput {
    return {
      ...(domain.firstName !== undefined ? { firstName: domain.firstName } : {}),
      ...(domain.secondName !== undefined ? { secondName: domain.secondName } : {}),
      ...(domain.lastName !== undefined ? { lastName: domain.lastName } : {}),
      ...(domain.fullName !== undefined ? { fullName: domain.fullName } : {}),
      ...(domain.passwordHash !== undefined ? { passwordHash: domain.passwordHash } : {}),
      ...(domain.status !== undefined ? { status: domain.status as unknown as users_status } : {}),
      ...(domain.positionId !== undefined ? { positionId: domain.positionId } : {}),
      ...(domain.teamId !== undefined ? { teamId: domain.teamId } : {}),
      ...(domain.managerId !== undefined ? { managerId: domain.managerId } : {}),
    };
  }
}


