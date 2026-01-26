import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AnswerType } from '@intra/shared-kernel';
import { QUESTION_CONSTRAINTS } from '@intra/shared-kernel';

export class QuestionResponse {
  @ApiProperty({ example: 5, description: 'Question id', type: 'number', required: true })
  @Expose()
  id!: number;

  @ApiPropertyOptional({ example: 1, description: 'Cycle id', type: 'number', required: false, nullable: true })
  @Expose()
  cycleId?: number | null;

  @ApiPropertyOptional({ example: 12, description: 'Question template id', type: 'number', required: false, nullable: true })
  @Expose()
  questionTemplateId?: number | null;

  @ApiProperty({ example: 'Listens actively before responding.', description: 'Question title', type: 'string', required: true, minimum: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MIN, maximum: QUESTION_CONSTRAINTS.QUESTION_TITLE.LENGTH.MAX })
  @Expose()
  title!: string;

  @ApiProperty({ enum: AnswerType, example: AnswerType.TEXT_FIELD, description: 'Answer type', type: 'string', required: true })
  @Expose()
  answerType!: AnswerType;

  @ApiPropertyOptional({ example: 3, description: 'Competence id', type: 'number', required: false, nullable: true })
  @Expose()
  competenceId?: number | null;

  @ApiProperty({ example: false, description: 'Is for selfassessment', type: 'boolean', required: true })
  @Expose()
  isForSelfassessment!: boolean;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Created at', type: 'string', format: 'date-time', required: false })
  @Expose()
  createdAt?: Date;
}
