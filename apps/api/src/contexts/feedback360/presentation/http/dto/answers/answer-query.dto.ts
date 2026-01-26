import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { RespondentCategory } from '@intra/shared-kernel';
import { AnswerSortField } from 'src/contexts/feedback360/application/ports/answer.repository.port';
import { SortDirection } from '@intra/shared-kernel';
import { AnswerType } from '@intra/shared-kernel';
import { ANSWER_CONSTRAINTS } from '@intra/shared-kernel';

export class AnswerQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Filter by review ID', type: 'number' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  reviewId?: number;

  @ApiPropertyOptional({ example: 1, description: 'Filter by question ID', type: 'number' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  questionId?: number;

  @ApiPropertyOptional({ enum: RespondentCategory, description: 'Filter by respondent category', type: 'string' })
  @ToOptionalEnum(RespondentCategory)
  @IsOptional()
  @IsEnum(RespondentCategory)
  respondentCategory?: RespondentCategory;

  @ApiPropertyOptional({ enum: AnswerType, description: 'Filter by answer type', type: 'string' })
  @ToOptionalEnum(AnswerType)
  @IsOptional()
  @IsEnum(AnswerType)
  answerType?: AnswerType;

  @ApiPropertyOptional({ example: 1, description: 'Filter by numerical value', type: 'number', minimum: ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MIN, maximum: ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MAX })
  @ToOptionalInt({ min: ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MIN, max: ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MAX })
  @IsOptional()
  @IsInt()
  @Min(ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MIN)
  @Max(ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MAX)
  numericalValue?: number;

  @ApiPropertyOptional({ example: 'text', description: 'Filter by text value (contains, case-insensitive)', type: 'string', minimum: ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MIN, maximum: ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MAX })
  @ToOptionalTrimmedString({ min: ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MIN, max: ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MAX })
  @IsOptional()
  @IsString()
  @MinLength(ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MIN)
  @MaxLength(ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MAX)
  textValue?: string;

  @ApiPropertyOptional({ example: AnswerSortField.ANSWER_TYPE, enum: AnswerSortField, description: 'Sort by field', type: 'string', default: AnswerSortField.ID })
  @ToOptionalEnum(AnswerSortField)
  @IsOptional()
  @IsEnum(AnswerSortField)
  sortBy?: AnswerSortField;

  @ApiPropertyOptional({ example: SortDirection.DESC, enum: SortDirection, description: 'Sort direction', type: 'string', default: SortDirection.ASC })
  @ToOptionalEnum(SortDirection)
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
