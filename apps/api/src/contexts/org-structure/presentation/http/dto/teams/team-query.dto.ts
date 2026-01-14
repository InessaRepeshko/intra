import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { SortDirection } from 'src/common/enums/sort-direction.enum';
import { TeamConstants } from 'src/common/validators/constants';
import { TeamSortField } from '../../../../application/ports/team.repository.port';

export class TeamQueryDto {
  @ApiPropertyOptional({ description: 'Search by title or description', maxLength: 255 })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MaxLength(TeamConstants.TITLE_MAX_LENGTH)
  search?: string;

  @ApiPropertyOptional({ type: Number, description: 'Id of team leader' })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  headId?: number;

  @ApiPropertyOptional({ enum: TeamSortField, default: TeamSortField.CREATED_AT })
  @IsOptional()
  @ToOptionalEnum(TeamSortField)
  @IsEnum(TeamSortField)
  sortBy?: TeamSortField;

  @ApiPropertyOptional({ enum: SortDirection, default: SortDirection.DESC })
  @IsOptional()
  @ToOptionalEnum(SortDirection)
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
