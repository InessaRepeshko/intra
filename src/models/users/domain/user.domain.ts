/**
 * Domain-модель користувача (не Prisma і не API-Entity).
 */
export class UserDomain {
  constructor(
    public readonly firstName: string,
    public readonly secondName: string | null,
    public readonly lastName: string,
    public readonly fullName: string | null,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly positionId: number,
    public readonly teamId: number,
    public readonly managerId: number,
  ) {}
}


