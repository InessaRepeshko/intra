import { UserDomain } from '../../../domain/user/user.domain';
import { User } from '../models/user.entity';
import { UserWithRelations } from '../models/user-with-relations.entity';
import { PositionHttpMapper } from './position.http.mapper';
import { TeamHttpMapper } from './team.http.mapper';

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

  static fromDomainWithRelations(domain: UserDomain): UserWithRelations {
    const entity = new UserWithRelations();
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
      position: domain.position ? PositionHttpMapper.fromDomain(domain.position) : undefined,
      team: domain.team ? TeamHttpMapper.fromDomain(domain.team) : undefined,
      manager: domain.manager ? UserHttpMapper.fromDomain(domain.manager) : undefined,
      subordinates: domain.subordinates?.map((s) => UserHttpMapper.fromDomain(s)),
      teamsLed: domain.teamsLed?.map((t) => TeamHttpMapper.fromDomain(t)),
    });
    return entity;
  }
}


