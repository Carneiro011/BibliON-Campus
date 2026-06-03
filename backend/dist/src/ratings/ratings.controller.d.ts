import { RatingsService } from './ratings.service';
declare class RateDto {
    stars: number;
}
export declare class RatingsController {
    private ratingsService;
    constructor(ratingsService: RatingsService);
    getForResource(resourceId: string): Promise<{
        avg: number;
        total: number;
    }>;
    upsert(resourceId: string, user: any, dto: RateDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        resourceId: string;
        stars: number;
    }>;
    myRating(resourceId: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        resourceId: string;
        stars: number;
    } | null>;
}
export {};
