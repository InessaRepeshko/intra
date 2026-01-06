import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateFeedback360ReviewerRelationDto } from './create-feedback360-reviewer-relation.dto';

export class UpdateFeedback360ReviewerRelationDto extends PartialType(CreateFeedback360ReviewerRelationDto) {}

