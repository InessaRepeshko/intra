import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IdentityUsersController } from './presentation/http/controllers/identity-users.controller';
import { IdentityUserService } from './application/services/identity-user.service';
import { IdentityRoleService } from './application/services/identity-role.service';
import { IDENTITY_USER_REPOSITORY } from './application/ports/user.repository.port';
import { IDENTITY_ROLE_REPOSITORY } from './application/ports/role.repository.port';
import { PrismaUserRepository } from './infrastructure/prisma/prisma-user.repository';
import { PrismaRoleRepository } from './infrastructure/prisma/prisma-role.repository';
import { IdentityRolesController } from './presentation/http/controllers/identity-roles.controller';

@Module({
  imports: [PrismaModule],
  controllers: [IdentityUsersController, IdentityRolesController],
  providers: [
    IdentityUserService,
    IdentityRoleService,
    PrismaUserRepository,
    PrismaRoleRepository,
    { provide: IDENTITY_USER_REPOSITORY, useExisting: PrismaUserRepository },
    { provide: IDENTITY_ROLE_REPOSITORY, useExisting: PrismaRoleRepository },
  ],
  exports: [IdentityUserService, IdentityRoleService],
})
export class IdentityContextModule {}
