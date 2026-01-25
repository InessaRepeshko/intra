import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class UpdateCycleClusterAnalyticsDto {
    @ApiPropertyOptional({ example: 45, description: 'Number of employees in this cluster' })
    @ToOptionalInt({ min: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    employeesCount?: number;

    @ApiPropertyOptional({ example: 3.5, description: 'Minimum score' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    minScore?: number;

    @ApiPropertyOptional({ example: 9.5, description: 'Maximum score' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    maxScore?: number;

    @ApiPropertyOptional({ example: 6.8, description: 'Average score' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    averageScore?: number;
}
