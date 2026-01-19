import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ToOptionalBool, ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { AnswerType } from 'src/contexts/library/domain/enums/answer-type.enum';

export class CreateCycleQuestionDto {
  @ApiPropertyOptional({ example: 1, description: 'Cycle to which the question belongs' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  cycleId?: number;

  @ApiPropertyOptional({ example: 10, description: 'Base question from library (optional)' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  questionId?: number;

  @ApiProperty({ example: 'How do you plan your work?', description: 'Question text' })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  title!: string;

  @ApiProperty({ enum: AnswerType, example: AnswerType.NUMERICAL_SCALE })
  @ToOptionalEnum(AnswerType)
  @IsEnum(AnswerType)
  answerType!: AnswerType;

  @ApiPropertyOptional({ example: 3, description: 'Competence to which the question is linked' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  competenceId?: number;

  @ApiPropertyOptional({ example: 4, description: 'Position to which the question is linked' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  positionId?: number;

  @ApiPropertyOptional({ example: false })
  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  isForSelfassessment?: boolean;
}
