import {
    REPORT_ANALYTICS_CONSTRAINTS,
    StrategicReportAnalyticsDto,
} from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';

export class StrategicReportAnalyticsResponse implements StrategicReportAnalyticsDto {
    @ApiProperty({
        example: 1,
        description: 'Analytics ID',
        required: true,
        type: 'number',
    })
    id!: number;

    @ApiProperty({
        example: 1,
        description: 'Strategic report ID',
        required: true,
        type: 'number',
    })
    strategicReportId!: number;

    @ApiProperty({
        example: 1,
        description: 'Competence ID',
        required: true,
        type: 'number',
    })
    competenceId!: number;

    @ApiProperty({
        example: 'Leadership',
        description: 'Competence title',
        required: true,
        type: 'string',
        minimum: REPORT_ANALYTICS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MAX,
    })
    competenceTitle!: string;

    @ApiProperty({
        example: 4.0,
        description: 'Average score by self assessment',
        required: false,
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    averageBySelfAssessment?: number | null;

    @ApiProperty({
        example: 5.0,
        description: 'Average score by team',
        required: false,
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    averageByTeam?: number | null;

    @ApiProperty({
        example: 5.0,
        description: 'Average score by other',
        required: false,
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX,
    })
    averageByOther?: number | null;

    @ApiProperty({
        example: 100,
        description: 'Percentage of score by self assessment',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    percentageBySelfAssessment?: number | null;

    @ApiProperty({
        example: 100,
        description: 'Percentage of score by team',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    percentageByTeam?: number | null;

    @ApiProperty({
        example: 100,
        description: 'Percentage of score by other respondents',
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    percentageByOther?: number | null;

    @ApiProperty({
        example: +15.0,
        description: 'Delta score by team',
        required: false,
        type: 'number',
        format: 'signed float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    deltaPercentageByTeam?: number | null;

    @ApiProperty({
        example: -10.0,
        description: 'Delta score by other',
        required: false,
        type: 'number',
        format: 'signed float',
        nullable: true,
        minimum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_ANALYTICS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    deltaPercentageByOther?: number | null;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Created at',
        required: true,
        type: 'string',
    })
    createdAt!: Date;
}
