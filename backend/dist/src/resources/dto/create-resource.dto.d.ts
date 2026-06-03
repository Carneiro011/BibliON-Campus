import { ResourceType } from '@prisma/client';
export declare class CreateResourceDto {
    title: string;
    description?: string;
    type: ResourceType;
    url?: string;
    summary?: string;
    disciplineId?: string;
    tags?: string[];
}
