import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { PositionConstants } from 'src/common/constants/index';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PositionSortField } from '../../../../application/ports/position.repository.port';

export class PositionQueryDto {
  @ApiPropertyOptional({ description: 'Search by title or description', minLength: PositionConstants.TITLE_MIN_LENGTH, maxLength: PositionConstants.TITLE_MAX_LENGTH, example: 'Senior Backend Engineer' })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(PositionConstants.TITLE_MIN_LENGTH)
  @MaxLength(PositionConstants.TITLE_MAX_LENGTH)
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
