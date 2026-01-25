import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ClusterResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  competenceId!: number;

  @ApiProperty({ example: 0 })
  @Expose()
  lowerBound!: number;

  @ApiProperty({ example: 1 })
  @Expose()
  upperBound!: number;

  @ApiProperty({ example: 'Beginner' })
  @Expose()
  title!: string;

  @ApiProperty({ example: 'Initial level of competence development' })
  @Expose()
  description!: string;

  @ApiProperty({ type: String, example: '2024-01-01T10:00:00.000Z' })
  @Expose()
  createdAt?: Date;

  @ApiProperty({ type: String, example: '2024-01-02T10:00:00.000Z' })
  @Expose()
  updatedAt?: Date;
}
