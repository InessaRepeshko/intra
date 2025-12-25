/**
 * Domain-модель команди (не Prisma і не API-Entity).
 * Містить тільки бізнес-поля, без технічних createdAt/updatedAt.
 */
export class TeamDomain {
  constructor(
    public readonly title: string,
    public readonly description: string | null,
    public readonly headId: number | null,
  ) {}
}


