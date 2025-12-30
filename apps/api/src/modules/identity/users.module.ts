import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersController } from './presentation/http/controllers/users.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersRepository } from './infrastructure/prisma-repositories/users.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
