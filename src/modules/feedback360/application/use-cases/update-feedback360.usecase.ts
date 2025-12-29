import { Inject, Injectable } from '@nestjs/common';
import { Feedback360Repository } from '../../domain/repositories/feedback360.repository';
import { FEEDBACK360_REPOSITORY } from '../../domain/repositories/feedback360.repository.token';
import { UpdateFeedback360Request } from './update-feedback360.request';
import { Feedback360NotFoundError } from '../../domain/errors/feedback360-not-found.error';
import { Feedback360, UpdateFeedback360Data } from '../../domain/model/feedback360';

@Injectable()
export class UpdateFeedback360UseCase {
  constructor(@Inject(FEEDBACK360_REPOSITORY) private readonly repo: Feedback360Repository) {}

  async execute(id: number, req: UpdateFeedback360Request): Promise<Feedback360> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Feedback360NotFoundError(id);

    const patch: UpdateFeedback360Data = {
      ...(req.rateeNote !== undefined ? { rateeNote: req.rateeNote } : {}),
      ...(req.hrNote !== undefined ? { hrNote: req.hrNote } : {}),
      ...(req.stage !== undefined ? { stage: req.stage as unknown as UpdateFeedback360Data['stage'] } : {}),
    };

    return this.repo.updateById(id, patch);
  }
}


