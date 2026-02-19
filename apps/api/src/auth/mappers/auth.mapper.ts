
import { AuthSessionDto, AuthUserDto, AuthResponseDto } from '../dto/auth-response.dto';

export class AuthMapper {
    static toAuthResponse(userId: number, session: any): AuthResponseDto {
        return {
            userId,
            session: AuthMapper.toSessionResponse(session),
        };
    }

    private static toSessionResponse(session: any): AuthSessionDto {
        return {
            token: session.token!,
            user: AuthMapper.toUserResponse(session.user),
            redirect: false,
        };
    }

    private static toUserResponse(user: any): AuthUserDto {
        return {
            id: user.id!,
            email: user.email!,
            name: user.name ?? undefined,
            image: user.image ?? user.avatarUrl ?? undefined,
            emailVerified: user.emailVerified ?? false,
            createdAt: user.createdAt
                ? new Date(user.createdAt).toISOString()
                : undefined,
            updatedAt: user.updatedAt
                ? new Date(user.updatedAt).toISOString()
                : undefined,
        };
    }
}
