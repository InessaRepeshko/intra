import { ApiProperty } from '@nestjs/swagger';
import { ReportAnalyticsResponse } from './report-analytics.response';
import { ReportCommentResponse } from './report-comment.response';

export class ReportResponse {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    reviewId!: number;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    cycleId?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    turnoutOfTeam?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    turnoutOfOther?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    totalAverageBySelfAssessment?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    totalAverageByTeam?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    totalAverageByOthers?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    totalDeltaBySelfAssessment?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    totalDeltaByTeam?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    totalDeltaByOthers?: number | null;

    @ApiProperty({
        type: ReportAnalyticsResponse,
        isArray: true,
        default: [],
    })
    analytics!: ReportAnalyticsResponse[];

    @ApiProperty({
        type: ReportCommentResponse,
        isArray: true,
        default: [],
    })
    comments!: ReportCommentResponse[];

    @ApiProperty()
    createdAt!: Date;
}
