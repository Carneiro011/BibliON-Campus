"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_sdk_1 = require("groq-sdk");
const pdfParse = require("pdf-parse");
let AiService = AiService_1 = class AiService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(AiService_1.name);
        this.groq = null;
        const apiKey = config.get('GROQ_API_KEY');
        if (apiKey) {
            this.groq = new groq_sdk_1.default({ apiKey });
        }
        else {
            this.logger.warn('GROQ_API_KEY não definida — IA desativada');
        }
    }
    async analyzeResource(input) {
        try {
            let textContent = '';
            if (input.type === 'pdf' && input.buffer) {
                const parsed = await pdfParse(input.buffer);
                textContent = parsed.text.slice(0, 6000);
            }
            const prompt = this.buildAnalysisPrompt(input, textContent);
            const result = await this.callGroq(prompt);
            return this.parseAnalysisResult(result);
        }
        catch (error) {
            this.logger.error(`Erro na análise IA: ${error.message}`);
            return { summary: '', tags: [] };
        }
    }
    async moderateContent(title, description) {
        try {
            const prompt = this.buildModerationPrompt(title, description);
            const result = await this.callGroq(prompt);
            return this.parseModerationResult(result);
        }
        catch (error) {
            this.logger.error(`Erro na moderação IA: ${error.message}`);
            return [];
        }
    }
    buildAnalysisPrompt(input, textContent) {
        const context = textContent
            ? `\n\nTEXTO EXTRAÍDO DO DOCUMENTO:\n${textContent}`
            : input.description
                ? `\n\nDESCRIÇÃO: ${input.description}`
                : '';
        return `Você é um assistente especializado em análise de materiais acadêmicos.

MATERIAL PARA ANALISAR:
Título: "${input.title}"
Tipo: ${input.type === 'pdf' ? 'Documento PDF' : 'Link/Recurso Web'}${context}

TAREFA:
Analise o material acima e gere:

1. RESUMO: Um resumo estruturado com exatamente 5 tópicos em formato de bullet points.
   - Cada tópico deve começar com "• " (bullet)
   - Cada tópico deve ter entre 10 e 25 palavras
   - Use linguagem acadêmica clara e objetiva em português brasileiro

2. TAGS: Exatamente 5 tags relevantes para o material.
   - Tags em português, lowercase
   - Sem acentos, sem espaços (use hífen se necessário)

FORMATO DE RESPOSTA (JSON estrito, sem markdown):
{
  "summary": "• Tópico 1 aqui\\n• Tópico 2 aqui\\n• Tópico 3 aqui\\n• Tópico 4 aqui\\n• Tópico 5 aqui",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Responda APENAS com o JSON. Nenhum texto adicional.`;
    }
    buildModerationPrompt(title, description) {
        return `Você é um moderador de plataforma educacional acadêmica.

CONTEÚDO PARA MODERAR:
Título: "${title}"
${description ? `Descrição: "${description}"` : ''}

TAREFA:
Verifique se o conteúdo contém algum dos seguintes problemas:
- "spam": conteúdo sem valor acadêmico ou propaganda
- "inappropriate": conteúdo inadequado ou ofensivo
- "copyright": violação clara de direitos autorais
- "misleading": informações comprovadamente falsas

FORMATO DE RESPOSTA (JSON estrito):
{ "flags": [] }

Responda APENAS com o JSON.`;
    }
    async callGroq(prompt) {
        if (!this.groq)
            return '{}';
        const completion = await this.groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 1024,
            response_format: { type: 'json_object' },
        });
        return completion.choices[0]?.message?.content || '{}';
    }
    parseAnalysisResult(raw) {
        try {
            const parsed = JSON.parse(raw);
            return {
                summary: typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
                tags: Array.isArray(parsed.tags)
                    ? parsed.tags.slice(0, 5).map((t) => t.toLowerCase().trim())
                    : [],
            };
        }
        catch {
            return { summary: '', tags: [] };
        }
    }
    parseModerationResult(raw) {
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed.flags) ? parsed.flags : [];
        }
        catch {
            return [];
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map