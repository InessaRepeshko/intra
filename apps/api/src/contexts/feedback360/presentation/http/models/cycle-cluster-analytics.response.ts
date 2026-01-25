import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CycleClusterAnalyticsResponse {
    @ApiProperty({ example: 1 })
    @Expose()
    id!: number;

    @ApiProperty({ example: 1, description: 'Cycle ID' })
    @Expose()
    cycleId!: number;

    @ApiProperty({ example: 3, description: 'Cluster ID' })
    @Expose()
    clusterId!: number;

    @ApiProperty({ example: 42, description: 'Number of employees in this cluster' })
    @Expose()
    employeesCount!: number;

    @ApiProperty({ example: 3.2, description: 'Minimum score in this cluster' })
    @Expose()
    minScore!: number;

    @ApiProperty({ example: 9.8, description: 'Maximum score in this cluster' })
    @Expose()
    maxScore!: number;

    @ApiProperty({ example: 6.5, description: 'Average score in this cluster' })
    @Expose()
    averageScore!: number;

    @ApiPropertyOptional({ type: String })
    @Expose()
    createdAt?: Date;

    @ApiPropertyOptional({ type: String })
    @Expose()
    updatedAt?: Date;
}
