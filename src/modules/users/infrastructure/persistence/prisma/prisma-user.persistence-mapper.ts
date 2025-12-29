import { User as PrismaUser, users_status } from '@prisma/client';
import { CreateUserData, UpdateUserData, User, UserStatus } from '../../../domain/model/user';

export class PrismaUserPersistenceMapper {
  static toDomain(prisma: PrismaUser): User {
    return User.fromPersistence({
      id: prisma.id,
      firstName: prisma.firstName,
      secondName: prisma.secondName,
      lastName: prisma.lastName,
      fullName: prisma.fullName,
      email: prisma.email,
      passwordHash: prisma.passwordHash,
      status: prisma.status as unknown as UserStatus,
      positionId: prisma.positionId,
      teamId: prisma.teamId,
      managerId: prisma.managerId,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    });
  }

  static toPrismaCreate(data: CreateUserData) {
    return {
      firstName: data.firstName,
      secondName: data.secondName,
      lastName: data.lastName,
      fullName: data.fullName,
      email: data.email,
      passwordHash: data.passwordHash,
      positionId: data.positionId,
      teamId: data.teamId,
      managerId: data.managerId,
      ...(data.status ? { status: data.status as unknown as users_status } : {}),
    };
  }

  static toPrismaUpdate(data: UpdateUserData) {
    return {
      ...(data.firstName !== undefined ? { firstName: data.firstName } : {}),
      ...(data.secondName !== undefined ? { secondName: data.secondName } : {}),
      ...(data.lastName !== undefined ? { lastName: data.lastName } : {}),
      ...(data.fullName !== undefined ? { fullName: data.fullName } : {}),
      ...(data.passwordHash !== undefined ? { passwordHash: data.passwordHash } : {}),
      ...(data.positionId !== undefined ? { positionId: data.positionId } : {}),
      ...(data.teamId !== undefined ? { teamId: data.teamId } : {}),
      ...(data.managerId !== undefined ? { managerId: data.managerId } : {}),
      ...(data.status !== undefined ? { status: data.status as unknown as users_status } : {}),
    };
  }
}


