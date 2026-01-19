import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IdentityRole } from '../../../domain/enums/identity-role.enum';

export class RoleResponse {
  @ApiProperty({ enum: IdentityRole, example: IdentityRole.MANAGER })
  @Expose()
  code!: IdentityRole;

  @ApiProperty({ example: 'Manager' })
  @Expose()
  title!: string;

  @ApiProperty({ example: 'Responsible for managing the team', nullable: true })
  @Expose()
  description?: string | null;
}
