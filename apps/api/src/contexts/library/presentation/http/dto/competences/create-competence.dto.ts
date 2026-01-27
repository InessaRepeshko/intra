import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';
import { COMPETENCE_CONSTRAINTS } from '@intra/shared-kernel';

export class CreateCompetenceDto {
  @ApiPropertyOptional({
    description: 'Optional competence code',
    example: 'ENG-001',
    nullable: true,
    minimum: COMPETENCE_CONSTRAINTS.CODE.LENGTH.MIN,
    maximum: COMPETENCE_CONSTRAINTS.CODE.LENGTH.MAX,
  })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(COMPETENCE_CONSTRAINTS.CODE.LENGTH.MIN)
  @MaxLength(COMPETENCE_CONSTRAINTS.CODE.LENGTH.MAX)
  code?: string | null;

  @ApiProperty({
    description: 'Competence title',
    example: 'Engineering excellence',
    minimum: COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MIN,
    maximum: COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MAX,
  })
  @ToOptionalTrimmedString()
  @IsString()
  @IsNotEmpty()
  @MinLength(COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MIN)
  @MaxLength(COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MAX)
  title!: string;

  @ApiPropertyOptional({
    description: 'Competence description',
    example: 'Ability to deliver high-quality software',
    nullable: true,
    minimum: COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
    maximum: COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
  })
  @IsOptional()
  @ToOptionalTrimmedString()
  @IsString()
  @MinLength(COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
  @MaxLength(COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
  description?: string | null;
}

