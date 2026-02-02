import { betterAuth } from 'better-auth';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const BETTER_AUTH_INSTANCE = Symbol('BETTER_AUTH_INSTANCE');

export type BetterAuthInstance = ReturnType<typeof betterAuth>;

const buildBaseUrl = (config: ConfigService): string => {
    const explicit = config.get<string>('BETTER_AUTH_URL');
    if (explicit) return explicit;
    const protocol = config.get<string>('APP_PROTOCOL') ?? 'http';
    const host = config.get<string>('APP_HOST') ?? 'localhost';
    const port = config.get<string>('APP_PORT');
    if (!port || protocol === 'https') {
        return `${protocol}://${host}`;
    }
    return `${protocol}://${host}:${port}`;
};

export const betterAuthProvider: Provider = {
    provide: BETTER_AUTH_INSTANCE,
    useFactory: (config: ConfigService) => {
        const baseURL = buildBaseUrl(config);
        const secret = config.getOrThrow<string>('BETTER_AUTH_SECRET');
        const clientId = config.getOrThrow<string>('GOOGLE_CLIENT_ID');
        const clientSecret = config.getOrThrow<string>('GOOGLE_CLIENT_SECRET');

        return betterAuth({
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
        });
    },
    inject: [ConfigService],
};
