import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';
import { IdentityUserStatus } from '../../../domain/identity-user-status.enum';

export class CreateUserDto {
  @ApiProperty({ description: "Ім'я користувача", example: 'Іван' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @ApiPropertyOptional({ description: 'По-батькові', example: 'Іванович' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  secondName?: string | null;

  @ApiProperty({ description: 'Прізвище користувача', example: 'Петренко' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({ description: 'Електронна пошта', example: 'ivan@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({
    description: 'Попередньо обчислений hash пароля або плейсхолдер для зовнішньої автентифікації',
    example: '__external_auth__',
  })
  @IsOptional()
  @IsString()
  passwordHash?: string;

  @ApiPropertyOptional({
    enum: IdentityUserStatus,
    default: IdentityUserStatus.ACTIVE,
    description: 'Статус користувача',
  })
  @IsOptional()
  @IsEnum(IdentityUserStatus)
  status?: IdentityUserStatus;

  @ApiPropertyOptional({ description: 'ID посади', type: Number, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  positionId?: number | null;

  @ApiPropertyOptional({ description: 'ID команди', type: Number, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  teamId?: number | null;

  @ApiPropertyOptional({ description: 'ID менеджера', type: Number, example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  managerId?: number | null;
}
