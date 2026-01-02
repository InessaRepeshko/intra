import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class Feedback360ReviewerRelationFilterDto {
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, type: 'number', description: 'Filter by feedback360Id', example: 1 })
  feedback360Id?: number;

  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ required: false, type: 'number', description: 'Filter by userId', example: 1 })
  userId?: number;
}


