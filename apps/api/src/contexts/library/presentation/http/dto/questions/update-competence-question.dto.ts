import { PartialType } from '@nestjs/swagger';
import { CreateCompetenceQuestionDto } from './create-competence-question.dto';

export class UpdateCompetenceQuestionDto extends PartialType(CreateCompetenceQuestionDto) {}

