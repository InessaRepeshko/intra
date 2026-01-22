import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ToOptionalEnum } from 'src/common/transforms/query-sanitize.transform';
import { RespondentCategory } from '@intra/shared-kernel';

export class AnswerQueryDto {
  @ApiPropertyOptional({ enum: RespondentCategory })
  @ToOptionalEnum(RespondentCategory)
  @IsOptional()
  @IsEnum(RespondentCategory)
  respondentCategory?: RespondentCategory;
}
