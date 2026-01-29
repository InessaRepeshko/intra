import { ApiProperty } from '@nestjs/swagger';
import { EntityType, REPORT_ANALYTICS_CONSTRAINTS } from '@intra/shared-kernel';
import { ReportAnalyticsDto } from '@intra/shared-kernel';

export class ReportAnalyticsResponse implements ReportAnalyticsDto {
    @ApiProperty({ example: 1, description: 'Analytics ID', required: true, type: 'number' })
    id!: number;

    @ApiProperty({ example: 1, description: 'Report ID', required: true, type: 'number' })
    reportId!: number;

    @ApiProperty({ enum: EntityType, example: EntityType.QUESTION, description: 'Entity type', required: true })
    entityType!: EntityType;

    @ApiProperty({ example: 1, description: 'Question ID', required: false, type: 'number', nullable: true })
    questionId?: number | null;

    @ApiProperty({ example: 'Listens actively before responding.', description: 'Question title', required: false, type: 'string', nullable: true, minimum: REPORT_ANALYTICS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MIN, maximum: REPORT_ANALYTICS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MAX })
    questionTitle?: string | null;

    @ApiProperty({ example: 1, description: 'Competence ID', required: false, type: 'number', nullable: true })
    competenceId?: number | null;

    @ApiProperty({ example: 'Leadership', description: 'Competence title', required: false, type: 'string', nullable: true, minimum: REPORT_ANALYTICS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MIN, maximum: REPORT_ANALYTICS_CONSTRAINTS.ENTITY_TITLE.LENGTH.MAX })
    competenceTitle?: string | null;

    @ApiProperty({ example: 4.0, description: 'Average score by self assessment', required: false, type: 'number', format: 'float', nullable: true, minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    averageBySelfAssessment?: number | null;

    @ApiProperty({ example: 5.0, description: 'Average score by team', required: false, type: 'number', format: 'float', nullable: true, minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    averageByTeam?: number | null;

    @ApiProperty({ example: 5.0, description: 'Average score by other', required: false, type: 'number', format: 'float', nullable: true, minimum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MIN, maximum: REPORT_ANALYTICS_CONSTRAINTS.SCORE.MAX })
    averageByOther?: number | null;

    @ApiProperty({ example: +20.0, description: 'Delta score by self assessment', required: false, type: 'number', format: 'signed float', nullable: true, minimum: REPORT_ANALYTICS_CONSTRAINTS.DELTA_PERCENTAGE.MIN, maximum: REPORT_ANALYTICS_CONSTRAINTS.DELTA_PERCENTAGE.MAX })
    deltaBySelfAssessment?: number | null;

    @ApiProperty({ example: +15.0, description: 'Delta score by team', required: false, type: 'number', format: 'signed float', nullable: true, minimum: REPORT_ANALYTICS_CONSTRAINTS.DELTA_PERCENTAGE.MIN, maximum: REPORT_ANALYTICS_CONSTRAINTS.DELTA_PERCENTAGE.MAX })
    deltaByTeam?: number | null;

    @ApiProperty({ example: -10.0, description: 'Delta score by other', required: false, type: 'number', format: 'signed float', nullable: true, minimum: REPORT_ANALYTICS_CONSTRAINTS.DELTA_PERCENTAGE.MIN, maximum: REPORT_ANALYTICS_CONSTRAINTS.DELTA_PERCENTAGE.MAX })
    deltaByOther?: number | null;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Created at', required: true, type: 'string' })
    createdAt!: Date;
}
