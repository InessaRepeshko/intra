import { PartialType } from '@nestjs/swagger';
import { CreateRespondentDto } from './create-respondent.dto';

export class UpdateRespondentDto extends PartialType(CreateRespondentDto) {}
