/**
 * Domain-модель команди (не Prisma і не API-Entity).
 */
export class TeamDomain {
  readonly id?: number;
  readonly title: string;
  readonly description: string | null;
  readonly headId: number | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: {
    id?: number;
    title: string;
    description: string | null;
    headId: number | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.headId = props.headId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}


