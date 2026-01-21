import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator';
import { ToOptionalBool, ToOptionalEnum, ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';
import { AnswerType } from 'src/contexts/library/domain/enums/answer-type.enum';
import { QuestionSortField } from 'src/contexts/feedback360/application/ports/question.repository.port';
import { SortDirection } from '../../../../../../../../../packages/shared-kernel/src/common/enums/sort-direction.enum';

export class QuestionQueryDto {
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

  @ApiPropertyOptional({ enum: QuestionSortField, example: QuestionSortField.CREATED_AT })
  @ToOptionalEnum(QuestionSortField)
  @IsOptional()
  sortBy?: QuestionSortField;

  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.DESC })
  @ToOptionalEnum(SortDirection)
  @IsOptional()
  sortDirection?: SortDirection;
}
