import { feedback360_stage } from '@prisma/client';

/**
 * Domain-модель Feedback360 (не Prisma і не API-Entity).
 */
export class Feedback360Domain {
  constructor(
    public readonly rateeId: number,
    public readonly rateeNote: string | null,
    public readonly positionId: number,
    public readonly hrId: number,
    public readonly hrNote: string | null,
    public readonly cycleId: number | null,
    public readonly stage: feedback360_stage,
    public readonly reportId: number | null,
  ) {}
}


