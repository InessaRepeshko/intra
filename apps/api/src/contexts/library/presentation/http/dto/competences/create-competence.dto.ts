import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { CompetenceConstants } from 'src/common/constants/index';

export class CreateCompetenceDto {
  @ApiPropertyOptional({
    description: 'Optional competence code',
    example: 'ENG-001',
    nullable: true,
    minLength: CompetenceConstants.CODE_MIN_LENGTH,
    maxLength: CompetenceConstants.CODE_MAX_LENGTH,
  })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(CompetenceConstants.CODE_MIN_LENGTH)
  @MaxLength(CompetenceConstants.CODE_MAX_LENGTH)
  code?: string | null;

  @ApiProperty({
    description: 'Competence title',
    example: 'Engineering excellence',
    minLength: CompetenceConstants.TITLE_MIN_LENGTH,
    maxLength: CompetenceConstants.TITLE_MAX_LENGTH,
  })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MinLength(CompetenceConstants.TITLE_MIN_LENGTH)
  @MaxLength(CompetenceConstants.TITLE_MAX_LENGTH)
  title!: string;

  @ApiPropertyOptional({
    description: 'Competence description',
    example: 'Ability to deliver high-quality software',
    nullable: true,
    minLength: CompetenceConstants.DESCRIPTION_MIN_LENGTH,
    maxLength: CompetenceConstants.DESCRIPTION_MAX_LENGTH,
  })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(CompetenceConstants.DESCRIPTION_MIN_LENGTH)
  @MaxLength(CompetenceConstants.DESCRIPTION_MAX_LENGTH)
  description?: string | null;
}

