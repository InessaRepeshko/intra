import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IdentityRole } from '../../../domain/identity-role.enum';

export class RoleResponse {
  @ApiProperty({ enum: IdentityRole, example: IdentityRole.MANAGER })
  @Expose()
  code!: IdentityRole;

  @ApiProperty({ example: 'Менеджер' })
  @Expose()
  title!: string;

  @ApiProperty({ example: 'Користувач із роллю менеджера', nullable: true })
  @Expose()
  description?: string | null;
}
