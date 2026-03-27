import { REPORT_CONSTRAINTS, StrategicReportDto } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { StrategicReportAnalyticsResponse } from './strategic-report-analytics.response';

export class StrategicReportResponse implements StrategicReportDto {
    @ApiProperty({
        example: 1,
        description: 'Report id',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    id!: number;

    @ApiProperty({
        example: 1,
        description: 'Cycle id',
        type: 'number',
        required: false,
        nullable: true,
    })
    @Expose()
    cycleId?: number | null;

    @ApiProperty({
        example: 10,
        description: 'Ratee count',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    rateeCount!: number;

    @ApiProperty({
        example: 10,
        description: 'Respondent count',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    respondentCount!: number;

    @ApiProperty({
        example: 10,
        description: 'Answer count',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    answerCount!: number;

    @ApiProperty({
        example: 10,
        description: 'Reviewer count',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    reviewerCount!: number;

    @ApiProperty({
        example: 10,
        description: 'Team count',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    teamCount!: number;

    @ApiProperty({
        example: 10,
        description: 'Position count',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    positionCount!: number;

    @ApiProperty({
        example: 10,
        description: 'Competence count',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    competenceCount!: number;

    @ApiProperty({
        example: 10,
        description: 'Question count',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    questionCount!: number;

    @ApiProperty({
        example: 100.0,
        description: 'Turnout of ratees',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    turnoutPctOfRatees?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Turnout of respondents',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    turnoutPctOfRespondents?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Competence general average self',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    competenceGeneralAvgSelf?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Competence general average team',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    competenceGeneralAvgTeam?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Competence general average other',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    competenceGeneralAvgOther?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Competence general percentage self',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    competenceGeneralPctSelf?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Competence general percentage team',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    competenceGeneralPctTeam?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Competence general percentage other',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    competenceGeneralPctOther?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Competence general delta team',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    competenceGeneralDeltaTeam?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Competence general delta other',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    competenceGeneralDeltaOther?: number | null;

    @ApiProperty({
        example: '2025-01-01T00:00:00.000Z',
        description: 'Created at',
        type: 'string',
        format: 'date-time',
    })
    @Expose()
    createdAt!: Date;

    @ApiProperty({
        type: StrategicReportAnalyticsResponse,
        isArray: true,
        default: [],
        nullable: false,
        required: true,
        description: 'Strategic report analytics',
    })
    @Expose()
    analytics!: StrategicReportAnalyticsResponse[];
}
