<<<<<<< HEAD
import { IdentityRole } from '@intra/shared-kernel';
import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum } from 'class-validator';
import { ToOptionalIntArray } from 'src/common/transforms/query-sanitize.transform';

export class AssignRolesDto {
    @ApiProperty({
        description: 'Role codes to assign to the user (replace existing)',
        isArray: true,
        enum: IdentityRole,
        example: [IdentityRole.MANAGER, IdentityRole.HR],
        type: [String],
    })
    @ToOptionalIntArray()
    @IsArray()
    @ArrayNotEmpty()
    @IsEnum(IdentityRole, { each: true })
    roles!: IdentityRole[];
}
=======
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, ArrayNotEmpty } from 'class-validator';
import { IdentityRole } from '../../../domain/identity-role.enum';

export class AssignRolesDto {
  @ApiProperty({ description: 'Role codes to assign to the user (replace existing)', isArray: true, enum: IdentityRole, example: [IdentityRole.MANAGER, IdentityRole.HR] })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(IdentityRole, { each: true })
  roles!: IdentityRole[];
}
>>>>>>> origin/main
