import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IdentityModule } from '../contexts/identity/identity.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { betterAuthProvider } from './better-auth.provider';
import { AuthSessionGuard } from './guards/auth-session.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [ConfigModule, IdentityModule],
    controllers: [AuthController],
    providers: [betterAuthProvider, AuthService, AuthSessionGuard, RolesGuard],
    exports: [AuthService, AuthSessionGuard, RolesGuard],
})
export class AuthModule {}
