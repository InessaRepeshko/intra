import { ApiProperty } from '@nestjs/swagger';
import { ReportAnalyticsResponse } from './report-analytics.response';
import { ReportCommentResponse } from './report-comment.response';
import { REPORT_CONSTRAINTS, ReportDto } from '@intra/shared-kernel';
import { Expose } from 'class-transformer';

export class ReportResponse implements ReportDto {
    @ApiProperty({ example: 1, description: 'Report id', type: 'number', required: true, nullable: false })
    @Expose()
    id!: number;

    @ApiProperty({ example: 1, description: 'Review id', type: 'number', required: true, nullable: false })
    @Expose()
    reviewId!: number;

    @ApiProperty({ example: 1, description: 'Cycle id', type: 'number', required: false, nullable: true })
    @Expose()
    cycleId?: number | null;

    @ApiProperty({ example: 10, description: 'Respondent count', type: 'number', required: true, nullable: false, minimum: REPORT_CONSTRAINTS.RESPONDENT_COUNT.MIN })
    @Expose()
    respondentCount!: number;

    @ApiProperty({ example: 100.0, description: 'Turnout of team', type: 'number', format: 'float', required: false, nullable: true, minimum: REPORT_CONSTRAINTS.TURNOUT_PERCENTAGE.MIN, maximum: REPORT_CONSTRAINTS.TURNOUT_PERCENTAGE.MAX })
    @Expose()
    turnoutOfTeam?: number | null;

    @ApiProperty({ example: 100.0, description: 'Turnout of other', type: 'number', format: 'float', required: false, nullable: true, minimum: REPORT_CONSTRAINTS.TURNOUT_PERCENTAGE.MIN, maximum: REPORT_CONSTRAINTS.TURNOUT_PERCENTAGE.MAX })
    @Expose()
    turnoutOfOther?: number | null;

    @ApiProperty({ example: 4.0, description: 'Total average score by self assessment', type: 'number', format: 'float', required: false, nullable: true, minimum: REPORT_CONSTRAINTS.SCORE.MIN, maximum: REPORT_CONSTRAINTS.SCORE.MAX })
    @Expose()
    totalAverageBySelfAssessment?: number | null;

    @ApiProperty({ example: 4.5, description: 'Total average score by team', type: 'number', format: 'float', required: false, nullable: true, minimum: REPORT_CONSTRAINTS.SCORE.MIN, maximum: REPORT_CONSTRAINTS.SCORE.MAX })
    @Expose()
    totalAverageByTeam?: number | null;

    @ApiProperty({ example: 5.0, description: 'Total average score by others', type: 'number', format: 'float', required: false, nullable: true, minimum: REPORT_CONSTRAINTS.SCORE.MIN, maximum: REPORT_CONSTRAINTS.SCORE.MAX })
    @Expose()
    totalAverageByOthers?: number | null;

    @ApiProperty({ example: +20.0, description: 'Total score delta by self assessment', type: 'number', format: 'signed float', required: false, nullable: true, minimum: REPORT_CONSTRAINTS.DELTA_PERCENTAGE.MIN, maximum: REPORT_CONSTRAINTS.DELTA_PERCENTAGE.MAX })
    @Expose()
    totalDeltaBySelfAssessment?: number | null;

    @ApiProperty({ example: +15.0, description: 'Total score delta by team', type: 'number', format: 'signed float', required: false, nullable: true, minimum: REPORT_CONSTRAINTS.DELTA_PERCENTAGE.MIN, maximum: REPORT_CONSTRAINTS.DELTA_PERCENTAGE.MAX })
    @Expose()
    totalDeltaByTeam?: number | null;

    @ApiProperty({ example: -10.0, description: 'Total score delta by others', type: 'number', format: 'signed float', required: false, nullable: true, minimum: REPORT_CONSTRAINTS.DELTA_PERCENTAGE.MIN, maximum: REPORT_CONSTRAINTS.DELTA_PERCENTAGE.MAX })
    @Expose()
    totalDeltaByOthers?: number | null;

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Created at', type: 'string', format: 'date-time' })
    @Expose()
    createdAt!: Date;

    @ApiProperty({
        type: ReportAnalyticsResponse,
        isArray: true,
        default: [],
        nullable: false,
        required: true,
        description: 'Review score analytics',
    })
    @Expose()
    analytics!: ReportAnalyticsResponse[];

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
