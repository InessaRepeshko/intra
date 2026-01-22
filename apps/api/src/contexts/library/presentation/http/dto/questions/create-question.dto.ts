import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ToOptionalBool, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionStatus } from '@intra/shared-kernel';
import { QUESTION_CONSTRAINTS } from '@intra/shared-kernel';

export class CreateQuestionDto {
  @ApiProperty({ description: 'Competence id the question belongs to', example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  competenceId!: number;

  @ApiProperty({
    description: 'Question text/title',
    example: 'Delivers features on time',
    minLength: QUESTION_CONSTRAINTS.TITLE.LENGTH.MIN,
    maxLength: QUESTION_CONSTRAINTS.TITLE.LENGTH.MAX,
  })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MinLength(QUESTION_CONSTRAINTS.TITLE.LENGTH.MIN)
  @MaxLength(QUESTION_CONSTRAINTS.TITLE.LENGTH.MAX)
  title!: string;

  @ApiProperty({ enum: AnswerType, example: AnswerType.NUMERICAL_SCALE })
  @IsEnum(AnswerType)
  answerType!: AnswerType;

  @ApiPropertyOptional({ description: 'Is this question for self assessment', example: false, default: false })
  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  isForSelfassessment?: boolean;

  @ApiPropertyOptional({ enum: QuestionStatus, example: QuestionStatus.ACTIVE, default: QuestionStatus.ACTIVE })
  @IsOptional()
  @IsEnum(QuestionStatus)
  questionStatus?: QuestionStatus;

  @ApiPropertyOptional({ description: 'Positions this question is linked to', type: [Number], example: [1, 2] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  positionIds?: number[];
}

