import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RespondentCategory } from '../../../domain/enums/respondent-category.enum';
import { AnswerType } from 'src/contexts/library/domain/enums/answer-type.enum';

export class AnswerResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 2 })
  @Expose()
  reviewId!: number;

  @ApiProperty({ example: 10 })
  @Expose()
  libraryQuestionId!: number;

  @ApiPropertyOptional({ example: 5 })
  @Expose()
  reviewQuestionId?: number | null;

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
