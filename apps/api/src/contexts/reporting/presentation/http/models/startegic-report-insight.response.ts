import {
    InsightType,
    REPORT_INSIGHTS_CONSTRAINTS,
    StrategicReportInsightDto,
} from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';

export class StrategicReportInsightResponse implements StrategicReportInsightDto {
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
        enum: InsightType,
        example: InsightType.HIGHEST_RATING,
        description: 'Insight type',
        required: true,
    })
    insightType!: InsightType;

    @ApiProperty({
        example: 1,
        description: 'Competence ID',
        required: true,
        type: 'number',
        nullable: false,
    })
    competenceId!: number;

    @ApiProperty({
        example: 'Leadership',
        description: 'Competence title',
        required: true,
        type: 'string',
        nullable: false,
        minimum: REPORT_INSIGHTS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MIN,
        maximum: REPORT_INSIGHTS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MAX,
    })
    competenceTitle!: string;

    @ApiProperty({
        example: 4.0,
        description: 'Average score',
        required: true,
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_INSIGHTS_CONSTRAINTS.SCORE.MIN,
        maximum: REPORT_INSIGHTS_CONSTRAINTS.SCORE.MAX,
    })
    averageScore!: number | null;

    @ApiProperty({
        example: 5.0,
        description: 'Average rating',
        required: true,
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_INSIGHTS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_INSIGHTS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    averageRating!: number | null;

    @ApiProperty({
        example: 5.0,
        description: 'Average delta',
        required: true,
        type: 'number',
        format: 'float',
        nullable: true,
        minimum: REPORT_INSIGHTS_CONSTRAINTS.PERCENTAGE.MIN,
        maximum: REPORT_INSIGHTS_CONSTRAINTS.PERCENTAGE.MAX,
    })
    averageDelta!: number | null;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Created at',
        required: true,
        type: 'string',
    })
    createdAt!: Date;
}
