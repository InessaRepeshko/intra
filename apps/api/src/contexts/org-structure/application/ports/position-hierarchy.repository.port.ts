import { PositionHierarchyDomain } from '../../domain/position-hierarchy.domain';

export const ORG_POSITION_HIERARCHY_REPOSITORY = Symbol('ORG_STRUCTURE.POSITION_HIERARCHY_REPOSITORY');

export interface PositionHierarchyRepositoryPort {
  link(superiorPositionId: number, subordinatePositionId: number): Promise<PositionHierarchyDomain>;
  unlink(superiorPositionId: number, subordinatePositionId: number): Promise<void>;
  listSubordinates(superiorPositionId: number): Promise<PositionHierarchyDomain[]>;
  listSuperiors(subordinatePositionId: number): Promise<PositionHierarchyDomain[]>;
}
