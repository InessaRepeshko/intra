import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ToOptionalBool, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateStatus } from '@intra/shared-kernel';
import { QUESTION_TEMPLATE_CONSTRAINTS } from '@intra/shared-kernel';

export class CreateQuestionTemplateDto {
  @ApiProperty({ description: 'Competence id the question template belongs to', example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  competenceId!: number;

  @ApiProperty({
    description: 'Question template text/title',
    example: 'Delivers features on time',
    minLength: QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MIN,
    maxLength: QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MAX,
  })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MinLength(QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MIN)
  @MaxLength(QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MAX)
  title!: string;

  @ApiProperty({ enum: AnswerType, example: AnswerType.NUMERICAL_SCALE })
  @IsEnum(AnswerType)
  answerType!: AnswerType;

  @ApiPropertyOptional({ description: 'Is this question template for self assessment', example: false, default: false })
  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  isForSelfassessment?: boolean;

  @ApiPropertyOptional({ enum: QuestionTemplateStatus, example: QuestionTemplateStatus.ACTIVE, default: QuestionTemplateStatus.ACTIVE })
  @IsOptional()
  @IsEnum(QuestionTemplateStatus)
  status?: QuestionTemplateStatus;

  @ApiPropertyOptional({ description: 'Positions this question template is linked to', type: [Number], example: [1, 2] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  positionIds?: number[];
}

