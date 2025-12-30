import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersController } from './presentation/http/controllers/users.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { USER_REPOSITORY } from './application/repository-ports/user.repository.port';
import { UserPrismaRepository } from './infrastructure/prisma-repositories/user.prisma.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserPrismaRepository,
    { provide: USER_REPOSITORY, useExisting: UserPrismaRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}
