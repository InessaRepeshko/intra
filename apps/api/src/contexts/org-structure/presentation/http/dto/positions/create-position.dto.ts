import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { PositionConstants } from 'src/common/validators/constants';

export class CreatePositionDto {
  @ApiProperty({ example: 'Senior Backend Engineer' })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MinLength(PositionConstants.TITLE_MIN_LENGTH)
  @MaxLength(PositionConstants.TITLE_MAX_LENGTH)
  title!: string;

  @ApiPropertyOptional({ example: 'Backend development, architecture design, code reviews', nullable: true })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MaxLength(PositionConstants.DESCRIPTION_MAX_LENGTH)
  description?: string | null;
}
