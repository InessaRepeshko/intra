import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, ArrayNotEmpty } from 'class-validator';
import { IdentityRole } from '../../../domain/enums/identity-role.enum';

export class AssignRolesDto {
  @ApiProperty({ description: 'Role codes to assign to the user (replace existing)', isArray: true, enum: IdentityRole, example: [IdentityRole.MANAGER, IdentityRole.HR] })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(IdentityRole, { each: true })
  roles!: IdentityRole[];
}
