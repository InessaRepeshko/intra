import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IdentityUserService } from '../../identity/application/services/identity-user.service';
import { AuthService } from '../auth.service';
import { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class AuthSessionGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly identityUsers: IdentityUserService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<AuthenticatedRequest>();

        const allowAnonymous = this.reflector.get<boolean>(
            'isPublic',
            context.getHandler(),
        );
        if (allowAnonymous) return true;

        const session = await this.authService.getSessionFromRequest(
            request as any,
        );
        if (!session?.session) {
            throw new UnauthorizedException('Unauthenticated');
        }

        const email = (session.session as any)?.user?.email;
        if (!email) {
            throw new UnauthorizedException('Session missing email');
        }

        const user = await this.identityUsers.findByEmail(email, {
            withRoles: true,
        });
        if (!user) {
            throw new UnauthorizedException('User not provisioned');
        }

        request.authUser = user;
        request.authSession = session.session;
        request.roles = user.roles;

        return true;
    }
}
