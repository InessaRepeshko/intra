import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class AttachQuestionTemplateCompetenceDto {
  @ApiProperty({ description: 'Question template id to link', example: 3 })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  questionTemplateId!: number;
}
