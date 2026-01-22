import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReviewerResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  reviewId!: number;

  @ApiProperty({ example: 4 })
  @Expose()
  reviewerId!: number;

  @ApiProperty({ example: 3 })
  @Expose()
  positionId!: number;

  @ApiProperty({ example: 'Tech Lead' })
  @Expose()
  positionTitle!: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  createdAt?: Date;
}
