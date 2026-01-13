import { OrgUserDomain } from './user.domain';

export class PositionDomain {
  readonly id?: number;
  readonly title: string;
  readonly description: string | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly users?: OrgUserDomain[];

  constructor(props: {
    id?: number;
    title: string;
    description: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    users?: OrgUserDomain[];
  }) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.users = props.users;
  }
}

