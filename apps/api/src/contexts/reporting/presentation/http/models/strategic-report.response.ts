import { REPORT_CONSTRAINTS, StrategicReportDto } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { StrategicReportInsightResponse } from './startegic-report-insight.response';
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
        required: true,
        nullable: false,
    })
    @Expose()
    cycleId!: number;

    @ApiProperty({
        example: 'Annual review 2025',
        description: 'Cycle title',
        type: 'string',
        required: true,
        nullable: false,
    })
    @Expose()
    cycleTitle!: string;

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
        example: [1, 2, 3],
        description: 'Ratee ids',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    rateeIds!: number[];

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
        example: [1, 2, 3],
        description: 'Respondent ids',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    respondentIds!: number[];

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
        example: [1, 2, 3],
        description: 'Reviewer ids',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    reviewerIds!: number[];

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
        example: [1, 2, 3],
        description: 'Team ids',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    teamIds!: number[];

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
        example: [1, 2, 3],
        description: 'Position ids',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    positionIds!: number[];

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
        example: [1, 2, 3],
        description: 'Competence ids',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    competenceIds!: number[];

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
        example: [1, 2, 3],
        description: 'Question ids',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    questionIds!: number[];

    @ApiProperty({
        example: 100.0,
        description: 'Average turnout of ratees',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    turnoutAvgPctOfRatees?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Average turnout of team respondents',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    turnoutAvgPctOfTeams?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Average turnout of other respondents',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    turnoutAvgPctOfOthers?: number | null;

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

    @ApiProperty({
        type: StrategicReportInsightResponse,
        isArray: true,
        default: [],
        nullable: false,
        required: true,
        description: 'Strategic report competence insights',
    })
    @Expose()
    insights!: StrategicReportInsightResponse[];
}
