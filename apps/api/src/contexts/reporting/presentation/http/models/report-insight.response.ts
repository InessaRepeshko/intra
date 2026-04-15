import {
    EntityType,
    InsightType,
    REPORT_INSIGHTS_CONSTRAINTS,
    ReportInsightDto,
} from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';

export class ReportInsightResponse implements ReportInsightDto {
    @ApiProperty({
        example: 1,
        description: 'Analytics ID',
        required: true,
        type: 'number',
    })
    id!: number;

    @ApiProperty({
        example: 1,
        description: 'Report ID',
        required: true,
        type: 'number',
    })
    reportId!: number;

    @ApiProperty({
        enum: InsightType,
        example: InsightType.HIGHEST_RATING,
        description: 'Insight type',
        required: true,
    })
    insightType!: InsightType;

    @ApiProperty({
        enum: EntityType,
        example: EntityType.QUESTION,
        description: 'Entity type',
        required: true,
    })
    entityType!: EntityType;

    @ApiProperty({
        example: 1,
        description: 'Question ID',
        required: true,
        type: 'number',
        nullable: true,
    })
    questionId!: number | null;

    @ApiProperty({
        example: 'Listens actively before responding.',
        description: 'Question title',
        required: true,
        type: 'string',
        nullable: true,
        minimum: REPORT_INSIGHTS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MIN,
        maximum: REPORT_INSIGHTS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MAX,
    })
    questionTitle!: string | null;

    @ApiProperty({
        example: 1,
        description: 'Competence ID',
        required: false,
        type: 'number',
        nullable: true,
    })
    competenceId!: number | null;

    @ApiProperty({
        example: 'Leadership',
        description: 'Competence title',
        required: true,
        type: 'string',
        nullable: true,
        minimum: REPORT_INSIGHTS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MIN,
        maximum: REPORT_INSIGHTS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MAX,
    })
    competenceTitle!: string | null;

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
