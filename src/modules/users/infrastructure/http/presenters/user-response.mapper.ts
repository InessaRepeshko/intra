import { users_status } from '@prisma/client';
import { User as DomainUser } from '../../../domain/model/user';
import { UserResponse } from './user.response';

export class UserResponseMapper {
  static toResponse(domain: DomainUser): UserResponse {
    return Object.assign(new UserResponse(), {
      id: domain.id,
      firstName: domain.firstName,
      secondName: domain.secondName,
      lastName: domain.lastName,
      fullName: domain.fullName,
      email: domain.email,
      passwordHash: domain.passwordHash,
      status: domain.status as users_status,
      positionId: domain.positionId,
      teamId: domain.teamId,
      managerId: domain.managerId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
  }
}


