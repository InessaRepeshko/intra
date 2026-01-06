import { OmitType } from '@nestjs/swagger';
import { Feedback360 } from '../models/feedback360.entity';
export class Feedback360ResponseDto extends OmitType(Feedback360, ['reportId'] as const) {}