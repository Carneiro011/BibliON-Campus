import { AiService } from './ai.service';
declare class AnalyzeDto {
    title: string;
    description?: string;
    url?: string;
    type: 'pdf' | 'link';
}
export declare class AiController {
    private aiService;
    constructor(aiService: AiService);
    analyze(dto: AnalyzeDto): Promise<{
        summary: string;
        tags: string[];
    }>;
}
export {};
