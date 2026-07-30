import { PrismaClient } from '@intra/database';
import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, type PoolConfig } from 'pg';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(PrismaService.name);
    private readonly pool: Pool;

    constructor(private readonly configService: ConfigService) {
        const isProduction =
            configService.get<string>('APP_NODE_ENV') === 'production';
        const poolConfig: PoolConfig = {
            connectionString: configService.get<string>('database.url'),
        };
        if (isProduction) {
            poolConfig.ssl = { rejectUnauthorized: false };
        }
        const pool = new Pool(poolConfig);
        const adapter = new PrismaPg(pool);
        super({ adapter });
        this.pool = pool;
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
        await this.pool.end();
        this.logger.log('Disconnected from database');
    }
}
