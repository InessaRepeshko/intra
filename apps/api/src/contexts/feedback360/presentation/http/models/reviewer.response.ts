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
  userId!: number;

  @ApiPropertyOptional({ type: String })
  @Expose()
  createdAt?: Date;
}
