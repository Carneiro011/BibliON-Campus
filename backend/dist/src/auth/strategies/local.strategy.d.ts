import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<{
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
    }>;
}
export {};
