import { Module } from '@nestjs/common';
import { UsersApplicationService } from '../application/users.application-service';
import { UsersController } from './http/users.controller';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { UsersRepository } from '../domain/repositories/users.repository';
import { PrismaUsersRepository } from './persistence/prisma/prisma-users.repository';
import { USERS_REPOSITORY } from '../domain/repositories/users.repository.token';
import { CreateUserUseCase } from '../application/use-cases/create-user.usecase';
import { UpdateUserUseCase } from '../application/use-cases/update-user.usecase';
import { PASSWORD_HASHER } from '../domain/services/password-hasher.token';
import { Pbkdf2PasswordHasher } from './security/pbkdf2-password-hasher';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    UsersApplicationService,
    CreateUserUseCase,
    UpdateUserUseCase,
    PrismaUsersRepository,
    {
      provide: USERS_REPOSITORY,
      useExisting: PrismaUsersRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: Pbkdf2PasswordHasher,
    },
  ],
  exports: [UsersApplicationService],
})
export class UsersModule {}
