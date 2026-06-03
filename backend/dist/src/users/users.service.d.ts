import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
        institution: string | null;
        bio: string | null;
        createdAt: Date;
        _count: {
            resources: number;
            ratings: number;
            comments: number;
        };
    }>;
    updateProfile(id: string, dto: {
        name?: string;
        bio?: string;
        institution?: string;
    }): Promise<{
        id: string;
        name: string;
        institution: string | null;
        bio: string | null;
        updatedAt: Date;
    }>;
    getUserResources(userId: string, requesterId: string, requesterRole: Role): Promise<({
        discipline: {
            name: string;
            color: string;
        } | null;
        tags: ({
            tag: {
                id: string;
                name: string;
                createdAt: Date;
                slug: string;
            };
        } & {
            tagId: string;
            resourceId: string;
        })[];
        _count: {
            ratings: number;
            comments: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        type: import(".prisma/client").$Enums.ResourceType;
        url: string;
        fileSize: number | null;
        summary: string | null;
        status: import(".prisma/client").$Enums.ResourceStatus;
        viewCount: number;
        userId: string;
        disciplineId: string | null;
    })[]>;
    listAll(page?: number, limit?: number): Promise<{
        data: {
            id: string;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            institution: string | null;
            isActive: boolean;
            createdAt: Date;
            _count: {
                resources: number;
            };
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    setActive(id: string, isActive: boolean): Promise<{
        id: string;
        name: string;
        isActive: boolean;
    }>;
}
