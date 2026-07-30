import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import appConfig from 'src/config/app';
import databaseConfig from 'src/config/database';
import { IDENTITY_ROLE_REPOSITORY } from 'src/contexts/identity/application/ports/role.repository.port';
import { IDENTITY_USER_REPOSITORY } from 'src/contexts/identity/application/ports/user.repository.port';
import { IdentityRoleService } from 'src/contexts/identity/application/services/identity-role.service';
import { IdentityUserService } from 'src/contexts/identity/application/services/identity-user.service';
import { RoleRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/role.repository';
import { UserRepository } from 'src/contexts/identity/infrastructure/prisma-repositories/user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { PrismaService } from 'src/database/prisma.service';
import { ensureTestDatabaseExists } from '../../setup-env';

/**
 * Bootstraps a minimal Nest testing module for the identity context
 * wired to the real database. We assemble the providers manually instead
 * of importing `IdentityModule` because that module pulls in
 * `AuthModule` via `forwardRef`, which would require the full HTTP /
 * better-auth setup for service-level tests that never need it.
 */
export async function createIdentityTestModule(): Promise<TestingModule> {
    // Ensure the configured test database exists before Prisma tries to
    // open a connection pool against it. Idempotent across spec files
    // (the helper caches its promise at module level).
    await ensureTestDatabaseExists();

    const module = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                load: [appConfig, databaseConfig],
                ignoreEnvFile: true,
            }),
            EventEmitterModule.forRoot(),
            DatabaseModule,
        ],
        providers: [
            IdentityUserService,
            IdentityRoleService,
            UserRepository,
            RoleRepository,
            { provide: IDENTITY_USER_REPOSITORY, useExisting: UserRepository },
            { provide: IDENTITY_ROLE_REPOSITORY, useExisting: RoleRepository },
        ],
    }).compile();

    await module.init();
    return module;
}

/**
 * Truncates the user-owned identity tables between tests so every test
 * starts from a clean slate, without touching the seeded `identity_roles`
 * reference data (which Better-Auth/Prisma migrations populate via the
 * `IdentityRole` enum).
 */
export async function resetIdentityTables(
    prisma: PrismaService,
): Promise<void> {
    await prisma.$executeRawUnsafe(
        'TRUNCATE TABLE "identity_users_roles", "identity_users" RESTART IDENTITY CASCADE',
    );
}

/**
 * Ensures the four reference roles exist in `identity_roles`. Production
 * migrations seed them; integration tests run the same `upsert` in case
 * the DB was created from a bare schema without the seed.
 */
export async function ensureRolesSeeded(prisma: PrismaService): Promise<void> {
    const seed: Array<{
        code: 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';
        title: string;
    }> = [
        { code: 'ADMIN', title: 'Administrator' },
        { code: 'HR', title: 'HR' },
        { code: 'MANAGER', title: 'Manager' },
        { code: 'EMPLOYEE', title: 'Employee' },
    ];

    for (const role of seed) {
        await prisma.role.upsert({
            where: { code: role.code },
            update: {},
            create: { code: role.code, title: role.title },
        });
    }
}
