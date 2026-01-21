import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { POSITION_CONSTRAINTS } from '@intra/shared-kernel';

export class CreatePositionDto {
  @ApiProperty({ description: 'Position title', example: 'Senior Backend Engineer', maxLength: POSITION_CONSTRAINTS.TITLE.LENGTH.MAX, minLength: POSITION_CONSTRAINTS.TITLE.LENGTH.MIN })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MinLength(POSITION_CONSTRAINTS.TITLE.LENGTH.MIN)
  @MaxLength(POSITION_CONSTRAINTS.TITLE.LENGTH.MAX)
  title!: string;

  @ApiPropertyOptional({ description: 'Position description', example: 'Backend development, architecture design, code reviews', nullable: true, maxLength: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX, minLength: POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
  @MaxLength(POSITION_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
  description?: string | null;
}
