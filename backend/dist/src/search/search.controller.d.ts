import { SearchService } from './search.service';
export declare class SearchController {
    private searchService;
    constructor(searchService: SearchService);
    search(q: string, type?: string, disciplineId?: string, page?: number, limit?: number): Promise<{
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
