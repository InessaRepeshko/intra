import { User as PrismaUser, users_status } from "@prisma/client";
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export const SERIALIZATION_GROUPS = {
    BASIC: ['basic'],
    CONFIDENTIAL: ['basic', 'confidential'],
    PRIVATE: ['basic', 'confidential', 'private'],
};

export class User implements PrismaUser {
    @ApiProperty({
        description: 'The ID of the user',
        example: 1,
    })
    @Expose({ groups: SERIALIZATION_GROUPS.BASIC })
    id: number;

    @ApiProperty({
        description: 'The first name of the user',
        example: 'John',
    })
    @Expose({ groups: SERIALIZATION_GROUPS.BASIC })
    firstName: string;
    
    @ApiProperty({
        description: 'The second name of the user',
        example: 'Doe',
    })
    @Expose({ groups: SERIALIZATION_GROUPS.BASIC })
    secondName: string | null;
    
    @ApiProperty({
        description: 'The last name of the user',
        example: 'Smith',
    })
    @Expose({ groups: SERIALIZATION_GROUPS.BASIC })
    lastName: string;
    
    @ApiProperty({
        description: 'The full name of the user',
        example: 'John Doe Smith',
    })
    @Expose({ groups: SERIALIZATION_GROUPS.BASIC })
    fullName: string | null;
    
    @ApiProperty({
        description: 'The email of the user',
        example: 'john.doe@example.com',
    })
    @Expose({ groups: SERIALIZATION_GROUPS.BASIC })
    email: string;
    
    @ApiProperty({
        description: 'The password hash of the user',
        example: '1234567890',
    })
    @Expose({ groups: SERIALIZATION_GROUPS.CONFIDENTIAL })
    passwordHash: string;
    
    @ApiProperty({
        description: 'The status of the user',
        example: 'active',
    })
    @Expose({ groups: SERIALIZATION_GROUPS.CONFIDENTIAL })
    status: users_status;
    
    @ApiProperty({
        description: 'The position ID of the user',
        example: 1,
    })
    @Expose({ groups: SERIALIZATION_GROUPS.CONFIDENTIAL })
    positionId: number;
    
    @ApiProperty({
        description: 'The team ID of the user',
        example: 1,
    })
    @Expose({ groups: SERIALIZATION_GROUPS.BASIC })
    teamId: number;
    
    @ApiProperty({
        description: 'The manager ID of the user',
        example: 1,
    })
    @Expose({ groups: SERIALIZATION_GROUPS.CONFIDENTIAL })
    managerId: number;
    
    @ApiProperty({
        description: 'The created at date of the user',
        example: '2021-01-01',
    })
    @Expose({ groups: SERIALIZATION_GROUPS.CONFIDENTIAL })
    createdAt: Date;
    
    @ApiProperty({
        description: 'The updated at date of the user',
        example: '2021-01-01',
    })
    @Expose({ groups: SERIALIZATION_GROUPS.CONFIDENTIAL })
    updatedAt: Date;
}   