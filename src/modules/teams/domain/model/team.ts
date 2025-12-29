export type CreateTeamData = {
  title: string;
  description: string | null;
  headId: number | null;
};

export type UpdateTeamData = Partial<{
  title: string;
  description: string | null;
  headId: number | null;
}>;

export type TeamProps = {
  id: number;
  title: string;
  description: string | null;
  headId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export class Team {
  private props: TeamProps;

  private constructor(props: TeamProps) {
    Team.assertProps(props);
    this.props = { ...props };
  }

  get id() {
    return this.props.id;
  }
  get title() {
    return this.props.title;
  }
  get description() {
    return this.props.description;
  }
  get headId() {
    return this.props.headId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  static fromPersistence(props: TeamProps): Team {
    return new Team(props);
  }

  applyUpdate(patch: UpdateTeamData): void {
    if (patch.title !== undefined) this.props.title = patch.title;
    if (patch.description !== undefined) this.props.description = patch.description;
    if (patch.headId !== undefined) this.props.headId = patch.headId;
    Team.assertProps(this.props);
  }

  toPrimitives(): TeamProps {
    return { ...this.props };
  }

  private static assertProps(props: TeamProps) {
    if (!Number.isInteger(props.id) || props.id <= 0) throw new Error('Team.id must be a positive integer');
    if (!props.title?.trim()) throw new Error('Team.title is required');
    if (props.description !== null && props.description !== undefined && typeof props.description !== 'string') {
      throw new Error('Team.description must be null or string');
    }
    if (props.headId !== null && (!Number.isInteger(props.headId) || props.headId <= 0)) {
      throw new Error('Team.headId must be null or a positive integer');
    }
    if (!props.createdAt || !(props.createdAt instanceof Date)) throw new Error('Team.createdAt is required');
    if (!props.updatedAt || !(props.updatedAt instanceof Date)) throw new Error('Team.updatedAt is required');
  }
}


