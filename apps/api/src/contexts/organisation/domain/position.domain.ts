export type PositionProps = {
  id?: number;
  title: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class PositionDomain {
  readonly id?: number;
  readonly title: string;
  readonly description: string | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: PositionProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: PositionProps): PositionDomain {
    return new PositionDomain(props);
  }

  withPatch(patch: Partial<PositionProps>): PositionDomain {
    return new PositionDomain({ ...this, ...patch });
  }
}
