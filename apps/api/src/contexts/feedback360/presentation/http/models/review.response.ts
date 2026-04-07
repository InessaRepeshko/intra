import {
    REVIEW_CONSTRAINTS,
    ReviewDto,
    ReviewStage,
} from '@intra/shared-kernel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReviewResponse implements ReviewDto {
    @ApiProperty({
        example: 1,
        description: 'Review id',
        type: 'number',
        required: true,
    })
    @Expose()
    id!: number;

    @ApiProperty({
        example: 10,
        description: 'Ratee id',
        type: 'number',
        required: true,
    })
    @Expose()
    rateeId!: number;

    @ApiProperty({
        example: 'Valerii Velychko',
        description: 'Ratee full name',
        type: 'string',
        required: true,
        minimum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @Expose()
    rateeFullName!: string;

    @ApiProperty({
        example: 3,
        description: 'Ratee position id',
        type: 'number',
        required: true,
    })
    @Expose()
    rateePositionId!: number;

    @ApiProperty({
        example: 'Senior Engineer',
        description: 'Ratee position title',
        type: 'string',
        required: true,
        minimum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX,
    })
    @Expose()
    rateePositionTitle!: string;

    @ApiProperty({
        example: 2,
        description: 'HR id',
        type: 'number',
        required: true,
    })
    @Expose()
    hrId!: number;

    @ApiProperty({
        example: 'Anna Boyko',
        description: 'HR full name',
        type: 'string',
        required: true,
        minimum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @Expose()
    hrFullName!: string;

    @ApiPropertyOptional({
        example: 'HR comment',
        description: 'HR note',
        type: 'string',
        required: false,
        nullable: true,
        minimum: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.HR_NOTE.LENGTH.MAX,
    })
    @Expose()
    hrNote?: string | null;

    @ApiPropertyOptional({
        example: 2,
        description: 'Team id',
        type: 'number',
        required: false,
        nullable: true,
    })
    @Expose()
    teamId?: number | null;

    @ApiPropertyOptional({
        example: 'Platform team',
        description: 'Team title',
        type: 'string',
        required: false,
        nullable: true,
        minimum: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.TEAM_TITLE.LENGTH.MAX,
    })
    @Expose()
    teamTitle?: string | null;

    @ApiPropertyOptional({
        example: 5,
        description: 'Manager id',
        type: 'number',
        required: false,
        nullable: true,
    })
    @Expose()
    managerId?: number | null;

    @ApiPropertyOptional({
        example: 'John Doe',
        description: 'Manager full name',
        type: 'string',
        required: false,
        nullable: true,
        minimum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @Expose()
    managerFullName?: string | null;

    @ApiPropertyOptional({
        example: 2,
        description: 'Manager position id',
        type: 'number',
        required: false,
        nullable: true,
    })
    @Expose()
    managerPositionId?: number | null;

    @ApiPropertyOptional({
        example: 'Senior Engineer',
        description: 'Manager position title',
        type: 'string',
        required: false,
        nullable: true,
        minimum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN,
        maximum: REVIEW_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX,
    })
    @Expose()
    managerPositionTitle?: string | null;

    @ApiPropertyOptional({
        example: 1,
        description: 'Cycle id',
        type: 'number',
        required: false,
        nullable: true,
    })
    @Expose()
    cycleId?: number | null;

    @ApiProperty({
        enum: ReviewStage,
        example: ReviewStage.NEW,
        description: 'Review stage',
        type: 'string',
        required: true,
    })
    @Expose()
    stage!: ReviewStage;

    @ApiPropertyOptional({
        example: 1,
        description: 'Report id',
        type: 'number',
        required: false,
        nullable: true,
    })
    @Expose()
    reportId?: number | null;

    @ApiProperty({
        example: '2025-01-01T00:00:00.000Z',
        description: 'Created at',
        type: 'string',
        format: 'date-time',
    })
    @Expose()
    createdAt!: Date;

    @ApiProperty({
        example: '2025-01-01T00:00:00.000Z',
        description: 'Updated at',
        type: 'string',
        format: 'date-time',
    })
    @Expose()
    updatedAt!: Date;
}
