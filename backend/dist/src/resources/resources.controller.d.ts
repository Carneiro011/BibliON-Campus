import { ResourceType } from '@prisma/client';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesController {
    private resourcesService;
    constructor(resourcesService: ResourcesService);
    findAll(page?: number, limit?: number, type?: ResourceType, disciplineId?: string): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    create(user: any, dto: CreateResourceDto, file?: Express.Multer.File): Promise<{
        user: {
            id: string;
            name: string;
            avatarUrl: string | null;
        };
        discipline: {
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
            description: string | null;
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
    }>;
    update(id: string, user: any, dto: UpdateResourceDto): Promise<{
        discipline: {
            id: string;
            name: string;
            createdAt: Date;
            slug: string;
            description: string | null;
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
    }>;
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
    generateAiSummary(id: string): Promise<{
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
    }>;
}
