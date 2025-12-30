import { Module } from '@nestjs/common';
import { Feedback360Service } from './application/feedback360.service';
import { Feedback360Controller } from './presentation/http/controllers/feedback360.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { Feedback360Repository } from './infrastructure/prisma-repositories/feedback360.repository';
import { UsersModule } from '../identity/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [Feedback360Controller],
  providers: [Feedback360Service, Feedback360Repository],
})
export class Feedback360Module {}
