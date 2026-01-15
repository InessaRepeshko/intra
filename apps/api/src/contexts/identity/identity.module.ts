import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/prisma/database.module';
import { IdentityUsersController } from './presentation/http/controllers/identity-users.controller';
import { IdentityUserService } from './application/services/identity-user.service';
import { IdentityRoleService } from './application/services/identity-role.service';
import { IDENTITY_USER_REPOSITORY } from './application/ports/user.repository.port';
import { IDENTITY_ROLE_REPOSITORY } from './application/ports/role.repository.port';
import { UserRepository } from './infrastructure/prisma-repositories/user.repository';
import { RoleRepository } from './infrastructure/prisma-repositories/role.repository';
import { IdentityRolesController } from './presentation/http/controllers/identity-roles.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [IdentityUsersController, IdentityRolesController],
  providers: [
    IdentityUserService,
    IdentityRoleService,
    UserRepository,
    RoleRepository,
    { provide: IDENTITY_USER_REPOSITORY, useExisting: UserRepository },
    { provide: IDENTITY_ROLE_REPOSITORY, useExisting: RoleRepository },
  ],
  exports: [IdentityUserService, IdentityRoleService],
})
export class IdentityModule {}
