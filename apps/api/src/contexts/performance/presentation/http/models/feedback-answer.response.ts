import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RespondentCategory } from '../../../domain/respondent-category.enum';
import { AnswerType } from 'src/contexts/library/domain/answer-type.enum';

export class FeedbackAnswerResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  feedback360Id!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  questionId!: number;

  @ApiPropertyOptional({ example: 5 })
  @Expose()
  feedback360QuestionId?: number | null;

  @ApiProperty({ enum: RespondentCategory })
  @Expose()
  respondentCategory!: RespondentCategory;

  @ApiProperty({ enum: AnswerType })
  @Expose()
  answerType!: AnswerType;

  @ApiPropertyOptional({ example: 4 })
  @Expose()
  numericalValue?: number | null;

  @ApiPropertyOptional({ example: 'Comment' })
  @Expose()
  textValue?: string | null;

  @ApiPropertyOptional({ type: String })
  @Expose()
  createdAt?: Date;
}
