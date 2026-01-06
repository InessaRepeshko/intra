import { PartialType } from '@nestjs/swagger';
import { CreateFeedback360CycleDto } from './create-feedback360-cycle.dto';

export class UpdateFeedback360CycleDto extends PartialType(CreateFeedback360CycleDto) {}


