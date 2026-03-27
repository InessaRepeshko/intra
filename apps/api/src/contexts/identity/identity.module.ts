import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { IDENTITY_ROLE_REPOSITORY } from './application/ports/role.repository.port';
import { IDENTITY_USER_REPOSITORY } from './application/ports/user.repository.port';
import { IdentityRoleService } from './application/services/identity-role.service';
import { IdentityUserService } from './application/services/identity-user.service';
import { RoleRepository } from './infrastructure/prisma-repositories/role.repository';
import { UserRepository } from './infrastructure/prisma-repositories/user.repository';
import { IdentityRolesController } from './presentation/http/controllers/identity-roles.controller';
import { IdentityUsersController } from './presentation/http/controllers/identity-users.controller';

@Module({
    imports: [DatabaseModule, forwardRef(() => AuthModule)],
    controllers: [IdentityUsersController, IdentityRolesController],
    providers: [
        IdentityUserService,
        IdentityRoleService,
        UserRepository,
        RoleRepository,
        { provide: IDENTITY_USER_REPOSITORY, useExisting: UserRepository },
        { provide: IDENTITY_ROLE_REPOSITORY, useExisting: RoleRepository },
    ],
    exports: [
        IdentityUserService,
        IdentityRoleService,
        IDENTITY_USER_REPOSITORY,
    ],
})
export class IdentityModule {}
