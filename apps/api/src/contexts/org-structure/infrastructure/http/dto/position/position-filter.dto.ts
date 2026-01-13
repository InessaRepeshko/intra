import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { ToOptionalEnum, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { PositionSortField } from '../../../domain/value-objects/position-sort-field.enum';

export class PositionFilterDto {
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Filter positions by title (contains)',
    type: 'string',
    example: 'Engineer',
  })
  title?: string;

  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Filter positions by description (contains)',
    type: 'string',
    example: 'Responsibility',
    nullable: true,
  })
  description?: string;

  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Search by title/description (contains)',
    type: 'string',
    example: 'software',
  })
  search?: string;

  @ToOptionalEnum(PositionSortField)
  @IsOptional()
  @IsEnum(PositionSortField)
  @ApiProperty({
    required: false,
    description: 'Field to sort by',
    enum: PositionSortField,
    example: PositionSortField.TITLE,
  })
  sortBy?: PositionSortField;

  @ToOptionalEnum(SortDirection)
  @IsOptional()
  @IsEnum(SortDirection)
  @ApiProperty({
    required: false,
    description: 'Sort direction',
    enum: SortDirection,
    example: SortDirection.ASC,
    default: SortDirection.DESC,
  })
  sortDirection?: SortDirection;
}

