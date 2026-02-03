import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { IdentityUserService } from '../contexts/identity/application/services/identity-user.service';
import {
    BETTER_AUTH_INSTANCE,
    BetterAuthInstance,
} from './better-auth.provider';

type BetterAuthResponse = any;

type GoogleTokenResponse = {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token?: string;
    scope?: string;
    token_type: string;
};

type GoogleProfile = {
    email: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    picture?: string;
};

@Injectable()
export class AuthService {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly isProd: boolean;

    constructor(
        @Inject(BETTER_AUTH_INSTANCE)
        private readonly auth: BetterAuthInstance,
        private readonly config: ConfigService,
        private readonly identityUsers: IdentityUserService,
    ) {
        this.clientId = this.config.getOrThrow<string>('GOOGLE_CLIENT_ID');
        this.clientSecret = this.config.getOrThrow<string>(
            'GOOGLE_CLIENT_SECRET',
        );
        this.isProd = this.config.get<string>('APP_NODE_ENV') === 'production';
    }

    getGoogleRedirectUrl(res: Response): string {
        const state = randomUUID();
        this.setStateCookie(res, state);

        const redirectUri = this.buildCallbackUrl();
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'openid profile email',
            access_type: 'offline',
            prompt: 'consent',
            state,
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    async handleGoogleCallback(
        req: Request,
        res: Response,
    ): Promise<{ userId: number; session: unknown }> {
        const code = req.query.code as string | undefined;
        const state = req.query.state as string | undefined;
        if (!code) throw new BadRequestException('Missing code');
        if (!state) throw new BadRequestException('Missing state');
        this.assertState(req, state);

        const tokens = await this.exchangeCodeForTokens(code);
        const profile = await this.fetchGoogleProfile(tokens.access_token);

        const betterAuthResponse = await this.auth.api.signInSocial({
            body: {
                provider: 'google',
                idToken: {
                    token: tokens.id_token,
                    accessToken: tokens.access_token,
                },
                callbackURL: this.getFrontendUrl(),
                disableRedirect: true,
            },
            asResponse: true,
        } as any);

        await this.copySetCookies(betterAuthResponse as any, res);
        const session = await this.tryParseResponseBody(
            betterAuthResponse as any,
        );

        if (!profile.given_name || !profile.family_name) {
            throw new BadRequestException(
                'First name and last name are required for external user creation',
            );
        }

        const user = await this.identityUsers.upsertExternalUser({
            email: profile.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
            secondName: undefined,
            avatarUrl: profile.picture,
        });

        return { userId: user.id!, session };
    }

    async getSessionFromRequest(req: Request): Promise<{
        session: unknown;
    } | null> {
        const session = await this.auth.api.getSession({
            headers: req.headers as any,
        });
        if (!session) return null;
        return { session };
    }

    private buildCallbackUrl(): string {
        const protocol = this.config.get<string>('APP_PROTOCOL') ?? 'http';
        const host = this.config.get<string>('APP_HOST') ?? 'localhost';
        const port = this.config.get<string>('APP_PORT');
        if (!port || protocol === 'https') {
            return `${protocol}://${host}/auth/google/callback`;
        }
        return `${protocol}://${host}:${port}/auth/google/callback`;
    }

    private getFrontendUrl(): string {
        const protocol =
            this.config.get<string>('APP_FRONTEND_PROTOCOL') ??
            this.config.get<string>('APP_PROTOCOL') ??
            'http';
        const host =
            this.config.get<string>('APP_FRONTEND_HOST') ??
            this.config.get<string>('APP_HOST') ??
            'localhost';
        const port = this.config.get<string>('APP_FRONTEND_PORT');
        if (!port || protocol === 'https') {
            return `${protocol}://${host}`;
        }
        return `${protocol}://${host}:${port}`;
    }

    private async exchangeCodeForTokens(
        code: string,
    ): Promise<GoogleTokenResponse> {
        const payload = new URLSearchParams({
            code,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            redirect_uri: this.buildCallbackUrl(),
            grant_type: 'authorization_code',
        });

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: payload.toString(),
        });

        if (!response.ok) {
            const body = await response.text();
            throw new UnauthorizedException(
                `Failed to exchange code with Google: ${body}`,
            );
        }

        const tokens = (await response.json()) as GoogleTokenResponse;
        if (!tokens.id_token || !tokens.access_token) {
            throw new UnauthorizedException('Google did not return tokens');
        }
        return tokens;
    }

    private async fetchGoogleProfile(
        accessToken: string,
    ): Promise<GoogleProfile> {
        const response = await fetch(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },
        );
        if (!response.ok) {
            const body = await response.text();
            throw new UnauthorizedException(
                `Failed to fetch Google profile: ${body}`,
            );
        }
        return (await response.json()) as GoogleProfile;
    }

    private setStateCookie(res: Response, state: string) {
        res.cookie('ga_state', state, {
            httpOnly: true,
            secure: this.isProd,
            sameSite: 'lax',
            maxAge: 10 * 60 * 1000,
            path: '/auth/google/callback',
        });
    }

    private assertState(req: Request, received: string) {
        const stored = this.getCookie(req, 'ga_state');
        if (!stored || stored !== received) {
            throw new UnauthorizedException('Invalid OAuth state');
        }
    }

    private getCookie(req: Request, key: string): string | undefined {
        const raw = req.headers.cookie;
        if (!raw) return undefined;
        const cookies = raw.split(';').map((c) => c.trim());
        for (const cookie of cookies) {
            const [name, ...rest] = cookie.split('=');
            if (name === key) {
                return decodeURIComponent(rest.join('='));
            }
        }
        return undefined;
    }

    private async copySetCookies(
        betterAuthResponse: BetterAuthResponse,
        res: Response,
    ) {
        const headerValue = (betterAuthResponse as any)?.headers?.get
            ? (betterAuthResponse as any).headers.get('set-cookie')
            : null;
        const setCookies =
            headerValue ??
            ((betterAuthResponse as any)?.headers?.raw
                ? (betterAuthResponse as any).headers.raw()['set-cookie']
                : undefined);

        if (Array.isArray(setCookies)) {
            res.header('set-cookie', setCookies);
        } else if (setCookies) {
            res.header('set-cookie', setCookies);
        }
    }

    private async tryParseResponseBody(
        betterAuthResponse: BetterAuthResponse,
    ): Promise<unknown> {
        if (!betterAuthResponse?.json) return null;
        try {
            return await (betterAuthResponse as any).json();
        } catch {
            return null;
        }
    }
}
