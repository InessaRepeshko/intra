import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { TeamConstants } from 'src/common/constants/index';
import { TeamSortField } from '../../../../application/ports/team.repository.port';

export class TeamQueryDto {
  @ApiPropertyOptional({ description: 'Search by title or description', minLength: TeamConstants.TITLE_MIN_LENGTH, maxLength: TeamConstants.TITLE_MAX_LENGTH, example: 'Engineering Team' })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(TeamConstants.TITLE_MIN_LENGTH)
  @MaxLength(TeamConstants.TITLE_MAX_LENGTH)
  search?: string;

  @ApiPropertyOptional({ description: 'Id of team leader', type: Number, example: 12 })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  headId?: number;

  @ApiPropertyOptional({ description: 'Sorting field', enum: TeamSortField, default: TeamSortField.ID, example: TeamSortField.TITLE })
  @IsOptional()
  @ToOptionalEnum(TeamSortField)
  @IsEnum(TeamSortField)
  sortBy?: TeamSortField;

  @ApiPropertyOptional({ description: 'Sorting direction', enum: SortDirection, default: SortDirection.ASC, example: SortDirection.DESC })
  @IsOptional()
  @ToOptionalEnum(SortDirection)
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
