import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalBool, ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionSortField } from 'src/contexts/feedback360/application/ports/question.repository.port';
import { SortDirection } from '@intra/shared-kernel';
import { QUESTION_CONSTRAINTS } from '@intra/shared-kernel';

export class QuestionQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Filter by cycle id', type: 'number' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  cycleId?: number;

  @ApiPropertyOptional({ example: 3, description: 'Filter by question template id', type: 'number' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  questionTemplateId?: number;

  @ApiPropertyOptional({ example: 'Listens actively before responding.', description: 'Filter by question title (contains, case-insensitive)', type: 'string', minimum: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN, maximum: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX })
  @ToOptionalTrimmedString({ min: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN, max: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN)
  @MaxLength(QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX)
  title?: string;

  @ApiPropertyOptional({ example: 2, description: 'Filter by competence id', type: 'number' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  competenceId?: number;

  @ApiPropertyOptional({ enum: AnswerType, example: AnswerType.NUMERICAL_SCALE, description: 'Filter by answer type', type: 'string' })
  @ToOptionalEnum(AnswerType)
  @IsOptional()
  @IsEnum(AnswerType)
  answerType?: AnswerType;

  @ApiPropertyOptional({ example: false, description: 'Filter by is for selfassessment', type: 'boolean' })
  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  isForSelfassessment?: boolean;

  @ApiPropertyOptional({ enum: QuestionSortField, example: QuestionSortField.TITLE, description: 'Sort by field', default: QuestionSortField.ID, type: 'string' })
  @ToOptionalEnum(QuestionSortField)
  @IsOptional()
  @IsEnum(QuestionSortField)
  sortBy?: QuestionSortField;

  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.DESC, description: 'Sort direction', default: SortDirection.ASC, type: 'string' })
  @ToOptionalEnum(SortDirection)
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
