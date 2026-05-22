// src/ai/ai.service.ts
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Groq from 'groq-sdk'
import * as pdfParse from 'pdf-parse'

export interface AiAnalysisResult {
  summary: string
  tags: string[]
}

interface AnalyzeInput {
  type: 'pdf' | 'link'
  title: string
  description?: string
  url?: string
  buffer?: Buffer
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)
  private groq: Groq

  constructor(private config: ConfigService) {
    this.groq = new Groq({
      apiKey: config.get('GROQ_API_KEY'),
    })
  }

  async analyzeResource(input: AnalyzeInput): Promise<AiAnalysisResult> {
    try {
      let textContent = ''

      if (input.type === 'pdf' && input.buffer) {
        const parsed = await pdfParse(input.buffer)
        textContent = parsed.text.slice(0, 6000)
      }

      const prompt = this.buildAnalysisPrompt(input, textContent)
      const result = await this.callGroq(prompt)
      return this.parseAnalysisResult(result)
    } catch (error) {
      this.logger.error(`Erro na análise IA: ${(error as Error).message}`)
      return { summary: '', tags: [] }
    }
  }

  async moderateContent(title: string, description?: string): Promise<string[]> {
    try {
      const prompt = this.buildModerationPrompt(title, description)
      const result = await this.callGroq(prompt)
      return this.parseModerationResult(result)
    } catch (error) {
      this.logger.error(`Erro na moderação IA: ${(error as Error).message}`)
      return []
    }
  }

  private buildAnalysisPrompt(input: AnalyzeInput, textContent: string): string {
    const context = textContent
      ? `\n\nTEXTO EXTRAÍDO DO DOCUMENTO:\n${textContent}`
      : input.description
        ? `\n\nDESCRIÇÃO: ${input.description}`
        : ''

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

Responda APENAS com o JSON. Nenhum texto adicional.`
  }

  private buildModerationPrompt(title: string, description?: string): string {
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

Responda APENAS com o JSON.`
  }

  private async callGroq(prompt: string): Promise<string> {
    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    })

    return completion.choices[0]?.message?.content || '{}'
  }

  private parseAnalysisResult(raw: string): AiAnalysisResult {
    try {
      const parsed = JSON.parse(raw)
      return {
        summary: typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
        tags: Array.isArray(parsed.tags)
          ? parsed.tags.slice(0, 5).map((t: string) => t.toLowerCase().trim())
          : [],
      }
    } catch {
      return { summary: '', tags: [] }
    }
  }

  private parseModerationResult(raw: string): string[] {
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed.flags) ? parsed.flags : []
    } catch {
      return []
    }
  }
}
