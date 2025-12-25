import { IsEnglishName } from '../../../common/validators/name.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from '../../../common/validators/email.validator';
import { UserNameConstants } from 'src/common/validators/constants';
import { IsPositive } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    description: 'The first name of the user',
    example: 'John',
    nullable: false,
    type: 'string',
    minLength: UserNameConstants.MIDDLE_LENGTH,
    maxLength: UserNameConstants.MAX_LENGTH,
  })
  @IsEnglishName(false, false)
  firstName: string;

  @ApiProperty({
    required: false,
    description: 'The second name of the user',
    example: 'Joel',
    nullable: false,
    type: 'string',
    minLength: UserNameConstants.MIDDLE_LENGTH,
    maxLength: UserNameConstants.MAX_LENGTH,
  })
  @IsEnglishName(true, true)
  secondName: string;

  @ApiProperty({
    required: true,
    description: 'The last name of the user',
    example: 'Smith',
    nullable: false,
    type: 'string',
    minLength: UserNameConstants.MIDDLE_LENGTH,
    maxLength: UserNameConstants.MAX_LENGTH,
  })
  @IsEnglishName(false, false)
  lastName: string;

  // @ApiProperty({
  //   required: false,
  //   description: 'The full name of the user',
  //   example: 'John Joel Smith',
  //   nullable: true,
  //   type: 'string',
  //   minLength: UserNameConstants.MIDDLE_LENGTH * 3 + 2, // 3 names * 3 letters + 2 spaces
  //   maxLength: UserNameConstants.MAX_LENGTH,
  // })
  // @IsEnglishName(true, true)
  // fullName?: string;

  @ApiProperty({
    required: true,
    description: 'The email of the user',
    example: 'john.doe@example.com',
    nullable: false,
    type: 'string',
  })
  @IsEmail(false)
  email: string;
  
  @ApiProperty({
    required: true,
    description: 'The position ID of the user',
    example: 1,
    nullable: false,
    type: 'number',
  })
  @IsPositive()
  positionId: number;

  @ApiProperty({
    required: true,
    description: 'The team ID of the user',
    example: 1,
    nullable: false,
    type: 'number',
  })
  @IsPositive()
  teamId: number;

  @ApiProperty({
    required: true,
    description: 'The manager ID of the user',
    example: 1,
    nullable: false,
    type: 'number',
  })
  @IsPositive()
  managerId: number;
}
