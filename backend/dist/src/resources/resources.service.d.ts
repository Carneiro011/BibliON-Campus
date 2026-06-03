import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { StorageService } from '../storage/storage.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceType, ResourceStatus, Role } from '@prisma/client';
export declare class ResourcesService {
    private prisma;
    private ai;
    private storage;
    constructor(prisma: PrismaService, ai: AiService, storage: StorageService);
    create(userId: string, dto: CreateResourceDto, file?: Express.Multer.File): Promise<{
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
    findAll(params: {
        page?: number;
        limit?: number;
        type?: ResourceType;
        disciplineId?: string;
        status?: ResourceStatus;
    }): Promise<{
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, userId: string, role: Role, dto: UpdateResourceDto): Promise<{
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
    remove(id: string, userId: string, role: Role): Promise<{
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
    private resolveTagIds;
    private formatResource;
}
