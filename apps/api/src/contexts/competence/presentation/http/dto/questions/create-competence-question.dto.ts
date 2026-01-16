import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { ToOptionalBool, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { CompetenceQuestionAnswerType } from 'src/contexts/competence/domain/competence-question-answer-type.enum';
import { CompetenceQuestionStatus } from 'src/contexts/competence/domain/competence-question-status.enum';
import { CompetenceQuestionConstants } from 'src/common/validators/constants';

export class CreateCompetenceQuestionDto {
  @ApiProperty({ description: 'Competence id the question belongs to', example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  competenceId!: number;

  @ApiProperty({
    description: 'Question text/title',
    example: 'Delivers features on time',
    minLength: CompetenceQuestionConstants.TITLE_MIN_LENGTH,
    maxLength: CompetenceQuestionConstants.TITLE_MAX_LENGTH,
  })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MinLength(CompetenceQuestionConstants.TITLE_MIN_LENGTH)
  @MaxLength(CompetenceQuestionConstants.TITLE_MAX_LENGTH)
  title!: string;

  @ApiProperty({ enum: CompetenceQuestionAnswerType, example: CompetenceQuestionAnswerType.NUMERICAL_SCALE })
  @IsEnum(CompetenceQuestionAnswerType)
  answerType!: CompetenceQuestionAnswerType;

  @ApiPropertyOptional({ description: 'Is this question for self assessment', example: false, default: false })
  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  isForSelfassessment?: boolean;

  @ApiPropertyOptional({ enum: CompetenceQuestionStatus, example: CompetenceQuestionStatus.ACTIVE, default: CompetenceQuestionStatus.ACTIVE })
  @IsOptional()
  @IsEnum(CompetenceQuestionStatus)
  questionStatus?: CompetenceQuestionStatus;

  @ApiPropertyOptional({ description: 'Positions this question is linked to', type: [Number], example: [1, 2] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  positionIds?: number[];
}

