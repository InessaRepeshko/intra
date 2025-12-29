export type UserStatus = 'ACTIVE' | 'INACTIVE';

export type CreateUserData = {
  firstName: string;
  secondName: string | null;
  lastName: string;
  fullName: string | null;
  email: string;
  passwordHash: string;
  positionId: number;
  teamId: number;
  managerId: number | null;
  status?: UserStatus;
};

export type UpdateUserData = Partial<{
  firstName: string;
  secondName: string | null;
  lastName: string;
  fullName: string | null;
  passwordHash: string;
  status: UserStatus;
  positionId: number;
  teamId: number;
  managerId: number | null;
}>;

export type UserProps = {
  id: number;
  firstName: string;
  secondName: string | null;
  lastName: string;
  fullName: string | null;
  email: string;
  passwordHash: string;
  status: UserStatus;
  positionId: number;
  teamId: number;
  managerId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    User.assertProps(props);
    this.props = { ...props, fullName: User.computeFullName(props.firstName, props.secondName, props.lastName) };
  }

  // computed
  get fullName(): string | null {
    return this.props.fullName;
  }

  // identity & fields
  get id() {
    return this.props.id;
  }
  get firstName() {
    return this.props.firstName;
  }
  get secondName() {
    return this.props.secondName;
  }
  get lastName() {
    return this.props.lastName;
  }
  get email() {
    return this.props.email;
  }
  get passwordHash() {
    return this.props.passwordHash;
  }
  get status() {
    return this.props.status;
  }
  get positionId() {
    return this.props.positionId;
  }
  get teamId() {
    return this.props.teamId;
  }
  get managerId() {
    return this.props.managerId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  /**
   * Фабрика для створення доменної сутності з persistence (БД).
   * Domain не знає про Prisma: сюди приходять вже "плоскі" значення.
   */
  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  /**
   * Доменна поведінка: застосувати patch (використовуємо в application перед save/update).
   */
  applyUpdate(patch: UpdateUserData): void {
    if (patch.firstName !== undefined) this.props.firstName = patch.firstName;
    if (patch.secondName !== undefined) this.props.secondName = patch.secondName;
    if (patch.lastName !== undefined) this.props.lastName = patch.lastName;
    if (patch.fullName !== undefined) this.props.fullName = patch.fullName;
    if (patch.passwordHash !== undefined) this.props.passwordHash = patch.passwordHash;
    if (patch.status !== undefined) this.props.status = patch.status;
    if (patch.positionId !== undefined) this.props.positionId = patch.positionId;
    if (patch.teamId !== undefined) this.props.teamId = patch.teamId;
    if (patch.managerId !== undefined) this.props.managerId = patch.managerId;

    const shouldRecomputeFullName =
      patch.firstName !== undefined || patch.secondName !== undefined || patch.lastName !== undefined;
    if (shouldRecomputeFullName) {
      this.props.fullName = User.computeFullName(this.props.firstName, this.props.secondName, this.props.lastName);
    }

    // інваріанти після змін
    User.assertProps(this.props);
  }

  /**
   * Для persistence/transport: повертаємо "плоскі" значення.
   */
  toPrimitives(): UserProps & { fullName: string | null } {
    return { ...this.props, fullName: this.fullName };
  }

  static computeFullName(firstName: string, secondName: string | null, lastName: string): string | null {
    return [firstName, secondName, lastName].filter(Boolean).join(' ') || null;
  }

  private static assertProps(props: UserProps) {
    if (!Number.isInteger(props.id) || props.id <= 0) throw new Error('User.id must be a positive integer');
    if (!props.firstName?.trim()) throw new Error('User.firstName is required');
    if (!props.lastName?.trim()) throw new Error('User.lastName is required');
    if (!props.email?.trim()) throw new Error('User.email is required');
    if (!props.passwordHash?.trim()) throw new Error('User.passwordHash is required');
    if (!Number.isInteger(props.positionId) || props.positionId <= 0) throw new Error('User.positionId must be > 0');
    if (!Number.isInteger(props.teamId) || props.teamId <= 0) throw new Error('User.teamId must be > 0');
    if (props.managerId !== null && (!Number.isInteger(props.managerId) || props.managerId <= 0)) {
      throw new Error('User.managerId must be null or a positive integer');
    }
    // fullName може бути null, але якщо є - не пустий
    if (props.fullName !== null && props.fullName !== undefined && !props.fullName.trim()) {
      throw new Error('User.fullName must be null or a non-empty string');
    }
    if (!props.createdAt || !(props.createdAt instanceof Date)) throw new Error('User.createdAt is required');
    if (!props.updatedAt || !(props.updatedAt instanceof Date)) throw new Error('User.updatedAt is required');
  }
}


