import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';

export class PositionFilterDto {
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Filter positions by title (contains)',
    type: 'string',
    example: 'Engineer',
  })
  title?: string;

  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Filter positions by description (contains)',
    type: 'string',
    example: 'backend',
    nullable: true,
  })
  description?: string;

  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'Search by title/description (contains)',
    type: 'string',
    example: 'software',
  })
  search?: string;
}


