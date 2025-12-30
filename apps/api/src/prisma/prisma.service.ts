import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    // Prisma бере url datasource з env("DATABASE_URL") у schema.prisma.
    // Якщо змінна не задана — краще впасти з чітким повідомленням, ніж з неочевидною Prisma-ошибкою.
    if (!process.env.DATABASE_URL) {
      throw new Error(
        [
          'DATABASE_URL is not set.',
          'Set it in your environment or run the app via dotenv-cli (e.g. `npm run start:dev`).',
          'Expected file: .env.development.local (see package.json scripts).',
        ].join(' '),
      );
    }

    this.logger.log('Connecting to database...');
    await this.$connect();
    this.logger.log('Connected to database');
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from database...');
    await this.$disconnect();
    this.logger.log('Disconnected from database');
  }
}


