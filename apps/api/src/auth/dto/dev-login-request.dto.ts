import { USER_CONSTRAINTS } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class DevLoginRequestDto {
    @ApiProperty({
        description: 'Email of the user to login as (for development/testing)',
        example: 'john.doe@intra.com',
        type: 'string',
        required: true,
        nullable: false,
        format: 'email',
        pattern: USER_CONSTRAINTS.EMAIL.PATTERN.source,
        maximum: USER_CONSTRAINTS.EMAIL.LENGTH.MAX,
        minimum: USER_CONSTRAINTS.EMAIL.LENGTH.MIN,
    })
    @IsEmail()
    email!: string;
}
