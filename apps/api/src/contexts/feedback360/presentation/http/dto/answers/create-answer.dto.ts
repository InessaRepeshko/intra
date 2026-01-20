import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, ValidateIf } from 'class-validator';
import { ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { RespondentCategory } from 'src/contexts/feedback360/domain/enums/respondent-category.enum';
import { AnswerType } from 'src/contexts/library/domain/enums/answer-type.enum';

export class CreateAnswerDto {
  @ApiProperty({ example: 12, description: 'Question from library' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  libraryQuestionId!: number;

  @ApiPropertyOptional({ example: 5, description: 'Question from custom cycle list' })
  @ToOptionalInt({ min: 1 })
  @IsOptional()
  @IsInt()
  reviewQuestionId?: number;

  @ApiProperty({ enum: RespondentCategory, example: RespondentCategory.TEAM })
  @IsEnum(RespondentCategory)
  respondentCategory!: RespondentCategory;

  @ApiProperty({ enum: AnswerType, example: AnswerType.NUMERICAL_SCALE })
  @IsEnum(AnswerType)
  answerType!: AnswerType;

  @ApiPropertyOptional({ example: 4, description: 'Numerical score' })
  @ToOptionalInt()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  numericalValue?: number;

  @ApiPropertyOptional({ example: 'Good progress', description: 'Text answer' })
  @ToOptionalTrimmedString()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @ValidateIf((obj) => obj.answerType)
  textValue?: string;
}
