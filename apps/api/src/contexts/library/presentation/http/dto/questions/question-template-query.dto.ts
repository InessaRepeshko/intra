import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ToOptionalBool, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { SortDirection } from '@intra/shared-kernel';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateStatus } from '@intra/shared-kernel';
import { QuestionTemplateSortField } from 'src/contexts/library/application/ports/question-template.repository.port';
import { QUESTION_CONSTRAINTS } from '@intra/shared-kernel';

export class QuestionTemplateQueryDto {
  @ApiPropertyOptional({ description: 'Filter by competence id', example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  competenceId?: number;

  @ApiPropertyOptional({ description: 'Filter by position id', example: 5 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  positionId?: number;

  @ApiPropertyOptional({ enum: QuestionTemplateStatus, example: QuestionTemplateStatus.ACTIVE })
  @IsOptional()
  @IsEnum(QuestionTemplateStatus)
  status?: QuestionTemplateStatus;

  @ApiPropertyOptional({ enum: AnswerType, example: AnswerType.TEXT_FIELD })
  @IsOptional()
  @IsEnum(AnswerType)
  answerType?: AnswerType;

  @ApiPropertyOptional({ description: 'Filter self assessment question templates', example: false })
  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  isForSelfassessment?: boolean;

  @ApiPropertyOptional({
    description: 'Search in title',
    example: 'features',
    maxLength: QUESTION_CONSTRAINTS.TITLE.LENGTH.MAX,
  })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MaxLength(QUESTION_CONSTRAINTS.TITLE.LENGTH.MAX)
  search?: string;

  @ApiPropertyOptional({ enum: QuestionTemplateSortField, example: QuestionTemplateSortField.TITLE })
  @IsOptional()
  @IsEnum(QuestionTemplateSortField)
  sortBy?: QuestionTemplateSortField;

  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.ASC })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}

