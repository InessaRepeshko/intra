import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FeedbackReviewerResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  feedback360Id!: number;

  @ApiProperty({ example: 4 })
  @Expose()
  userId!: number;

  @ApiPropertyOptional({ type: String })
  @Expose()
  createdAt?: Date;
}
