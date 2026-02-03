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
import { UserDomain } from '../identity/domain/user.domain';
import { UserHttpMapper } from '../identity/presentation/http/mappers/user.http.mapper';
import { UserResponse } from '../identity/presentation/http/models/user.response';
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
    async googleCallback(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
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
    async me(@CurrentUser() user: UserDomain): Promise<UserResponse> {
        return UserHttpMapper.toResponse(user);
    }
}
