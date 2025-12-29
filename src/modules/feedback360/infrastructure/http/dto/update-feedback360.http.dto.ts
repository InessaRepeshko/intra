import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFeedback360HttpDto } from './create-feedback360.http.dto';

export class UpdateFeedback360HttpDto extends PartialType(
  OmitType(CreateFeedback360HttpDto, ['rateeId', 'positionId', 'hrId', 'cycleId', 'reportId'] as const),
) {}


