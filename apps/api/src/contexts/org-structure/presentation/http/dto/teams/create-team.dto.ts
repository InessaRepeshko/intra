import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { TeamConstants } from 'src/common/validators/constants';

export class CreateTeamDto {
  @ApiProperty({ description: 'Team title', example: 'Engineering Team', maxLength: TeamConstants.TITLE_MAX_LENGTH, minLength: TeamConstants.TITLE_MIN_LENGTH })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MinLength(TeamConstants.TITLE_MIN_LENGTH)
  @MaxLength(TeamConstants.TITLE_MAX_LENGTH)
  title!: string;

  @ApiPropertyOptional({ description: 'Team description', example: 'Responsible for product development', nullable: true, maxLength: TeamConstants.DESCRIPTION_MAX_LENGTH, minLength: TeamConstants.DESCRIPTION_MIN_LENGTH })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(TeamConstants.DESCRIPTION_MIN_LENGTH)
  @MaxLength(TeamConstants.DESCRIPTION_MAX_LENGTH)
  description?: string | null;

  @ApiPropertyOptional({ description: 'Id of team leader', example: 12, nullable: true })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  headId?: number | null;
}
