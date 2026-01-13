import { OrgUserDomain } from './user.domain';

export class TeamDomain {
  readonly id?: number;
  readonly title: string;
  readonly description: string | null;
  readonly headId: number | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly head?: OrgUserDomain;
  readonly members?: OrgUserDomain[];

  constructor(props: {
    id?: number;
    title: string;
    description: string | null;
    headId: number | null;
    createdAt?: Date;
    updatedAt?: Date;
    head?: OrgUserDomain;
    members?: OrgUserDomain[];
  }) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.headId = props.headId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.head = props.head;
    this.members = props.members;
  }
}

