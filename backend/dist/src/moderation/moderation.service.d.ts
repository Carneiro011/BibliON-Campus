import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
export declare class ModerationService {
    private prisma;
    private ai;
    constructor(prisma: PrismaService, ai: AiService);
    getPending(page?: number, limit?: number): Promise<{
        data: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
            discipline: {
                name: string;
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
            moderation: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.ResourceStatus;
                resourceId: string;
                moderatorId: string | null;
                reviewedAt: Date | null;
                reason: string | null;
                aiFlags: string[];
            } | null;
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
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    approve(resourceId: string, moderatorId: string): Promise<{
        message: string;
    }>;
    reject(resourceId: string, moderatorId: string, reason: string): Promise<{
        message: string;
    }>;
    aiPreModerate(resourceId: string): Promise<{
        resourceId: string;
        flags: string[];
    }>;
    getStats(): Promise<{
        pending: number;
        approved: number;
        rejected: number;
        total: number;
    }>;
}
