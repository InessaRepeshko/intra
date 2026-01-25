export type ClusterProps = {
  id?: number;
  competenceId: number;
  lowerBound: number;
  upperBound: number;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class ClusterDomain {
  readonly id?: number;
  readonly competenceId: number;
  readonly lowerBound: number;
  readonly upperBound: number;
  readonly title: string;
  readonly description: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: ClusterProps) {
    this.id = props.id;
    this.competenceId = props.competenceId;
    this.lowerBound = props.lowerBound;
    this.upperBound = props.upperBound;
    this.title = props.title;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: ClusterProps): ClusterDomain {
    return new ClusterDomain(props);
  }
}
