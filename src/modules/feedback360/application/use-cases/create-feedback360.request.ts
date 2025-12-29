import { feedback360_stage } from '@prisma/client';

export type CreateFeedback360Request = {
  rateeId: number;
  rateeNote?: string | null;
  positionId: number;
  hrId: number;
  hrNote?: string | null;
  cycleId?: number | null;
  stage?: feedback360_stage;
  reportId?: number | null;
};


