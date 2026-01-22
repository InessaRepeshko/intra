import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateStatus } from '@intra/shared-kernel';

export class QuestionTemplateResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  competenceId!: number;

  @ApiProperty({ example: 'Delivers features on time' })
  @Expose()
  title!: string;

  @ApiProperty({ enum: AnswerType, example: AnswerType.NUMERICAL_SCALE })
  @Expose()
  answerType!: AnswerType;

  @ApiProperty({ example: false })
  @Expose()
  isForSelfassessment!: boolean;

  @ApiProperty({ enum: QuestionTemplateStatus, example: QuestionTemplateStatus.ACTIVE })
  @Expose()
  status!: QuestionTemplateStatus;

  @ApiProperty({ example: [1, 2, 3], isArray: true, type: Number })
  @Expose()
  positionIds!: number[];

  @ApiPropertyOptional({ type: String, example: '2024-01-01T10:00:00.000Z' })
  @Expose()
  createdAt?: Date;

  @ApiPropertyOptional({ type: String, example: '2024-01-02T10:00:00.000Z' })
  @Expose()
  updatedAt?: Date;
}

