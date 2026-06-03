import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        institution: string | null;
        bio: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
        };
    }>;
    refresh(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(token: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private saveRefreshToken;
}
