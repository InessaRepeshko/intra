export type PositionHierarchyProps = {
  id?: number;
  parentPositionId: number;
  childPositionId: number;
  createdAt?: Date;
};

export class PositionHierarchyDomain {
  readonly id?: number;
  readonly parentPositionId: number;
  readonly childPositionId: number;
  readonly createdAt?: Date;

  private constructor(props: PositionHierarchyProps) {
    this.id = props.id;
    this.parentPositionId = props.parentPositionId;
    this.childPositionId = props.childPositionId;
    this.createdAt = props.createdAt;
  }

  static create(props: PositionHierarchyProps): PositionHierarchyDomain {
    return new PositionHierarchyDomain(props);
  }
}
