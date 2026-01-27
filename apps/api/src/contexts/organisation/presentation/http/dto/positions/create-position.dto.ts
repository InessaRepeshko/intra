import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { POSITION_CONSTRAINTS } from '@intra/shared-kernel';

export class CreatePositionDto {
  @ApiProperty({ description: 'Position title', example: 'Senior Backend Engineer', maximum: POSITION_CONSTRAINTS.TITLE.LENGTH.MAX, minimum: POSITION_CONSTRAINTS.TITLE.LENGTH.MIN, type: 'string' })
  @ToOptionalTrimmedString({ min: POSITION_CONSTRAINTS.TITLE.LENGTH.MIN, max: POSITION_CONSTRAINTS.TITLE.LENGTH.MAX })
  @IsString()
  @IsNotEmpty()
  @MinLength(POSITION_CONSTRAINTS.TITLE.LENGTH.MIN)
  @MaxLength(POSITION_CONSTRAINTS.TITLE.LENGTH.MAX)
  title!: string;

  @ApiPropertyOptional({ description: 'Position description', example: 'Backend development, architecture design, code reviews', nullable: true, maximum: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX, minimum: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN, type: 'string' })
  @IsOptional()
  @ToOptionalTrimmedString({ min: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN, max: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX })
  @IsString()
  @MinLength(POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
  @MaxLength(POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
  description?: string | null;
}
