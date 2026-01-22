import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RespondentCategory } from '@intra/shared-kernel';
import { ResponseStatus } from '@intra/shared-kernel';

export class RespondentResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  reviewId!: number;

  @ApiProperty({ example: 7 })
  @Expose()
  respondentId!: number;

  @ApiProperty({ enum: RespondentCategory })
  @Expose()
  category!: RespondentCategory;

  @ApiProperty({ enum: ResponseStatus })
  @Expose()
  responseStatus!: ResponseStatus;

  @ApiPropertyOptional({ example: 'Comment' })
  @Expose()
  respondentNote?: string | null;

  @ApiPropertyOptional({ example: 'HR comment' })
  @Expose()
  hrNote?: string | null;

  @ApiProperty({ example: 3 })
  @Expose()
  positionId!: number;

  @ApiProperty({ example: 'Senior Engineer' })
  @Expose()
  positionTitle!: string;

  @ApiPropertyOptional({ type: String })
  @Expose()
  invitedAt?: Date | null;

  @ApiPropertyOptional({ type: String })
  @Expose()
  canceledAt?: Date | null;

  @ApiPropertyOptional({ type: String })
  @Expose()
  respondedAt?: Date | null;

  @ApiPropertyOptional({ type: String })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({ type: String })
  @Expose()
  updatedAt?: Date;
}
