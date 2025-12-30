import { Module } from '@nestjs/common';
import { Feedback360Service } from './application/feedback360.service';
import { Feedback360Controller } from './presentation/http/controllers/feedback360.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { FEEDBACK360_REPOSITORY } from './application/repository-ports/feedback360.repository.port';
import { Feedback360PrismaRepository } from './infrastructure/prisma-repositories/feedback360.prisma.repository';
import { IDENTITY_READ } from './application/external-ports/identity-read.port';
import { IdentityReadPrismaAdapter } from './infrastructure/prisma-repositories/identity-read.prisma.adapter';

@Module({
  imports: [PrismaModule],
  controllers: [Feedback360Controller],
  providers: [
    Feedback360Service,
    Feedback360PrismaRepository,
    { provide: FEEDBACK360_REPOSITORY, useExisting: Feedback360PrismaRepository },

    IdentityReadPrismaAdapter,
    { provide: IDENTITY_READ, useExisting: IdentityReadPrismaAdapter },
  ],
})
export class Feedback360Module {}
