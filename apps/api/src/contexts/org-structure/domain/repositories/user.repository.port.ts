import { OrgUserDomain } from '../entities/user.domain';

export const ORG_USER_REPOSITORY = Symbol('ORG_STRUCTURE.USER_REPOSITORY');

export interface OrgUserRepositoryPort {
  findById(id: number): Promise<OrgUserDomain | null>;
}

