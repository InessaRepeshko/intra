import { PositionHierarchyDomain } from '../../domain/position-hierarchy.domain';

export const ORG_POSITION_HIERARCHY_REPOSITORY = Symbol('ORG_STRUCTURE.POSITION_HIERARCHY_REPOSITORY');

export interface PositionHierarchyRepositoryPort {
  link(parentPositionId: number, childPositionId: number): Promise<PositionHierarchyDomain>;
  unlink(parentPositionId: number, childPositionId: number): Promise<void>;
  listChildren(parentPositionId: number): Promise<PositionHierarchyDomain[]>;
  listParents(childPositionId: number): Promise<PositionHierarchyDomain[]>;
}
