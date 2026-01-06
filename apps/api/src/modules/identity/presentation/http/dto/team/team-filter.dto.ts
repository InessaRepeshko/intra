import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { TeamSortField } from 'src/modules/identity/domain/team/team-sort-field.enum';
import { SortDirection } from 'src/common/enums/sort-direction.enum';

export class TeamFilterDto {
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Filter teams by title (contains)',
    type: 'string',
    example: 'Eng',
  })
  title?: string;

  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Filter teams by description (contains)',
    type: 'string',
    example: 'Product',
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
    example: 'engineering',
  })
  search?: string;

  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'Filter by headId',
    type: 'number',
    example: 1,
    nullable: true,
  })
  headId?: number;

  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    required: false,
    description: 'Filter by memberId (team contains this user)',
    type: 'number',
    example: 1,
  })
  memberId?: number;

  @ToOptionalEnum(TeamSortField)
  @IsOptional()
  @IsEnum(TeamSortField)
  @ApiProperty({
    required: false,
    description: 'Field to sort by',
    enum: TeamSortField,
    example: TeamSortField.TITLE,
  })
  sortBy?: TeamSortField;

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


