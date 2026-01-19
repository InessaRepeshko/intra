import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IdentityRole } from '../../../domain/enums/identity-role.enum';
import { IdentityUserStatus } from '../../../domain/enums/identity-user-status.enum';

export class UserResponse {
  @ApiProperty({ example: 1 })
  @Expose()
  id!: number;

  @ApiProperty({ example: 'Valerii' })
  @Expose()
  firstName!: string;

  @ApiProperty({ example: 'Velychko', nullable: true })
  @Expose()
  secondName!: string | null;

  @ApiProperty({ example: 'Valeriiovych' })
  @Expose()
  lastName!: string;

  @ApiProperty({ example: 'Valerii Valeriiovych Velychko', nullable: true })
  @Expose()
  fullName!: string | null;

  @ApiProperty({ example: 'valerii.velychko@example.com' })
  @Expose()
  email!: string;

  @ApiProperty({ enum: IdentityUserStatus, example: IdentityUserStatus.ACTIVE })
  @Expose()
  status!: IdentityUserStatus;

  @ApiProperty({ type: Number, example: 1, nullable: true })
  @Expose()
  positionId!: number | null;

  @ApiProperty({ type: Number, example: 10, nullable: true })
  @Expose()
  teamId!: number | null;

  @ApiProperty({ type: Number, example: 2, nullable: true })
  @Expose()
  managerId!: number | null;

  @ApiProperty({ enum: IdentityRole, isArray: true, example: [IdentityRole.MANAGER] })
  @Expose()
  roles!: IdentityRole[];

  @ApiProperty({ type: String, example: '2024-01-01T10:00:00.000Z' })
  @Expose()
  createdAt?: Date;

  @ApiProperty({ type: String, example: '2024-01-02T10:00:00.000Z' })
  @Expose()
  updatedAt?: Date;
}
