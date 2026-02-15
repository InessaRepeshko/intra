import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaService } from '../database/prisma.service';

export const BETTER_AUTH_INSTANCE = Symbol('BETTER_AUTH_INSTANCE');

export type BetterAuthInstance = ReturnType<typeof betterAuth>;

const buildBaseUrl = (config: ConfigService): string => {
    const explicit = config.get<string>('BETTER_AUTH_URL');
    if (explicit) return explicit;
    const protocol = config.get<string>('APP_PROTOCOL') ?? 'http';
    const host = config.get<string>('APP_HOST') ?? 'localhost';
    const port = config.get<string>('APP_PORT') ?? '8080';
    if (!port || protocol === 'https') {
        return `${protocol}://${host}`;
    }
    return `${protocol}://${host}:${port}`;
};

export const betterAuthProvider: Provider = {
    provide: BETTER_AUTH_INSTANCE,
    useFactory: (config: ConfigService, prisma: PrismaService) => {
        const baseURL = buildBaseUrl(config);
        const secret = config.getOrThrow<string>('BETTER_AUTH_SECRET');
        const clientId = config.getOrThrow<string>('GOOGLE_CLIENT_ID');
        const clientSecret = config.getOrThrow<string>('GOOGLE_CLIENT_SECRET');

        return betterAuth({
            database: prismaAdapter(prisma, {
                provider: 'postgresql',
            }),
            baseURL,
            secret,
            emailAndPassword: { enabled: false },
            socialProviders: {
                google: {
                    clientId,
                    clientSecret,
                    accessType: 'offline',
                    prompt: 'select_account consent',
                },
            },
            advanced: {
                cookiePrefix: 'better-auth',
                generateId: false,
            },
            // Explicitly set cookie options for development
            trustedOrigins: ['http://localhost:3000', 'http://localhost:8080'],
            user: {
                modelName: 'authUser',
            },
            session: {
                expiresIn: 60 * 60 * 24 * 30, // 30 days
                updateAge: 60 * 60 * 24, // 1 day
                cookieCache: {
                    enabled: true,
                    maxAge: 5 * 60, // Cache validation result for 5 minutes
                },
                modelName: 'authSession',
            },
            account: {
                modelName: 'authAccount',
            },
            verification: {
                modelName: 'authVerification',
            },
        });
    },
    inject: [ConfigService, PrismaService],
};
