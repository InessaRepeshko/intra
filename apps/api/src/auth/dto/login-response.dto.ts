import { AuthResponseDto } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto implements AuthResponseDto {
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
        example: {},
        type: 'object',
        additionalProperties: true,
    })
    session!: unknown;
}
