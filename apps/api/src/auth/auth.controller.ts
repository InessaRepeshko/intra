import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserDomain } from '../contexts/identity/domain/user.domain';
import { UserHttpMapper } from '../contexts/identity/presentation/http/mappers/user.http.mapper';
import { UserResponse } from '../contexts/identity/presentation/http/models/user.response';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { DevLoginRequestDto } from './dto/dev-login-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { AuthSessionGuard } from './guards/auth-session.guard';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(AuthSessionGuard, RolesGuard)
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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

    @Get('login')
    @Public()
    @ApiOperation({
        summary: 'Redirects to Google Login',
        description:
            'Since password login is disabled, this endpoint redirects to the Google OAuth2 login page.',
    })
    @ApiResponse({
        status: HttpStatus.FOUND,
        description: 'Redirects to Google OAuth2 login page',
    })
    async login(@Res() res: Response) {
        return res.redirect('/auth/google');
    }

    @Get('google/callback')
    @Public()
    @ApiOperation({ summary: 'Handle Google OAuth2 callback' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User successfully logged in',
        type: AuthResponseDto,
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
        return this.authService.handleGoogleCallback(req, res);
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

    @Post('dev/login')
    @Public()
    @ApiOperation({
        summary: 'Dev/Test login - authenticate as any user',
        description:
            'Development endpoint to quickly login as any registered user by email. Only available in non-production environments.',
    })
    @ApiBody({
        type: DevLoginRequestDto,
        description: 'User email for dev login',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully logged in as the specified user',
        type: AuthResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: `
            Possible reasons:
            - Dev login is not available in production environment.
            - User with the specified email does not exist.
        `,
    })
    async devLogin(
        @Body() dto: DevLoginRequestDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<AuthResponseDto> {
        return this.authService.devLogin(dto.email, res);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout current user' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User successfully logged out',
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'User is not authenticated',
    })
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<void> {
        return this.authService.logout(req, res);
    }
}
