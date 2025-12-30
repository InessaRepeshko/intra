import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ExposeBasic, ExposeSystemic } from '../../../../../common/serialisation/public.serialisation.decorator';
import { UsersStatus } from '../../../domain/user/users-status.enum';

export class User {
    @ApiProperty({
        description: 'The ID of the user',
        example: 1,
    })
    @ExposeBasic()
    id: number;

    @ApiProperty({
        description: 'The first name of the user',
        example: 'John',
    })
    @ExposeBasic()
    firstName: string;
    
    @ApiProperty({
        description: 'The second name of the user',
        example: 'Doe',
    })
    @ExposeBasic()
    secondName: string | null;
    
    @ApiProperty({
        description: 'The last name of the user',
        example: 'Smith',
    })
    @ExposeBasic()
    lastName: string;
    
    @ApiProperty({
        description: 'The full name of the user',
        example: 'John Doe Smith',
    })
    @ExposeBasic()
    fullName: string | null;
    
    @ApiProperty({
        description: 'The email of the user',
        example: 'john.doe@example.com',
    })
    @ExposeBasic()
    email: string;
    
    @ApiProperty({
        description: 'The password hash of the user',
        example: '1234567890',
    })
    @ApiHideProperty()
    @Exclude()
    passwordHash: string;
    
    @ApiProperty({
        description: 'The status of the user',
        example: UsersStatus.ACTIVE,
        enum: UsersStatus,
    })
    @ExposeSystemic()
    status: UsersStatus;
    
    @ApiProperty({
        description: 'The position ID of the user',
        example: 1,
    })
    @ExposeBasic()
    positionId: number;
    
    @ApiProperty({
        description: 'The team ID of the user',
        example: 1,
    })
    @ExposeBasic()
    teamId: number;
    
    @ApiProperty({
        description: 'The manager ID of the user',
        example: 1,
        required: false,
        nullable: true,
    })
    @ExposeBasic()
    managerId: number | null;
    
    @ApiProperty({
        description: 'The created at date of the user',
        example: '2021-01-01',
    })
    @ExposeSystemic()
    createdAt: Date;
    
    @ApiProperty({
        description: 'The updated at date of the user',
        example: '2021-01-01',
    })
    @ExposeSystemic()
    updatedAt: Date;
}
