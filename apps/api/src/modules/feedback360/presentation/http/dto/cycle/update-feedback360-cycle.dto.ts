import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedback360CycleDto } from './create-feedback360-cycle.dto';

export class UpdateFeedback360CycleDto extends PartialType(CreateFeedback360CycleDto) {}


