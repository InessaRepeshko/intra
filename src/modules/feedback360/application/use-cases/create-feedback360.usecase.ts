import { Inject, Injectable } from '@nestjs/common';
import { Feedback360Repository } from '../../domain/repositories/feedback360.repository';
import { FEEDBACK360_REPOSITORY } from '../../domain/repositories/feedback360.repository.token';
import { CreateFeedback360Request } from './create-feedback360.request';
import { CreateFeedback360Data, Feedback360 } from '../../domain/model/feedback360';

@Injectable()
export class CreateFeedback360UseCase {
  constructor(@Inject(FEEDBACK360_REPOSITORY) private readonly repo: Feedback360Repository) {}

  async execute(req: CreateFeedback360Request): Promise<Feedback360> {
    const data: CreateFeedback360Data = {
      rateeId: req.rateeId,
      rateeNote: req.rateeNote ?? null,
      positionId: req.positionId,
      hrId: req.hrId,
      hrNote: req.hrNote ?? null,
      cycleId: req.cycleId ?? null,
      stage: (req.stage as unknown as CreateFeedback360Data['stage']) ?? Feedback360.defaultStage(),
      reportId: req.reportId ?? null,
    };

    return this.repo.create(data);
  }
}


