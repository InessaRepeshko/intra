import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { POSITION_CONSTRAINTS } from '@intra/shared-kernel';
import { SortDirection } from '@intra/shared-kernel';
import { PositionSortField } from '../../../../application/ports/position.repository.port';

export class PositionQueryDto {
  @ApiPropertyOptional({ description: 'Search by title or description', minLength: POSITION_CONSTRAINTS.TITLE.LENGTH.MIN, maxLength: POSITION_CONSTRAINTS.TITLE.LENGTH.MAX, example: 'Senior Backend Engineer' })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(POSITION_CONSTRAINTS.TITLE.LENGTH.MIN)
  @MaxLength(POSITION_CONSTRAINTS.TITLE.LENGTH.MAX)
  search?: string;

  @ApiPropertyOptional({ description: 'Sorting field', enum: PositionSortField, default: PositionSortField.ID, example: PositionSortField.TITLE })
  @IsOptional()
  @ToOptionalEnum(PositionSortField)
  @IsEnum(PositionSortField)
  sortBy?: PositionSortField;

  @ApiPropertyOptional({ description: 'Sorting direction', enum: SortDirection, default: SortDirection.ASC, example: SortDirection.DESC })
  @IsOptional()
  @ToOptionalEnum(SortDirection)
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
