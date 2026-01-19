import { IdentityRole } from './enums/identity-role.enum';
import { IdentityUserStatus } from './enums/identity-user-status.enum';

export type UserProps = {
  id?: number;
  firstName: string;
  secondName?: string | null;
  lastName: string;
  fullName?: string | null;
  email: string;
  passwordHash: string;
  status?: IdentityUserStatus;
  positionId?: number | null;
  teamId?: number | null;
  managerId?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: IdentityRole[];
};

export class UserDomain {
  readonly id?: number;
  readonly firstName: string;
  readonly secondName: string | null;
  readonly lastName: string;
  readonly fullName: string | null;
  readonly email: string;
  readonly passwordHash: string;
  readonly status: IdentityUserStatus;
  readonly positionId: number | null;
  readonly teamId: number | null;
  readonly managerId: number | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly roles: IdentityRole[];

  private constructor(props: UserProps) {
    this.id = props.id;
    this.firstName = props.firstName;
    this.secondName = props.secondName ?? null;
    this.lastName = props.lastName;
    this.fullName = props.fullName ?? UserDomain.buildFullName(props.firstName, props.secondName, props.lastName);
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.status = props.status ?? IdentityUserStatus.ACTIVE;
    this.positionId = props.positionId ?? null;
    this.teamId = props.teamId ?? null;
    this.managerId = props.managerId ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.roles = props.roles ?? [];
  }

  static create(props: UserProps): UserDomain {
    return new UserDomain(props);
  }

  withRoles(roles: IdentityRole[]): UserDomain {
    return new UserDomain({ ...this, roles });
  }

  withPatch(patch: Partial<UserProps>): UserDomain {
    return new UserDomain({ ...this, ...patch });
  }

  private static buildFullName(firstName: string, secondName: string | null | undefined, lastName: string): string | null {
    const parts = [firstName, secondName ?? undefined, lastName].filter(Boolean);
    return parts.length ? parts.join(' ') : null;
  }
}
