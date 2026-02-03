import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '../../../auth.service';
import { Public } from '../../../decorators/public.decorator';

@ApiTags('Auth [DEV]')
@Controller('auth/dev')
export class DevAuthController {
    private readonly isProd: boolean;

    constructor(
        private readonly authService: AuthService,
        private readonly config: ConfigService,
    ) {
        this.isProd = this.config.get<string>('APP_NODE_ENV') === 'production';
    }

    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Dev Login (bypass password)',
        description:
            'Login as any user by email. Only available in NON-PRODUCTION environments.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User successfully logged in',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'number', example: 1 },
                session: { type: 'object', description: 'Session data' },
            },
        },
    })
    async devLogin(
        @Body('email') email: string,
        @Res({ passthrough: true }) res: Response,
    ): Promise<any> {
        if (this.isProd) {
            throw new UnauthorizedException(
                'Dev login is disabled in production',
            );
        }

        const result = await this.authService.devLogin(email);

        // Manually set better-auth.session_token cookie if available in session
        const sessionAny = result.session as any;
        if (sessionAny?.token) {
            res.cookie('better-auth.session_token', sessionAny.token, {
                httpOnly: true,
                secure: this.isProd,
                sameSite: 'lax',
                path: '/',
            });
        }

        return result;
    }
}
