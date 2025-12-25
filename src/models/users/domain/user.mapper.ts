import { Prisma } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDomain } from './user.domain';

export class UserMapper {
  static fromCreateDto(dto: CreateUserDto, passwordHash: string): UserDomain {
    const secondName = dto.secondName ?? null;
    const fullName = [dto.firstName, secondName, dto.lastName].filter(Boolean).join(' ') || null;

    return new UserDomain(
      dto.firstName,
      secondName,
      dto.lastName,
      fullName,
      dto.email,
      passwordHash,
      dto.positionId,
      dto.teamId,
      dto.managerId ?? null,
    );
  }

  static fromUpdateDto(dto: UpdateUserDto): Partial<UserDomain> {
    return {
      firstName: dto.firstName,
      secondName: dto.secondName,
      lastName: dto.lastName,
      positionId: dto.positionId,
      teamId: dto.teamId,
      managerId: dto.managerId,
    };
  }

  static toPrismaCreate(domain: UserDomain): Prisma.UserUncheckedCreateInput {
    return {
      firstName: domain.firstName,
      secondName: domain.secondName,
      lastName: domain.lastName,
      fullName: domain.fullName,
      email: domain.email,
      passwordHash: domain.passwordHash,
      positionId: domain.positionId,
      teamId: domain.teamId,
      managerId: domain.managerId,
    };
  }

  static toPrismaUpdate(domain: Partial<UserDomain>): Prisma.UserUncheckedUpdateInput {
    return {
      ...(domain.firstName !== undefined ? { firstName: domain.firstName } : {}),
      ...(domain.secondName !== undefined ? { secondName: domain.secondName } : {}),
      ...(domain.lastName !== undefined ? { lastName: domain.lastName } : {}),
      ...(domain.fullName !== undefined ? { fullName: domain.fullName } : {}),
      ...(domain.positionId !== undefined ? { positionId: domain.positionId } : {}),
      ...(domain.teamId !== undefined ? { teamId: domain.teamId } : {}),
      ...(domain.managerId !== undefined ? { managerId: domain.managerId } : {}),
    };
  }
}


