import { ConfigService } from '@nestjs/config';
export interface AiAnalysisResult {
    summary: string;
    tags: string[];
}
interface AnalyzeInput {
    type: 'pdf' | 'link';
    title: string;
    description?: string;
    url?: string;
    buffer?: Buffer;
}
export declare class AiService {
    private config;
    private readonly logger;
    private groq;
    constructor(config: ConfigService);
    analyzeResource(input: AnalyzeInput): Promise<AiAnalysisResult>;
    moderateContent(title: string, description?: string): Promise<string[]>;
    private buildAnalysisPrompt;
    private buildModerationPrompt;
    private callGroq;
    private parseAnalysisResult;
    private parseModerationResult;
}
export {};
