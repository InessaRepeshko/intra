import { Module } from '@nestjs/common';
import { Feedback360Service } from './feedback360.service';
import { Feedback360Controller } from './feedback360.controller';
import { DatabaseModule } from '../../database/database.module';
import { Feedback360Repository } from './feedback360.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [Feedback360Controller],
  providers: [Feedback360Service, Feedback360Repository],
})
export class Feedback360Module {}
