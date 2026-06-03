import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private config;
    private readonly logger;
    private supabase;
    constructor(config: ConfigService);
    uploadPdf(file: Express.Multer.File, userId: string): Promise<{
        url: string;
        path: string;
    }>;
    deleteFile(path: string): Promise<void>;
}
