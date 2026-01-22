import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AnswerType } from '@intra/shared-kernel';

export class ReviewQuestionRelationResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  reviewId!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  libraryQuestionId!: number;

  @ApiProperty({ example: 'Delivers features on time' })
  @Expose()
  questionTitle!: string;

  @ApiProperty({ enum: AnswerType, example: AnswerType.NUMERICAL_SCALE })
  @Expose()
  answerType!: AnswerType;

  @ApiProperty({ example: 3 })
  @Expose()
  competenceId!: number;

  @ApiProperty({ example: false })
  @Expose()
  isForSelfassessment!: boolean;

  @ApiPropertyOptional({ type: String })
  @Expose()
  createdAt?: Date;
}
