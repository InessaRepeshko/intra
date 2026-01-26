import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RespondentCategory } from '@intra/shared-kernel';
import { AnswerType } from '@intra/shared-kernel';
import { ANSWER_CONSTRAINTS } from '@intra/shared-kernel';

export class AnswerResponse {
  @ApiProperty({ example: 1, description: 'Answer id', type: 'number', required: true })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2, description: 'Review id', type: 'number', required: true })
  @Expose()
  reviewId!: number;

  @ApiProperty({ example: 10, description: 'Question id', type: 'number', required: true   })
  @Expose()
  questionId!: number;

  @ApiProperty({ example: RespondentCategory.TEAM, enum: RespondentCategory, description: 'Respondent category', type: 'string', required: true })
  @Expose()
  respondentCategory!: RespondentCategory;

  @ApiProperty({ example: AnswerType.NUMERICAL_SCALE, enum: AnswerType, description: 'Answer type', type: 'string', required: true  })
  @Expose()
  answerType!: AnswerType;

  @ApiPropertyOptional({ example: 4, description: 'Numerical value', type: 'number', required: false, nullable: true, minimum: ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MIN, maximum: ANSWER_CONSTRAINTS.NUMERICAL_VALUE.MAX })
  @Expose()
  numericalValue?: number | null;

  @ApiPropertyOptional({ example: 'Great companion and friendly colleague', description: 'Text value', type: 'string', required: false, nullable: true, minimum: ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MIN, maximum: ANSWER_CONSTRAINTS.TEXT_VALUE.LENGTH.MAX })
  @Expose()
  textValue?: string | null;

  @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'Created at', type: 'string', format: 'date-time', required: false })
  @Expose()
  createdAt?: Date;
}
