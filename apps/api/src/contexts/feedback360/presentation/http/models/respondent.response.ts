import {
    RESPONDENT_CONSTRAINTS,
    RespondentCategory,
    RespondentDto,
    ResponseStatus,
} from '@intra/shared-kernel';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RespondentResponse implements RespondentDto {
    @ApiProperty({
        example: 1,
        description: 'Respondent id',
        type: 'number',
        required: true,
    })
    @Expose()
    id!: number;

    @ApiProperty({
        example: 2,
        description: 'Review id',
        type: 'number',
        required: true,
    })
    @Expose()
    reviewId!: number;

    @ApiProperty({
        example: 7,
        description: 'Respondent id',
        type: 'number',
        required: true,
    })
    @Expose()
    respondentId!: number;

    @ApiProperty({
        example: 'Ivanna Bulava',
        description: 'Respondent full name',
        type: 'string',
        required: true,
        minimum: RESPONDENT_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: RESPONDENT_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @Expose()
    fullName!: string;

    @ApiProperty({
        enum: RespondentCategory,
        description: 'Respondent category',
        type: 'string',
        required: true,
    })
    @Expose()
    category!: RespondentCategory;

    @ApiProperty({
        enum: ResponseStatus,
        description: 'Response status',
        type: 'string',
        required: true,
    })
    @Expose()
    responseStatus!: ResponseStatus;

    @ApiPropertyOptional({
        example: 'Unable to participate due to hospitalisation',
        description: 'Respondent note',
        type: 'string',
        required: false,
        nullable: true,
        minimum: RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MIN,
        maximum: RESPONDENT_CONSTRAINTS.RESPONDENT_NOTE.LENGTH.MAX,
    })
    @Expose()
    respondentNote?: string | null;

    @ApiPropertyOptional({
        example: 'Completion of probationary period',
        description: 'HR note',
        type: 'string',
        required: false,
        nullable: true,
        minimum: RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MIN,
        maximum: RESPONDENT_CONSTRAINTS.HR_NOTE.LENGTH.MAX,
    })
    @Expose()
    hrNote?: string | null;

    @ApiProperty({
        example: 3,
        description: 'Position id',
        type: 'number',
        required: true,
    })
    @Expose()
    positionId!: number;

    @ApiProperty({
        example: 'Senior Engineer',
        description: 'Position title',
        type: 'string',
        required: true,
        minimum: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN,
        maximum: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX,
    })
    @Expose()
    positionTitle!: string;

    @ApiProperty({
        example: 3,
        description: 'Team id',
        type: 'number',
        required: false,
        nullable: true,
    })
    @Expose()
    teamId?: number | null;

    @ApiProperty({
        example: 'Senior Engineer',
        description: 'Position title',
        type: 'string',
        required: false,
        nullable: true,
        minimum: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MIN,
        maximum: RESPONDENT_CONSTRAINTS.POSITION_TITLE.LENGTH.MAX,
    })
    @Expose()
    teamTitle?: string | null;

    @ApiPropertyOptional({
        example: '2025-01-01T00:00:00.000Z',
        description: 'Invited at',
        type: 'string',
        format: 'date-time',
        required: false,
        nullable: true,
    })
    @Expose()
    invitedAt?: Date | null;

    @ApiPropertyOptional({
        example: '2025-01-01T00:00:00.000Z',
        description: 'Canceled at',
        type: 'string',
        format: 'date-time',
        required: false,
        nullable: true,
    })
    @Expose()
    canceledAt?: Date | null;

    @ApiPropertyOptional({
        example: '2025-01-01T00:00:00.000Z',
        description: 'Responded at',
        type: 'string',
        format: 'date-time',
        required: false,
        nullable: true,
    })
    @Expose()
    respondedAt?: Date | null;

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
