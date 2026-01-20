import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class UpsertClusterScoreDto {
  @ApiPropertyOptional({ example: 1, description: 'Cycle (optional)' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  cycleId?: number;

  @ApiProperty({ example: 3, description: 'Cluster' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  clusterId!: number;

  @ApiProperty({ example: 7, description: 'User' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  userId!: number;

  @ApiPropertyOptional({ example: 5, description: 'Review (optional)' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  reviewId?: number;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  @Max(10)
  score!: number;
}
