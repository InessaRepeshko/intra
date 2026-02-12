import {
    CanActivate,
    ExecutionContext,
    Injectable,
    OnModuleInit,
    UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { IdentityUserService } from '../../contexts/identity/application/services/identity-user.service';
import { AuthService } from '../auth.service';
import { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class AuthSessionGuard implements CanActivate, OnModuleInit {
    private identityUsers: IdentityUserService;

    constructor(
        private readonly authService: AuthService,
        private readonly moduleRef: ModuleRef,
        private readonly reflector: Reflector,
    ) {}

    onModuleInit() {
        this.identityUsers = this.moduleRef.get(IdentityUserService, {
            strict: false,
        });
    }

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
