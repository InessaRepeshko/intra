import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AnswerType } from '@intra/shared-kernel';

export class QuestionResponse {
  @ApiProperty({ example: 5 })
  @Expose()
  id!: number;

  @ApiPropertyOptional({ example: 1 })
  @Expose()
  cycleId?: number | null;

  @ApiPropertyOptional({ example: 12 })
  @Expose()
  libraryQuestionId?: number | null;

  @ApiProperty({ example: 'How do you plan your work?' })
  @Expose()
  title!: string;

  @ApiProperty({ enum: AnswerType, example: AnswerType.TEXT_FIELD })
  @Expose()
  answerType!: AnswerType;

  @ApiPropertyOptional({ example: 3 })
  @Expose()
  competenceId?: number | null;

  @ApiPropertyOptional({ example: 4 })
  @Expose()
  positionId?: number | null;

  @ApiProperty({ example: false })
  @Expose()
  isForSelfassessment!: boolean;

  @ApiPropertyOptional({ type: String })
  @Expose()
  createdAt?: Date;
}
