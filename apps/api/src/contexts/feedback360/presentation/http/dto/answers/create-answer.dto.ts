import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, ValidateIf } from 'class-validator';
import { ToOptionalInt, ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { RespondentCategory } from '@intra/shared-kernel';
import { AnswerType } from '@intra/shared-kernel';

export class CreateAnswerDto {
  @ApiProperty({ example: 12, description: 'Питання з відгуку' })
  @ToOptionalInt({ min: 1 })
  @IsInt()
  @Min(1)
  questionId!: number;

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
