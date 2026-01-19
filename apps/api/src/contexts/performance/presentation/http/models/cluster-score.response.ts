import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ClusterScoreResponse {
  @ApiProperty({ example: 1})
  @Expose()
  id!: number;

  @ApiPropertyOptional({ example: 1})
  @Expose() 
  cycleId?: number | null;

  @ApiProperty({ example: 3 })
  @Expose()
  clusterId!: number;

  @ApiProperty({ example: 7 })
  @Expose()
  userId!: number;

  @ApiPropertyOptional({ example: 2 })
  @Expose()
  feedback360Id?: number | null;

  @ApiProperty({ example: 4.3 })
  @Expose()
  score!: number;

  @ApiPropertyOptional({ type: String })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({ type: String })
  @Expose()
  updatedAt?: Date;
}
