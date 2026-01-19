import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ToOptionalEnum } from 'src/common/transforms/query-sanitize.transform';
import { RespondentCategory } from 'src/contexts/performance/domain/respondent-category.enum';

export class AnswerQueryDto {
  @ApiPropertyOptional({ enum: RespondentCategory })
  @ToOptionalEnum(RespondentCategory)
  @IsOptional()
  @IsEnum(RespondentCategory)
  respondentCategory?: RespondentCategory;
}
