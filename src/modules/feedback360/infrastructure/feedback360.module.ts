import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/infrastructure/database/database.module';
import { Feedback360Controller } from './http/feedback360.controller';
import { Feedback360ApplicationService } from '../application/feedback360.application-service';
import { CreateFeedback360UseCase } from '../application/use-cases/create-feedback360.usecase';
import { UpdateFeedback360UseCase } from '../application/use-cases/update-feedback360.usecase';
import { PrismaFeedback360Repository } from './persistence/prisma/prisma-feedback360.repository';
import { FEEDBACK360_REPOSITORY } from '../domain/repositories/feedback360.repository.token';

@Module({
  imports: [DatabaseModule],
  controllers: [Feedback360Controller],
  providers: [
    Feedback360ApplicationService,
    CreateFeedback360UseCase,
    UpdateFeedback360UseCase,
    PrismaFeedback360Repository,
    {
      provide: FEEDBACK360_REPOSITORY,
      useExisting: PrismaFeedback360Repository,
    },
  ],
  exports: [Feedback360ApplicationService],
})
export class Feedback360Module {}


