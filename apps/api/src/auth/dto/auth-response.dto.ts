import { AuthDto, AuthSession, AuthUser } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto implements AuthUser {
    @ApiProperty({
        description: 'User ID',
        example: 1,
        type: 'number',
        required: true,
        nullable: false,
    })
    id!: string;

    @ApiProperty({
        description: 'User name',
        example: 'John Doe',
        type: 'string',
        required: false,
        nullable: true,
    })
    name?: string;

    @ApiProperty({
        description: 'User email',
        example: 'john.doe@gmail.com',
        type: 'string',
        required: true,
        nullable: false,
    })
    email!: string;

    @ApiProperty({
        description: 'Email verification status',
        example: true,
        type: 'boolean',
        required: true,
        nullable: false,
    })
    emailVerified!: boolean;

    @ApiProperty({
        description: 'User image',
        example: 'https://lh3.googleusercontent.com/link-to-image',
        type: 'string',
        required: false,
        nullable: true,
    })
    image?: string;

    @ApiProperty({
        description: 'User creation date',
        example: '2022-01-01T00:00:00.000Z',
        type: 'string',
        required: false,
        nullable: true,
    })
    createdAt?: string;

    @ApiProperty({
        description: 'User update date',
        example: '2022-01-01T00:00:00.000Z',
        type: 'string',
        required: false,
        nullable: true,
    })
    updatedAt?: string;
}

export class AuthSessionDto implements AuthSession {
    @ApiProperty({
        description: 'Session token',
        example: 'eyJhbGciOcCI6IkpXVCJ9...',
        type: 'string',
        required: true,
        nullable: false,
    })
    token!: string;

    @ApiProperty({
        description: 'User data',
        type: AuthUserDto,
        required: true,
        nullable: false,
    })
    user!: AuthUserDto;

    @ApiProperty({
        description: 'Redirect flag',
        example: false,
        type: 'boolean',
        required: true,
        nullable: false,
    })
    redirect!: boolean;
}

export class AuthResponseDto implements AuthDto {
    @ApiProperty({
        description: 'ID of the logged in user',
        example: 1,
        type: 'number',
        required: true,
        nullable: false,
    })
    userId!: number;

    @ApiProperty({
        description: 'Session data',
        type: AuthSessionDto,
        required: true,
        nullable: false,
    })
    session!: AuthSessionDto;
}
