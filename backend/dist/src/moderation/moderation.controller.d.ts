import { ModerationService } from './moderation.service';
declare class RejectDto {
    reason: string;
}
export declare class ModerationController {
    private moderationService;
    constructor(moderationService: ModerationService);
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
    getStats(): Promise<{
        pending: number;
        approved: number;
        rejected: number;
        total: number;
    }>;
    approve(id: string, user: any): Promise<{
        message: string;
    }>;
    reject(id: string, user: any, dto: RejectDto): Promise<{
        message: string;
    }>;
    aiCheck(id: string): Promise<{
        resourceId: string;
        flags: string[];
    }>;
}
export {};
