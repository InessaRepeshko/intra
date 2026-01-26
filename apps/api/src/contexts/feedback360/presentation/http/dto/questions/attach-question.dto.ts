import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class AttachQuestionDto {
  @ApiProperty({ example: 10, description: 'ID of the question from the library', type: 'number', required: true })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  questionId!: number;
}
