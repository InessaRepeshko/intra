import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class UpsertCycleClusterAnalyticsDto {
    @ApiProperty({ example: 1, description: 'Cycle ID' })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    cycleId!: number;

    @ApiProperty({ example: 3, description: 'Cluster ID' })
    @ToOptionalInt({ min: 1 })
    @IsInt()
    @Min(1)
    clusterId!: number;

    @ApiProperty({ example: 42, description: 'Number of employees in this cluster' })
    @ToOptionalInt({ min: 0 })
    @IsInt()
    @Min(0)
    employeesCount!: number;

    @ApiProperty({ example: 3.2, description: 'Minimum score' })
    @IsNumber()
    @Min(0)
    minScore!: number;

    @ApiProperty({ example: 9.8, description: 'Maximum score' })
    @IsNumber()
    @Min(0)
    maxScore!: number;

    @ApiProperty({ example: 6.5, description: 'Average score' })
    @IsNumber()
    @Min(0)
    averageScore!: number;
}
