import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, resourceId: string, body: string, parentId?: string): Promise<{
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        resourceId: string;
        parentId: string | null;
    }>;
    findByResource(resourceId: string): Promise<({
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        replies: ({
            user: {
                id: string;
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            body: string;
            resourceId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        body: string;
        resourceId: string;
        parentId: string | null;
    })[]>;
    delete(id: string, userId: string, role: Role): Promise<{
        message: string;
    }>;
}
