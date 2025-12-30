import { IsEnglishName } from 'src/common/validators/name.validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'src/common/validators/email.validator';
import { UserConstants } from 'src/common/validators/constants';
import { IsNotEmpty, IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    description: 'The first name of the user',
    example: 'John',
    nullable: false,
    type: 'string',
    minLength: UserConstants.NAME_MIN_LENGTH,
    maxLength: UserConstants.NAME_MAX_LENGTH,
  })
  @IsEnglishName(false, false)
  firstName: string;

  @ApiProperty({
    required: false,
    description: 'The second name of the user',
    example: 'Joel',
    nullable: true,
    type: 'string',
    minLength: UserConstants.NAME_MIN_LENGTH,
    maxLength: UserConstants.NAME_MAX_LENGTH,
  })
  @IsEnglishName(true, true)
  secondName?: string | null;

  @ApiProperty({
    required: true,
    description: 'The last name of the user',
    example: 'Smith',
    nullable: false,
    type: 'string',
    minLength: UserConstants.NAME_MIN_LENGTH,
    maxLength: UserConstants.NAME_MAX_LENGTH,
  })
  @IsEnglishName(false, false)
  lastName: string;

  // @ApiProperty({
  //   required: false,
  //   description: 'The full name of the user',
  //   example: 'John Joel Smith',
  //   nullable: true,
  //   type: 'string',
  //   minLength: UserConstants.FULL_NAME_MIN_LENGTH,
  //   maxLength: UserConstants.FULL_NAME_MAX_LENGTH,
  // })
  // @IsEnglishName(true, true)
  // fullName?: string;

  @ApiProperty({
    required: true,
    description: 'The email of the user',
    example: 'john.doe@example.com',
    nullable: false,
    type: 'string',
    maxLength: UserConstants.EMAIL_MAX_LENGTH,
  })
  @IsString()
  @Length(UserConstants.EMAIL_MIN_LENGTH, UserConstants.EMAIL_MAX_LENGTH)
  @IsNotEmpty()
  @IsEmail(false)
  email: string;

  @ApiProperty({
    required: true,
    description: 'The password of the user (will be hashed and not returned)',
    example: 'Str0ngP@ssw0rd!',
    nullable: false,
    type: 'string',
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @Length(8, 128)
  @IsNotEmpty()
  password: string;
  
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
    required: false,
    description: 'The manager ID of the user',
    example: 1,
    nullable: true,
    type: 'number',
  })
  @IsOptional()
  @IsPositive()
  managerId?: number | null;
}
