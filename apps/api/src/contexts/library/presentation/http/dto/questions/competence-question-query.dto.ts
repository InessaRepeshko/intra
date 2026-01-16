import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { ToOptionalBool, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { CompetenceQuestionAnswerType } from 'src/contexts/library/domain/competence-question-answer-type.enum';
import { CompetenceQuestionStatus } from 'src/contexts/library/domain/competence-question-status.enum';
import { CompetenceQuestionSortField } from 'src/contexts/library/application/ports/competence-question.repository.port';
import { CompetenceQuestionConstants } from 'src/common/validators/constants';

export class CompetenceQuestionQueryDto {
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

  @ApiPropertyOptional({ enum: CompetenceQuestionStatus, example: CompetenceQuestionStatus.ACTIVE })
  @IsOptional()
  @IsEnum(CompetenceQuestionStatus)
  status?: CompetenceQuestionStatus;

  @ApiPropertyOptional({ enum: CompetenceQuestionAnswerType, example: CompetenceQuestionAnswerType.TEXT_FIELD })
  @IsOptional()
  @IsEnum(CompetenceQuestionAnswerType)
  answerType?: CompetenceQuestionAnswerType;

  @ApiPropertyOptional({ description: 'Filter self assessment questions', example: false })
  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  isForSelfassessment?: boolean;

  @ApiPropertyOptional({
    description: 'Search in title',
    example: 'features',
    maxLength: CompetenceQuestionConstants.TITLE_MAX_LENGTH,
  })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MaxLength(CompetenceQuestionConstants.TITLE_MAX_LENGTH)
  search?: string;

  @ApiPropertyOptional({ enum: CompetenceQuestionSortField, example: CompetenceQuestionSortField.TITLE })
  @IsOptional()
  @IsEnum(CompetenceQuestionSortField)
  sortBy?: CompetenceQuestionSortField;

  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.ASC })
  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}

