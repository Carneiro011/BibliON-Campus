import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    me(user: any): Promise<{
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
    updateMe(user: any, dto: any): Promise<{
        id: string;
        name: string;
        institution: string | null;
        bio: string | null;
        updatedAt: Date;
    }>;
    myResources(user: any): Promise<({
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
    toggleActive(id: string, isActive: boolean): Promise<{
        id: string;
        name: string;
        isActive: boolean;
    }>;
}
