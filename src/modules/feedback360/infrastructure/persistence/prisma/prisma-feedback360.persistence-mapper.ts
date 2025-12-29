import { Feedback360 as PrismaFeedback360, feedback360_stage } from '@prisma/client';
import {
  CreateFeedback360Data,
  Feedback360,
  Feedback360Props,
  UpdateFeedback360Data,
} from '../../../domain/model/feedback360';

export class PrismaFeedback360PersistenceMapper {
  static toDomain(prisma: PrismaFeedback360): Feedback360 {
    const props: Feedback360Props = {
      id: prisma.id,
      rateeId: prisma.rateeId,
      rateeNote: prisma.rateeNote,
      positionId: prisma.positionId,
      hrId: prisma.hrId,
      hrNote: prisma.hrNote,
      cycleId: prisma.cycleId,
      stage: prisma.stage as unknown as Feedback360Props['stage'],
      reportId: prisma.reportId,
      createdAt: prisma.createdAt,
      updatedAt: prisma.updatedAt,
    };
    return Feedback360.fromPersistence(props);
  }

  static toPrismaCreate(data: CreateFeedback360Data) {
    return {
      rateeId: data.rateeId,
      rateeNote: data.rateeNote,
      positionId: data.positionId,
      hrId: data.hrId,
      hrNote: data.hrNote,
      cycleId: data.cycleId,
      stage: data.stage as unknown as feedback360_stage,
      reportId: data.reportId,
    };
  }

  static toPrismaUpdate(data: UpdateFeedback360Data) {
    return {
      ...(data.rateeNote !== undefined ? { rateeNote: data.rateeNote } : {}),
      ...(data.hrNote !== undefined ? { hrNote: data.hrNote } : {}),
      ...(data.stage !== undefined ? { stage: data.stage as unknown as feedback360_stage } : {}),
    };
  }
}


