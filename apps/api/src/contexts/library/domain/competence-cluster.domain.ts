export type CompetenceClusterProps = {
  id?: number;
  cycleId?: number | null;
  competenceId: number;
  lowerBound: number;
  upperBound: number;
  minScore: number;
  maxScore: number;
  averageScore: number;
  employeesCount: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export class CompetenceClusterDomain {
  readonly id?: number;
  readonly cycleId: number | null;
  readonly competenceId: number;
  readonly lowerBound: number;
  readonly upperBound: number;
  readonly minScore: number;
  readonly maxScore: number;
  readonly averageScore: number;
  readonly employeesCount: number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: CompetenceClusterProps) {
    this.id = props.id;
    this.cycleId = props.cycleId ?? null;
    this.competenceId = props.competenceId;
    this.lowerBound = props.lowerBound;
    this.upperBound = props.upperBound;
    this.minScore = props.minScore;
    this.maxScore = props.maxScore;
    this.averageScore = props.averageScore;
    this.employeesCount = props.employeesCount;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: CompetenceClusterProps): CompetenceClusterDomain {
    return new CompetenceClusterDomain(props);
  }
}

