import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFeedback360Dto } from './create-feedback360.dto';

export class UpdateFeedback360Dto extends PartialType(
    OmitType(CreateFeedback360Dto, ['rateeId', 'positionId', 'hrId', 'cycleId', 'reportId'] as const)
) {}
