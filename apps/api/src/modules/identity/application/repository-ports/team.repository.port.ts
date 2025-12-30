import { TeamDomain } from '../../domain/team/team.domain';

/**
 * Порт репозиторію команд (application -> infrastructure).
 *
 * Без Prisma/NestJS типів.
 */
export const TEAM_REPOSITORY = Symbol('IDENTITY.TEAM_REPOSITORY');

export interface TeamRepositoryPort {
  create(team: TeamDomain): Promise<TeamDomain>;
  findAll(): Promise<TeamDomain[]>;
  findById(id: number): Promise<TeamDomain | null>;
  findByHeadId(headId: number): Promise<TeamDomain[]>;
  findByMemberId(memberId: number): Promise<TeamDomain[]>;
  updateById(id: number, patch: Partial<TeamDomain>): Promise<TeamDomain>;
  deleteById(id: number): Promise<void>;
}


