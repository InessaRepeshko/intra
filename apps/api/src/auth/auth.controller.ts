import { AuthResponseDto } from '@intra/shared-kernel';
import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Req,
    Res,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserDomain } from '../contexts/identity/domain/user.domain';
import { UserHttpMapper } from '../contexts/identity/presentation/http/mappers/user.http.mapper';
import { UserResponse } from '../contexts/identity/presentation/http/models/user.response';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { AuthSessionGuard } from './guards/auth-session.guard';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(AuthSessionGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserResponse })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('google')
    @Public()
    @ApiOperation({ summary: 'Initiate Google OAuth2 login' })
    @ApiResponse({
        status: HttpStatus.FOUND,
        description: 'Redirects to Google OAuth2 login page',
    })
    async googleLogin(@Res() res: Response) {
        const url = this.authService.getGoogleRedirectUrl(res);
        return res.redirect(url);
    }

    @Get('google/callback')
    @Public()
    @ApiOperation({ summary: 'Handle Google OAuth2 callback' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User successfully logged in',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string', example: '1' },
                session: { type: 'object', description: 'Session data' },
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: `
            Possible reasons:
            - Missing 'code' or 'state' parameters in the request query.
            - Google profile is missing required 'given_name' (first name) or 'family_name' (last name).
        `,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: `
            Possible reasons:
            - Invalid OAuth state (CSRF protection).
            - Failed to exchange authorization code for tokens.
            - Google did not return access or ID tokens.
            - Failed to fetch user profile from Google.
        `,
    })
    async googleCallback(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponseDto> {
        const result = await this.authService.handleGoogleCallback(req, res);
        return { userId: result.userId, session: result.session };
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: HttpStatus.OK,
        type: UserResponse,
        description: 'The current user profile',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User is not authenticated',
    })
    async me(@CurrentUser() user: UserDomain): Promise<UserResponse> {
        return UserHttpMapper.toResponse(user);
    }
}
