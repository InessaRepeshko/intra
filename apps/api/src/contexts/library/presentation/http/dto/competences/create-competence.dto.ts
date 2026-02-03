import { COMPETENCE_CONSTRAINTS } from '@intra/shared-kernel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { ToOptionalTrimmedString } from 'src/common/transforms/query-sanitize.transform';

export class CreateCompetenceDto {
    @ApiPropertyOptional({
        description: 'Optional competence code',
        example: 'ENG-001',
        nullable: true,
        minimum: COMPETENCE_CONSTRAINTS.CODE.LENGTH.MIN,
        maximum: COMPETENCE_CONSTRAINTS.CODE.LENGTH.MAX,
        type: 'string',
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: COMPETENCE_CONSTRAINTS.CODE.LENGTH.MIN,
        max: COMPETENCE_CONSTRAINTS.CODE.LENGTH.MAX,
    })
    @IsString()
    @MinLength(COMPETENCE_CONSTRAINTS.CODE.LENGTH.MIN)
    @MaxLength(COMPETENCE_CONSTRAINTS.CODE.LENGTH.MAX)
    code?: string | null;

    @ApiProperty({
        description: 'Competence title',
        example: 'Engineering excellence',
        minimum: COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MIN,
        maximum: COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MAX,
        type: 'string',
    })
    @ToOptionalTrimmedString({
        min: COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MIN,
        max: COMPETENCE_CONSTRAINTS.TITLE.LENGTH.MAX,
    })
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
        type: 'string',
    })
    @IsOptional()
    @ToOptionalTrimmedString({
        min: COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN,
        max: COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX,
    })
    @IsString()
    @MinLength(COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MIN)
    @MaxLength(COMPETENCE_CONSTRAINTS.DESCRIPTION.LENGTH.MAX)
    description?: string | null;
}
