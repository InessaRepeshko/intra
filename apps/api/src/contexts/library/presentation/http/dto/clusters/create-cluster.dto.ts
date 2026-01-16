import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ToOptionalInt } from 'src/common/transforms/query-sanitize.transform';

export class CreateClusterDto {
  @ApiProperty({ description: 'Competence id', example: 2 })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  competenceId!: number;

  @ApiPropertyOptional({ description: 'Feedback360 cycle id', example: 3, nullable: true })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  cycleId?: number | null;

  @ApiProperty({ description: 'Lower bound of the cluster', example: 0 })
  @IsNumber()
  lowerBound!: number;

  @ApiProperty({ description: 'Upper bound of the cluster', example: 10 })
  @IsNumber()
  upperBound!: number;

  @ApiProperty({ description: 'Minimal score in the cluster', example: 2 })
  @IsNumber()
  minScore!: number;

  @ApiProperty({ description: 'Max score in the cluster', example: 9.5 })
  @IsNumber()
  maxScore!: number;

  @ApiProperty({ description: 'Average score in the cluster', example: 6.2 })
  @IsNumber()
  averageScore!: number;

  @ApiProperty({ description: 'Employees in cluster', example: 30 })
  @IsInt()
  @Min(0)
  employeesCount!: number;
}

