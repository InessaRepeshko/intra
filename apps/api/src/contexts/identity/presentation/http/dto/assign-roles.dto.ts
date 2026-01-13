import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, ArrayNotEmpty } from 'class-validator';
import { IdentityRole } from '../../../domain/identity-role.enum';

export class AssignRolesDto {
  @ApiProperty({
    description: 'Коди ролей, які треба призначити користувачу (замінюють існуючі)',
    isArray: true,
    enum: IdentityRole,
    example: [IdentityRole.MANAGER, IdentityRole.HR],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(IdentityRole, { each: true })
  roles!: IdentityRole[];
}
