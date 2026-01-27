import {
    IdentityRole,
    IdentityStatus,
    USER_CONSTRAINTS,
} from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponse {
    @ApiProperty({ example: 1, description: 'User ID', type: 'number' })
    @Expose()
    id!: number;

    @ApiProperty({
        example: 'Valerii',
        description: 'User first name',
        type: 'string',
        minimum: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.NAME.LENGTH.MAX,
    })
    @Expose()
    firstName!: string;

    @ApiProperty({
        example: 'Valeriiovych',
        description: 'User second name',
        type: 'string',
        nullable: true,
        minimum: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.NAME.LENGTH.MAX,
    })
    @Expose()
    secondName!: string | null;

    @ApiProperty({
        example: 'Velychko',
        description: 'User last name',
        type: 'string',
        minimum: USER_CONSTRAINTS.NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.NAME.LENGTH.MAX,
    })
    @Expose()
    lastName!: string;

    @ApiProperty({
        example: 'Valerii Valeriiovych Velychko',
        description: 'User full name',
        type: 'string',
        nullable: true,
        minimum: USER_CONSTRAINTS.FULL_NAME.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.FULL_NAME.LENGTH.MAX,
    })
    @Expose()
    fullName!: string | null;

    @ApiProperty({
        example: 'valerii.velychko@example.com',
        description: 'User email',
        type: 'string',
        minimum: USER_CONSTRAINTS.EMAIL.LENGTH.MIN,
        maximum: USER_CONSTRAINTS.EMAIL.LENGTH.MAX,
    })
    @Expose()
    email!: string;

    @ApiProperty({
        enum: IdentityStatus,
        example: IdentityStatus.ACTIVE,
        description: 'User status',
        type: 'string',
    })
    @Expose()
    status!: IdentityStatus;

    @ApiProperty({
        type: Number,
        example: 1,
        nullable: true,
        description: 'User position ID',
    })
    @Expose()
    positionId!: number | null;

    @ApiProperty({
        type: Number,
        example: 10,
        nullable: true,
        description: 'User team ID',
    })
    @Expose()
    teamId!: number | null;

    @ApiProperty({
        type: Number,
        example: 2,
        nullable: true,
        description: 'User manager ID',
    })
    @Expose()
    managerId!: number | null;

    @ApiProperty({
        enum: IdentityRole,
        isArray: true,
        example: [IdentityRole.EMPLOYEE],
        description: 'User roles',
        type: 'string',
    })
    @Expose()
    roles!: IdentityRole[];

    @ApiProperty({
        example: '2024-01-01T10:00:00.000Z',
        description: 'User creation date',
        type: 'string',
        format: 'date-time',
    })
    @Expose()
    createdAt!: Date;

    @ApiProperty({
        example: '2024-01-02T10:00:00.000Z',
        description: 'User update date',
        type: 'string',
        format: 'date-time',
    })
    @Expose()
    updatedAt!: Date;
}
