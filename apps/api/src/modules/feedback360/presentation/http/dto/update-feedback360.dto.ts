import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateFeedback360Dto } from './create-feedback360.dto';

export class UpdateFeedback360Dto extends PartialType(
    OmitType(CreateFeedback360Dto, ['rateeId', 'positionId', 'hrId', 'cycleId', 'reportId'] as const)
) {}
