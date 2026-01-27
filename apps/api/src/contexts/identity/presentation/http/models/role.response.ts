import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IdentityRole, ROLE_CONSTRAINTS } from '@intra/shared-kernel';

export class RoleResponse {
  @ApiProperty({ enum: IdentityRole, example: IdentityRole.MANAGER, description: 'Role code', type: 'string' })
  @Expose()
  code!: IdentityRole;

  @ApiProperty({ example: 'Manager', description: 'Role title', type: 'string', minimum: ROLE_CONSTRAINTS.TITLE.MIN_LENGTH, maximum: ROLE_CONSTRAINTS.TITLE.MAX_LENGTH })
  @Expose()
  title!: string;

  @ApiProperty({ example: 'Responsible for managing the team', nullable: true, description: 'Role description', type: 'string', minimum: ROLE_CONSTRAINTS.DESCRIPTION.MIN_LENGTH, maximum: ROLE_CONSTRAINTS.DESCRIPTION.MAX_LENGTH })
  @Expose()
  description?: string | null;

  @ApiProperty({ example: '2024-01-01T10:00:00.000Z', description: 'Role creation date', type: 'string', format: 'date-time' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-02T10:00:00.000Z', description: 'Role update date', type: 'string', format: 'date-time' })
  @Expose()
  updatedAt!: Date;
}
