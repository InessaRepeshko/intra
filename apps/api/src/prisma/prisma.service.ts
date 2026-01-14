import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const  adapter = new PrismaMariaDb({
      host: configService.get<string>('database.host'),
      port: configService.get<number>('database.port'),
      user: configService.get<string>('database.user'),
      password: configService.get<string>('database.password'),
      database: configService.get<string>('database.name'),
      connectionLimit: configService.get<number>('database.connectionLimit'),
    });
    super({ adapter });
  }


  async onModuleInit() {
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


