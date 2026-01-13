import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { WithPagination } from 'src/common/mixins/with-pagination.mixin';
import { ToOptionalEnum, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { PositionConstants } from 'src/common/validators/constants';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { PositionSortField } from '../../../../application/ports/position.repository.port';

class PositionQueryBase {}

export class PositionQueryDto extends WithPagination(PositionQueryBase) {
  @ApiPropertyOptional({ description: 'Search by title or description', maxLength: 255 })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MaxLength(PositionConstants.TITLE_MAX_LENGTH)
  search?: string;

  @ApiPropertyOptional({ enum: PositionSortField, default: PositionSortField.CREATED_AT })
  @IsOptional()
  @ToOptionalEnum(PositionSortField)
  @IsEnum(PositionSortField)
  sortBy?: PositionSortField;

  @ApiPropertyOptional({ enum: SortDirection, default: SortDirection.DESC })
  @IsOptional()
  @ToOptionalEnum(SortDirection)
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
