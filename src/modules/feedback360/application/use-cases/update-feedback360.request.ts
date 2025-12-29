import { feedback360_stage } from '@prisma/client';

export type UpdateFeedback360Request = {
  rateeNote?: string | null;
  hrNote?: string | null;
  stage?: feedback360_stage;
};


