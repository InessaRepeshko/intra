import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';
import { ToOptionalBool, ToOptionalEnum, ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';
import { AnswerType } from 'src/contexts/library/domain/enums/answer-type.enum';
import { Feedback360QuestionSortField } from 'src/contexts/performance/application/ports/feedback360-question.repository.port';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class CycleQuestionQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  cycleId?: number;

  @ApiPropertyOptional({ example: 3 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  positionId?: number;

  @ApiPropertyOptional({ example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  competenceId?: number;

  @ApiPropertyOptional({ enum: AnswerType })
  @IsOptional()
  @IsEnum(AnswerType)
  answerType?: AnswerType;

  @ApiPropertyOptional({ example: false })
  @ToOptionalBool()
  @IsOptional()
  @IsBoolean()
  isForSelfassessment?: boolean;

  @ApiPropertyOptional({ enum: Feedback360QuestionSortField, example: Feedback360QuestionSortField.CREATED_AT })
  @ToOptionalEnum(Feedback360QuestionSortField)
  @IsOptional()
  sortBy?: Feedback360QuestionSortField;

  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.DESC })
  @ToOptionalEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection;
}
