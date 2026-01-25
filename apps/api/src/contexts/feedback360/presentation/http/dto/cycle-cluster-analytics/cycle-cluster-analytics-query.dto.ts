import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class CycleClusterAnalyticsQueryDto {
    @ApiPropertyOptional({ example: 1, description: 'Filter by cycle ID' })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    cycleId?: number;

    @ApiPropertyOptional({ example: 3, description: 'Filter by cluster ID' })
    @ToOptionalInt({ min: 1 })
    @IsOptional()
    @IsInt()
    clusterId?: number;
}
