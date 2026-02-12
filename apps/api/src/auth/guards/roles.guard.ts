import { IdentityRole } from '@intra/shared-kernel';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles =
            this.reflector.getAllAndOverride<IdentityRole[]>('roles', [
                context.getHandler(),
                context.getClass(),
            ]) || [];
        if (!requiredRoles.length) return true;

        const request = context
            .switchToHttp()
            .getRequest<AuthenticatedRequest>();
        const userRoles = request.roles ?? [];
        const hasRole = requiredRoles.some((role) => userRoles.includes(role));
        if (!hasRole) {
            throw new UnauthorizedException('Insufficient role');
        }
        return true;
    }
}
