import { PrismaService } from '../prisma/prisma.service';
export interface SearchParams {
    q: string;
    type?: string;
    disciplineId?: string;
    tags?: string[];
    page?: number;
    limit?: number;
}
export declare class SearchService {
    private prisma;
    constructor(prisma: PrismaService);
    search(params: SearchParams): Promise<{
        data: never[];
        meta: {
            page: number;
            limit: number;
            total: number;
            query?: undefined;
            pages?: undefined;
        };
    } | {
        data: any[];
        meta: {
            query: string;
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    searchTags(q: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
    }[]>;
    getDisciplines(): Promise<({
        _count: {
            resources: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        slug: string;
        description: string | null;
        color: string;
    })[]>;
}
