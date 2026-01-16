import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CompetenceClusterResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  competenceId!: number;

  @ApiPropertyOptional({ example: 5, nullable: true })
  @Expose()
  cycleId!: number | null;

  @ApiProperty({ example: 0 })
  @Expose()
  lowerBound!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  upperBound!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  minScore!: number;

  @ApiProperty({ example: 9.5 })
  @Expose()
  maxScore!: number;

  @ApiProperty({ example: 6.2 })
  @Expose()
  averageScore!: number;

  @ApiProperty({ example: 30 })
  @Expose()
  employeesCount!: number;

  @ApiProperty({ type: String, example: '2024-01-01T10:00:00.000Z' })
  @Expose()
  createdAt?: Date;

  @ApiProperty({ type: String, example: '2024-01-02T10:00:00.000Z' })
  @Expose()
  updatedAt?: Date;
}

