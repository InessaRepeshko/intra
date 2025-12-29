import { feedback360_stage, Prisma } from '@prisma/client';
import { CreateFeedback360Dto } from '../dto/create-feedback360.dto';
import { UpdateFeedback360Dto } from '../dto/update-feedback360.dto';
import { Feedback360Domain } from './feedback360.domain';

export class Feedback360Mapper {
  static fromCreateDto(dto: CreateFeedback360Dto): Feedback360Domain {
    return new Feedback360Domain(
      dto.rateeId,
      dto.rateeNote ?? null,
      dto.positionId,
      dto.hrId,
      dto.hrNote ?? null,
      dto.cycleId ?? null,
      dto.stage ?? feedback360_stage.VERIFICATION_BY_HR,
      dto.reportId ?? null,
    );
  }

  static fromUpdateDto(dto: UpdateFeedback360Dto): Partial<Feedback360Domain> {
    return {
      rateeNote: dto.rateeNote,
      hrNote: dto.hrNote,
      stage: dto.stage,
    };
  }

  static toPrismaCreate(domain: Feedback360Domain): Prisma.Feedback360UncheckedCreateInput {
    return {
      rateeId: domain.rateeId,
      rateeNote: domain.rateeNote,
      positionId: domain.positionId,
      hrId: domain.hrId,
      hrNote: domain.hrNote,
      cycleId: domain.cycleId,
      stage: domain.stage,
      reportId: domain.reportId,
    };
  }

  static toPrismaUpdate(domain: Partial<Feedback360Domain>): Prisma.Feedback360UncheckedUpdateInput {
    return {
      ...(domain.rateeNote !== undefined ? { rateeNote: domain.rateeNote } : {}),
      ...(domain.hrNote !== undefined ? { hrNote: domain.hrNote } : {}),
      ...(domain.stage !== undefined ? { stage: domain.stage } : {}),
    };
  }
}


