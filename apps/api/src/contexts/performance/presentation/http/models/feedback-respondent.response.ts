import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RespondentCategory } from '../../../domain/respondent-category.enum';
import { Feedback360Status } from '../../../domain/feedback360-status.enum';

export class FeedbackRespondentResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  feedback360Id!: number;

  @ApiProperty({ example: 7 })
  @Expose()
  respondentId!: number;

  @ApiProperty({ enum: RespondentCategory })
  @Expose()
  respondentCategory!: RespondentCategory;

  @ApiProperty({ enum: Feedback360Status })
  @Expose()
  feedback360Status!: Feedback360Status;

  @ApiPropertyOptional({ example: 'Comment' })
  @Expose()
  respondentNote?: string | null;

  @ApiPropertyOptional({ type: String })
  @Expose()
  invitedAt?: Date | null;

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
