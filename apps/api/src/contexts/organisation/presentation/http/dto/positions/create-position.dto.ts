import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { PositionConstants } from 'src/common/constants/index';

export class CreatePositionDto {
  @ApiProperty({ description: 'Position title', example: 'Senior Backend Engineer', maxLength: PositionConstants.TITLE_MAX_LENGTH, minLength: PositionConstants.TITLE_MIN_LENGTH })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MinLength(PositionConstants.TITLE_MIN_LENGTH)
  @MaxLength(PositionConstants.TITLE_MAX_LENGTH)
  title!: string;

  @ApiPropertyOptional({ description: 'Position description', example: 'Backend development, architecture design, code reviews', nullable: true, maxLength: PositionConstants.DESCRIPTION_MAX_LENGTH, minLength: PositionConstants.DESCRIPTION_MIN_LENGTH })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(PositionConstants.DESCRIPTION_MIN_LENGTH)
  @MaxLength(PositionConstants.DESCRIPTION_MAX_LENGTH)
  description?: string | null;
}
