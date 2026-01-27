import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalEnum, ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { SortDirection } from '@intra/shared-kernel';
import { TEAM_CONSTRAINTS } from '@intra/shared-kernel';
import { TeamSortField } from '../../../../application/ports/team.repository.port';

export class TeamQueryDto {
  @ApiPropertyOptional({ description: 'Title of team (contains, case-insensitive)', minimum: TEAM_CONSTRAINTS.TITLE.LENGTH.MIN, maximum: TEAM_CONSTRAINTS.TITLE.LENGTH.MAX, example: 'Engineering Team', type: 'string' })
  @IsOptional()
  @ToOptionalTrimmedString({ min: TEAM_CONSTRAINTS.TITLE.LENGTH.MIN, max: TEAM_CONSTRAINTS.TITLE.LENGTH.MAX })
  @IsString()
  @MinLength(TEAM_CONSTRAINTS.TITLE.LENGTH.MIN)
  @MaxLength(TEAM_CONSTRAINTS.TITLE.LENGTH.MAX)
  title?: string;

  @ApiPropertyOptional({ description: 'Description of team (contains, case-insensitive)', minimum: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN, maximum: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX, example: 'Responsible for product development', type: 'string' })
  @IsOptional()
  @ToOptionalTrimmedString({ min: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN, max: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX })
  @IsString()
  @MinLength(TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
  @MaxLength(TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
  description?: string;

  @ApiPropertyOptional({ description: 'Search by title or description (contains, case-insensitive)', minimum: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN, maximum: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX, example: 'Engineering Team', type: 'string' })
  @IsOptional()
  @ToOptionalTrimmedString({ min: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN, max: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX })
  @IsString()
  @MinLength(TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
  @MaxLength(TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
  search?: string;

  @ApiPropertyOptional({ description: 'Id of team leader', type: 'number', example: 12 })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  headId?: number;

  @ApiPropertyOptional({ description: 'Sorting field', enum: TeamSortField, default: TeamSortField.ID, example: TeamSortField.TITLE, type: 'string' })
  @IsOptional()
  @ToOptionalEnum(TeamSortField)
  @IsEnum(TeamSortField)
  sortBy?: TeamSortField;

  @ApiPropertyOptional({ description: 'Sorting direction', enum: SortDirection, default: SortDirection.ASC, example: SortDirection.ASC, type: 'string' })
  @IsOptional()
  @ToOptionalEnum(SortDirection)
  @IsEnum(SortDirection)
  sortDirection?: SortDirection;
}
