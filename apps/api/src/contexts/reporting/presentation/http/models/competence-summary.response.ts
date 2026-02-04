import {
    REPORT_ANALYTICS_CONSTRAINTS,
    ReportCompetenceSummaryDto,
} from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';

export class CompetenceSummaryResponse implements ReportCompetenceSummaryDto {
    @ApiProperty({
        example: 12,
        description: 'Competence identifier',
        type: 'number',
        required: true,
    })
    competenceId!: number;

    @ApiProperty({
        example: 'Strategic Thinking',
        description: 'Competence title',
        type: 'string',
        nullable: true,
        required: false,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MAX,
    })
    competenceTitle?: string | null;

    @ApiProperty({
        example: 4.1,
        description: 'Average score by self assessment',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    averageBySelfAssessment?: number | null;

    @ApiProperty({
        example: 4.3,
        description: 'Average score by team',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    averageByTeam?: number | null;

    @ApiProperty({
        example: 4.0,
        description: 'Average score by other respondents',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    averageByOther?: number | null;

    @ApiProperty({
        example: +5.0,
        description: 'Delta between self and team averages (%)',
        type: 'number',
        format: 'signed float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.DELTA_PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.DELTA_PERCENTAGE.MAX,
    })
    deltaByTeam?: number | null;

    @ApiProperty({
        example: -3.0,
        description: 'Delta between self and other averages (%)',
        type: 'number',
        format: 'signed float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.DELTA_PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.DELTA_PERCENTAGE.MAX,
    })
    deltaByOther?: number | null;
}
