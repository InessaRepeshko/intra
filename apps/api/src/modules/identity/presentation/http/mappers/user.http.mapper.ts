import { UserDomain } from '../../../domain/user/user.domain';
import { User } from '../models/user.entity';

export class UserHttpMapper {
  static fromDomain(domain: UserDomain): User {
    const entity = new User();
    Object.assign(entity, {
      id: domain.id,
      firstName: domain.firstName,
      secondName: domain.secondName,
      lastName: domain.lastName,
      fullName: domain.fullName,
      email: domain.email,
      passwordHash: domain.passwordHash,
      status: domain.status,
      positionId: domain.positionId,
      teamId: domain.teamId,
      managerId: domain.managerId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
    return entity;
  }
}


