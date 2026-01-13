import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { IdentityUserStatus } from '../../../domain/identity-user-status.enum';

export class CreateUserDto {
  @ApiProperty({ description: `User's first name`, example: 'Valerii' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @ApiPropertyOptional({ description: `User's second name`, example: 'Velychko' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  secondName?: string | null;

  @ApiProperty({ description: `User's last name`, example: 'Valeriiovych' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({ description: `User's email`, example: 'valerii.velychko@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    description: `Precomputed password hash or placeholder for external authentication`,
    example: '__external_auth__',
  })
  @IsOptional()
  @IsString()
  passwordHash?: string;

  @ApiPropertyOptional({
    enum: IdentityUserStatus,
    default: IdentityUserStatus.ACTIVE,
    description: `User's status`,
  })
  @IsOptional()
  @IsEnum(IdentityUserStatus)
  status?: IdentityUserStatus;

  @ApiPropertyOptional({ description: `Position ID`, type: Number, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  positionId?: number | null;

  @ApiPropertyOptional({ description: `Team ID`, type: Number, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  teamId?: number | null;

  @ApiPropertyOptional({ description: `Manager ID`, type: Number, example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  managerId?: number | null;
}
