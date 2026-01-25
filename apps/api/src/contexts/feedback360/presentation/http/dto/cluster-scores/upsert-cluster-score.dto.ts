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

  @ApiProperty({ example: 7, description: 'Ratee' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  rateeId!: number;

  @ApiProperty({ example: 5, description: 'Review' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  reviewId!: number;

  @ApiProperty({ example: 4.5 })
  @IsNumber()
  @Min(0)
  @Max(10)
  score!: number;

  @ApiPropertyOptional({ example: 5, description: 'Number of answers (optional, default 1)' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  answersCount?: number;
}
