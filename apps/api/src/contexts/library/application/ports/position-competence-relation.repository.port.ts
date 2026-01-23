import { PositionCompetenceRelationDomain } from '../../domain/position-competence-relation.domain';

export const POSITION_COMPETENCE_RELATION_REPOSITORY = Symbol('LIBRARY.POSITION_COMPETENCE_RELATION_REPOSITORY');

export interface PositionCompetenceRelationRepositoryPort {
  link(competenceId: number, positionId: number): Promise<PositionCompetenceRelationDomain>;
  unlink(competenceId: number, positionId: number): Promise<void>;
  listByCompetence(competenceId: number): Promise<PositionCompetenceRelationDomain[]>;
  listByPosition(positionId: number): Promise<PositionCompetenceRelationDomain[]>;
  replaceForCompetence(competenceId: number, positionIds: number[]): Promise<PositionCompetenceRelationDomain[]>;
}
