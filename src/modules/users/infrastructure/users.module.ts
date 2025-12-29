import { Module } from '@nestjs/common';
import { UsersService } from '../application/users.service';
import { UsersController } from './http/users.controller';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { UsersRepository } from './persistence/prisma/users.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
