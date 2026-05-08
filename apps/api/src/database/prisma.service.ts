<<<<<<< HEAD
import { PrismaClient } from '@intra/database';
import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(PrismaService.name);

    constructor(private readonly configService: ConfigService) {
        const pool = new Pool({
            connectionString: configService.get<string>('database.url'),
            ssl: {
                rejectUnauthorized: false,
            },
        });
        const adapter = new PrismaPg(pool);
        // const adapter = new PrismaPg({
        //     connectionString: configService.get<string>('database.url'),
        // });
        super({ adapter });
    }

    async onModuleInit() {
        if (!process.env.DATABASE_URL) {
            throw new Error(
                [
                    'DATABASE_URL is not set.',
                    'Set it in your environment or run the app via dotenv-cli (e.g. `pnpm start:dev`).',
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
=======
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@intra/database';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const  adapter = new PrismaPg({
      connectionString: configService.get<string>('database.url'),
    });
    super({ adapter });
  }

  async onModuleInit() {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        [
          'DATABASE_URL is not set.',
          'Set it in your environment or run the app via dotenv-cli (e.g. `pnpm start:dev`).',
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


>>>>>>> origin/main
