import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class ClusterScoreQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  cycleId?: number;

  @ApiPropertyOptional({ example: 3 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  clusterId?: number;

  @ApiPropertyOptional({ example: 7 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  rateeId?: number;

  @ApiPropertyOptional({ example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  reviewId?: number;
}
