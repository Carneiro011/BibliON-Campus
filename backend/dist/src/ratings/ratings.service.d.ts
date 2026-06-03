import { PrismaService } from '../prisma/prisma.service';
export declare class RatingsService {
    private prisma;
    constructor(prisma: PrismaService);
    upsert(userId: string, resourceId: string, stars: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        resourceId: string;
        stars: number;
    }>;
    getForResource(resourceId: string): Promise<{
        avg: number;
        total: number;
    }>;
    getUserRating(userId: string, resourceId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        resourceId: string;
        stars: number;
    } | null>;
}
