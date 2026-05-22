# Engenharia de Prompt — BibliON Campus

## Princípios Fundamentais

A qualidade da saída de um LLM depende diretamente da qualidade do prompt. O BibliON Campus aplica cinco técnicas comprovadas:

### 1. Role Prompting
Atribuir um papel especializado ativa padrões de resposta mais focados e técnicos.
```
❌ Ruim: "Resuma este material"
✅ Bom:  "Você é um assistente especializado em análise de materiais acadêmicos."
```

### 2. Output Format Specification
Especificar o formato exato elimina ambiguidade e torna o parsing trivial.
```
❌ Ruim: "Liste as tags relevantes"
✅ Bom:  'Responda APENAS com JSON: {"tags": ["tag1", "tag2", ...]}'
```

### 3. Constrained Generation
Delimitar a quantidade e o formato de cada elemento reduz variância.
```
❌ Ruim: "Crie alguns tópicos de resumo"
✅ Bom:  "Gere EXATAMENTE 5 tópicos, cada um com 10-25 palavras"
```

### 4. Language Specification
Especificar o idioma explicitamente evita mistura de línguas.
```
✅ "Use linguagem acadêmica clara e objetiva em português brasileiro"
```

### 5. JSON Mode + Temperature Baixa
```typescript
response_format: { type: 'json_object' }  // Garante JSON válido
temperature: 0.3  // 0=determinístico, 1=criativo — 0.3 equilibra consistência
```

---

## Prompt de Análise Completo (Produção)

```
Você é um assistente especializado em análise de materiais acadêmicos.

MATERIAL PARA ANALISAR:
Título: "{title}"
Tipo: {type}
{context}

TAREFA:
Analise o material acima e gere:

1. RESUMO: Um resumo estruturado com exatamente 5 tópicos em formato bullet points.
   - Cada tópico deve começar com "• " (bullet)
   - Cada tópico deve ter entre 10 e 25 palavras
   - Os tópicos devem cobrir os principais conceitos do material
   - Use linguagem acadêmica clara e objetiva em português brasileiro

2. TAGS: Exatamente 5 tags relevantes para o material.
   - Tags em português, lowercase
   - Sem acentos, sem espaços (use hífen se necessário)
   - Tags devem ser termos técnicos ou temáticos relevantes

FORMATO DE RESPOSTA (JSON estrito, sem markdown):
{
  "summary": "• Tópico 1 aqui\n• Tópico 2 aqui\n• Tópico 3 aqui\n• Tópico 4 aqui\n• Tópico 5 aqui",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Responda APENAS com o JSON. Nenhum texto adicional.
```

---

## Comparação: Prompt Fraco vs Forte

### Cenário: Analisar PDF de Algoritmos de Busca

**Prompt fraco:**
```
"Resuma esse material sobre algoritmos e dê algumas tags"
```
**Saída típica:**
```
"Este material aborda algoritmos de busca como BFS e DFS. 
Tags: algoritmos, busca, computação, grafos, programação"
```
*Problema: formato imprevisível, quantidade variável, sem estrutura.*

---

**Prompt forte (BibliON):**
```
Você é um assistente especializado em análise de materiais acadêmicos.
[...prompt completo...]
```
**Saída:**
```json
{
  "summary": "• Teoria dos grafos: vértices, arestas e representação por matriz de adjacência\n• BFS explora largura primeiro com complexidade O(V+E) usando fila FIFO\n• DFS explora profundidade com pilha implícita e detecção de ciclos\n• Dijkstra resolve caminhos mínimos com heap de prioridade em O((V+E) log V)\n• Aplicações práticas: roteamento GPS, redes sociais e sistemas de navegação",
  "tags": ["grafos", "bfs", "dfs", "dijkstra", "algoritmos-busca"]
}
```
*Resultado: estruturado, parseável, consistente, acadêmico.*

---

## Prompt de Moderação

```
Você é um moderador de plataforma educacional acadêmica.

CONTEÚDO PARA MODERAR:
Título: "{title}"
Descrição: "{description}"

TAREFA:
Verifique APENAS violações claras e evidentes:
- "spam": conteúdo sem valor acadêmico ou propaganda comercial
- "inappropriate": conteúdo ofensivo, discriminatório ou inadequado
- "copyright": pirataria explícita (ex: "download grátis do livro X")
- "misleading": desinformação comprovada sobre ciência

IMPORTANTE: Em caso de dúvida, retorne flags vazio.
A revisão humana sempre ocorre antes da rejeição final.

FORMATO (JSON):
{ "flags": [] }

Responda APENAS com o JSON.
```

**Exemplos de saídas esperadas:**

| Título | Flags esperadas |
|---|---|
| "Apostila de Cálculo - Aula 3" | `[]` |
| "Download grátis Sedgewick Algorithms PDF" | `["copyright"]` |
| "Compre meu curso de Python com 80% OFF!!" | `["spam"]` |
| "Vacinas causam autismo — estudo completo" | `["misleading"]` |
| "Resumo de Redes de Computadores — Camada de Transporte" | `[]` |

---

## Estratégia de Fallback

A integração é projetada para nunca quebrar o fluxo principal:

```typescript
// Nível 1: JSON mode do Groq → JSON sempre válido
response_format: { type: 'json_object' }

// Nível 2: Parser defensivo → nunca lança exceção
try {
  return JSON.parse(raw)
} catch {
  return { summary: '', tags: [] }  // Fallback seguro
}

// Nível 3: Processamento assíncrono → falha não bloqueia usuário
this.ai.analyzeResource(input)
  .catch(() => {/* silencioso */})
```

---

## Métricas e Avaliação de Qualidade

Para avaliar a qualidade dos prompts, recomenda-se:

| Métrica | Como medir | Meta |
|---|---|---|
| JSON válido | `JSON.parse()` sem erro | 100% |
| Resumo com 5 tópicos | Contar `\n•` | > 95% |
| Tags count = 5 | `tags.length === 5` | > 90% |
| Relevância do resumo | Avaliação humana amostral | > 85% |
| Precisão das tags | Tags encontradas na busca | > 80% |
| Latência p95 | Monitoramento | < 2.000ms |
