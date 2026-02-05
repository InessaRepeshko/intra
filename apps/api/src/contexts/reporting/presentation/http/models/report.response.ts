import { REPORT_CONSTRAINTS, ReportDto } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CompetenceSummaryTotalsResponse } from './competence-summary-totals.response';
import { CompetenceSummaryResponse } from './competence-summary.response';
import { QuestionSummaryTotalsResponse } from './question-summary-totals.response';
import { QuestionSummaryResponse } from './question-summary.response';
import { ReportCommentResponse } from './report-comment.response';

export class ReportResponse implements ReportDto {
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
        description: 'Review id',
        type: 'number',
        required: true,
        nullable: false,
    })
    @Expose()
    reviewId!: number;

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
        description: 'Respondent count',
        type: 'number',
        required: true,
        nullable: false,
        minimum: REPORT_CONSTRAINTS.RESPONDENT_COUNT.MIN,
    })
    @Expose()
    respondentCount!: number;

    @ApiProperty({
        example: 100.0,
        description: 'Turnout of team',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    turnoutPctOfTeam?: number | null;

    @ApiProperty({
        example: 100.0,
        description: 'Turnout of other',
        type: 'number',
        format: 'float',
        required: false,
        nullable: true,
        minimum: REPORT_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_CONSTRAINTS.PERCENTAGE.MAX,
    })
    @Expose()
    turnoutPctOfOther?: number | null;

    @ApiProperty({
        example: '2025-01-01T00:00:00.000Z',
        description: 'Created at',
        type: 'string',
        format: 'date-time',
    })
    @Expose()
    createdAt!: Date;

    @ApiProperty({
        type: QuestionSummaryResponse,
        isArray: true,
        default: [],
        nullable: false,
        required: true,
        description: 'Question-level summary analytics',
    })
    @Expose()
    questionSummaries!: QuestionSummaryResponse[];

    @ApiProperty({
        type: QuestionSummaryTotalsResponse,
        nullable: true,
        required: false,
        description:
            'Aggregated question scores and percentages across all questions',
    })
    @Expose()
    questionSummaryTotals?: QuestionSummaryTotalsResponse | null;

    @ApiProperty({
        type: CompetenceSummaryResponse,
        isArray: true,
        default: [],
        nullable: false,
        required: true,
        description: 'Competence-level summary analytics',
    })
    @Expose()
    competenceSummaries!: CompetenceSummaryResponse[];

    @ApiProperty({
        type: CompetenceSummaryTotalsResponse,
        nullable: true,
        required: false,
        description:
            'Aggregated competence scores and percentages across all competencies',
    })
    @Expose()
    competenceSummaryTotals?: CompetenceSummaryTotalsResponse | null;

    @ApiProperty({
        type: ReportCommentResponse,
        isArray: true,
        default: [],
        nullable: true,
        required: false,
        description: 'Review report comments',
    })
    @Expose()
    comments?: ReportCommentResponse[];
}
