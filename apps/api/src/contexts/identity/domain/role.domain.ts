import { IdentityRole } from '@intra/shared-kernel';

export class RoleDomain {
  readonly id?: number;
  readonly code: IdentityRole;
  readonly title: string;
  readonly description?: string | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  constructor(props: {
    id?: number;
    code: IdentityRole;
    title: string;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = props.id;
    this.code = props.code;
    this.title = props.title;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
