import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, ArrayNotEmpty } from 'class-validator';
import { IdentityRole } from '@intra/shared-kernel';
import { ToOptionalIntArray } from 'src/common/transforms/query-sanitize.transform';

export class AssignRolesDto {
  @ApiProperty({ description: 'Role codes to assign to the user (replace existing)', isArray: true, enum: IdentityRole, example: [IdentityRole.MANAGER, IdentityRole.HR], type: [String] })
  @ToOptionalIntArray()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(IdentityRole, { each: true })
  roles!: IdentityRole[];
}
