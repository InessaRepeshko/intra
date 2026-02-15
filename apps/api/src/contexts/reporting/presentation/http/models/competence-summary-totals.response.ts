import {
    REPORT_ANALYTICS_CONSTRAINTS,
    ReportEntitySummaryTotalsDto,
} from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';

export class CompetenceSummaryTotalsResponse implements ReportEntitySummaryTotalsDto {
    @ApiProperty({
        example: 4.2,
        description:
            'Average competence score across all competencies by self assessment',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    averageBySelfAssessment?: number | null;

    @ApiProperty({
        example: 4.3,
        description: 'Average competence score across all competencies by team',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    averageByTeam?: number | null;

    @ApiProperty({
        example: 4.1,
        description:
            'Average competence score across all competencies by other respondents',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    averageByOther?: number | null;

    @ApiProperty({
        example: 84.0,
        description:
            'Self assessment average expressed as percentage of scale maximum',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    percentageBySelfAssessment?: number | null;

    @ApiProperty({
        example: 86.0,
        description: 'Team average expressed as percentage of scale maximum',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    percentageByTeam?: number | null;

    @ApiProperty({
        example: 82.0,
        description:
            'Other respondents average expressed as percentage of scale maximum',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    percentageByOther?: number | null;

    @ApiProperty({
        example: +10.0,
        description: 'Delta between self and team averages (%)',
        type: 'number',
        format: 'signed float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    deltaPercentageByTeam?: number | null;

    @ApiProperty({
        example: -5.0,
        description: 'Delta between self and other averages (%)',
        type: 'number',
        format: 'signed float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    deltaPercentageByOther?: number | null;
}
