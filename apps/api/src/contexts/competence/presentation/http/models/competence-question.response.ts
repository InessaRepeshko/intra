import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CompetenceQuestionAnswerType } from '../../../domain/competence-question-answer-type.enum';
import { CompetenceQuestionStatus } from '../../../domain/competence-question-status.enum';

export class CompetenceQuestionResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  competenceId!: number;

  @ApiProperty({ example: 'Delivers features on time' })
  @Expose()
  title!: string;

  @ApiProperty({ enum: CompetenceQuestionAnswerType, example: CompetenceQuestionAnswerType.NUMERICAL_SCALE })
  @Expose()
  answerType!: CompetenceQuestionAnswerType;

  @ApiProperty({ example: false })
  @Expose()
  isForSelfassessment!: boolean;

  @ApiProperty({ enum: CompetenceQuestionStatus, example: CompetenceQuestionStatus.ACTIVE })
  @Expose()
  questionStatus!: CompetenceQuestionStatus;

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

