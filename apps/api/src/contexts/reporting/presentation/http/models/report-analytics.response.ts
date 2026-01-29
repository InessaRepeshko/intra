import { ApiProperty } from '@nestjs/swagger';
import { EntityType } from '@intra/shared-kernel';

export class ReportAnalyticsResponse {
    @ApiProperty()
    id!: number;

    @ApiProperty()
    reportId!: number;

    @ApiProperty({ enum: EntityType })
    entityType!: EntityType;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    entityId?: number | null;

    @ApiProperty()
    entityTitle!: string;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    averageBySelfAssessment?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    averageByTeam?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    averageByOther?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    deltaBySelfAssessment?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    deltaByTeam?: number | null;

    @ApiProperty({ required: false, type: 'number', nullable: true })
    deltaByOther?: number | null;

    @ApiProperty({ required: false, nullable: true })
    dimension?: string | null;

    @ApiProperty()
    createdAt!: Date;
}
