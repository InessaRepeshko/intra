import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AnswerType } from '@intra/shared-kernel';
import { QuestionTemplateStatus } from '@intra/shared-kernel';
import { QUESTION_TEMPLATE_CONSTRAINTS } from '@intra/shared-kernel';

export class QuestionTemplateResponse {
  @ApiProperty({ example: 1, description: 'Question template id', type: 'number' })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2, description: 'Competence id the question template belongs to', type: 'number' })
  @Expose()
  competenceId!: number;

  @ApiProperty({ example: 'Delivers features on time', description: 'Question template title', type: 'string', minimum: QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MIN, maximum: QUESTION_TEMPLATE_CONSTRAINTS.TITLE.LENGTH.MAX })
  @Expose()
  title!: string;

  @ApiProperty({ enum: AnswerType, example: AnswerType.NUMERICAL_SCALE, description: 'Answer type', type: 'string' })
  @Expose()
  answerType!: AnswerType;

  @ApiProperty({ example: false, description: 'Is this question template for self assessment', type: 'boolean' })
  @Expose()
  isForSelfassessment!: boolean;

  @ApiProperty({ enum: QuestionTemplateStatus, example: QuestionTemplateStatus.ACTIVE, description: 'Question template status', type: 'string' })
  @Expose()
  status!: QuestionTemplateStatus;

  @ApiProperty({ example: [2, 3], isArray: true, type: 'number', description: 'Positions this question template is linked to' })
  @Expose()
  positionIds!: number[];

  @ApiProperty({ type: 'string', format: 'date-time', example: '2024-01-01T10:00:00.000Z', description: 'Question template creation date' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: 'string', format: 'date-time', example: '2024-01-02T10:00:00.000Z', description: 'Question template update date' })
  @Expose()
  updatedAt!: Date;
}

