import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { TeamConstants } from 'src/common/validators/constants';

export class CreateTeamDto {
  @ApiProperty({ example: 'Engineering Team' })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MinLength(TeamConstants.TITLE_MIN_LENGTH)
  @MaxLength(TeamConstants.TITLE_MAX_LENGTH)
  title!: string;

  @ApiPropertyOptional({ example: 'Responsible for product development', nullable: true })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MaxLength(TeamConstants.DESCRIPTION_MAX_LENGTH)
  description?: string | null;

  @ApiPropertyOptional({ example: 12, nullable: true })
  @IsOptional()
  @ToOptionalInt({ min: 1 })
  @IsInt()
  headId?: number | null;
}
