export interface AuthUser {
    id: string;
    name?: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthSession {
    token: string;
    user: AuthUser;
    redirect: boolean;
}

export interface AuthDto {
    userId: number;
    session: AuthSession;
}
