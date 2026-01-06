import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFeedback360RespondentRelationDto } from './create-feedback360-respondent-relation.dto';

export class UpdateFeedback360RespondentRelationDto extends PartialType(
  OmitType(CreateFeedback360RespondentRelationDto, ['feedback360Id', 'respondentId'] as const),
) {}


