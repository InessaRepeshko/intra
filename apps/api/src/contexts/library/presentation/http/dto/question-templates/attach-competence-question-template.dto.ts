import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class AttachCompetenceQuestionTemplateDto {
  @ApiProperty({ description: 'Competence id to link', example: 2, type: 'number' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  competenceId!: number;
}
