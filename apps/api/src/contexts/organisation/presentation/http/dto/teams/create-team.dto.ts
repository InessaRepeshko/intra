import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { TEAM_CONSTRAINTS } from '@intra/shared-kernel';

export class CreateTeamDto {
  @ApiProperty({ description: 'Team title', example: 'Engineering Team', maxLength: TEAM_CONSTRAINTS.TITLE.LENGTH.MAX, minLength: TEAM_CONSTRAINTS.TITLE.LENGTH.MIN })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MinLength(TEAM_CONSTRAINTS.TITLE.LENGTH.MIN)
  @MaxLength(TEAM_CONSTRAINTS.TITLE.LENGTH.MAX)
  title!: string;

  @ApiPropertyOptional({ description: 'Team description', example: 'Responsible for product development', nullable: true, maxLength: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX, minLength: TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
  @MaxLength(TEAM_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
  description?: string | null;

  @ApiPropertyOptional({ description: 'Id of team leader', example: 12, nullable: true })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  headId?: number | null;
}
