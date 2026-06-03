import { CommentsService } from './comments.service';
declare class CreateCommentDto {
    body: string;
    parentId?: string;
}
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    findAll(resourceId: string): Promise<({
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
    create(resourceId: string, user: any, dto: CreateCommentDto): Promise<{
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
    remove(id: string, user: any): Promise<{
        message: string;
    }>;
}
export {};
