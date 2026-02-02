import { UserHttpMapper } from '../identity/presentation/http/mappers/user.http.mapper';
import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Req,
    Res,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { AuthSessionGuard } from './guards/auth-session.guard';
import { RolesGuard } from './guards/roles.guard';
import { UserResponse } from '../identity/presentation/http/models/user.response';
import { UserDomain } from '../identity/domain/user.domain';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(AuthSessionGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ type: UserResponse })
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('google')
    @Public()
    async googleLogin(@Res() res: Response) {
        const url = this.authService.getGoogleRedirectUrl(res);
        return res.redirect(url);
    }

    @Get('google/callback')
    @Public()
    async googleCallback(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.handleGoogleCallback(req, res);
        return { userId: result.userId, session: result.session };
    }

    @Get('me')
    async me(@CurrentUser() user: UserDomain): Promise<UserResponse> {
        return UserHttpMapper.toResponse(user);
    }
}
