import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AnswerType, QUESTION_CONSTRAINTS, ReviewQuestionRelationDto } from '@intra/shared-kernel';

export class ReviewQuestionRelationResponse implements ReviewQuestionRelationDto {
  @ApiProperty({ example: 1, description: 'Review question relation id', type: 'number', required: true })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2, description: 'Review id', type: 'number', required: true })
  @Expose()
  reviewId!: number;

  @ApiProperty({ example: 10, description: 'Question id', type: 'number', required: true })
  @Expose()
  questionId!: number;

  @ApiProperty({ example: 'Listens actively before responding.', description: 'Question title', type: 'string', required: true, minimum: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN, maximum: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX })
  @Expose()
  questionTitle!: string;

  @ApiProperty({ enum: AnswerType, example: AnswerType.NUMERICAL_SCALE, description: 'Answer type', type: 'string', required: true })
  @Expose()
  answerType!: AnswerType;

  @ApiProperty({ example: 3, description: 'Competence id', type: 'number', required: true })
  @Expose()
  competenceId!: number;

  @ApiProperty({ example: 'Communication', description: 'Competence title', type: 'string', required: true, minimum: QUESTION_CONSTRAINTS.COMPETENCE_TITLE.LENGTH.MIN, maximum: QUESTION_CONSTRAINTS.COMPETENCE_TITLE.LENGTH.MAX })
  @Expose()
  competenceTitle!: string;

  @ApiProperty({ example: false, description: 'Is for selfassessment', type: 'boolean', required: true })
  @Expose()
  isForSelfassessment!: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Created at', type: 'string', format: 'date-time' })
  @Expose()
  createdAt!: Date;
}
