# ✅ Checklist de Entrega — BibliON Campus

## Código

### Backend
- [x] NestJS com módulos organizados por domínio
- [x] Prisma Schema completo (7 models)
- [x] Seed com dados realistas
- [x] JWT Auth com access token (15min) + refresh token rotativo (7d)
- [x] Upload de PDF para Firebase Storage
- [x] Integração Groq API (Llama 3.1 70B)
- [x] Geração automática de resumo (5 tópicos)
- [x] Geração automática de tags (5 tags)
- [x] Busca full-text PostgreSQL com ts_rank
- [x] Sistema de avaliações (upsert, 1-5 estrelas)
- [x] Comentários com respostas aninhadas
- [x] Fluxo de moderação (pending → approved/rejected)
- [x] Pré-moderação por IA (detecção de flags)
- [x] RBAC com 3 roles (STUDENT, MODERATOR, ADMIN)
- [x] Swagger/OpenAPI completo
- [x] Validação de DTOs com class-validator
- [x] GlobalExceptionFilter para padronizar erros
- [x] Rate limiting (100 req/60s por IP)
- [x] Extração de texto de PDF (pdf-parse)

### Frontend
- [x] Next.js 14 com App Router
- [x] TypeScript com tipagem completa
- [x] TailwindCSS com design system próprio
- [x] Autenticação completa (login, register, logout)
- [x] Refresh token automático via interceptor Axios
- [x] Dashboard com filtros e paginação
- [x] Upload com drag-and-drop (react-dropzone)
- [x] Botão de geração de IA no formulário
- [x] Página de detalhe do recurso
- [x] Sistema de avaliação com hover (estrelas interativas)
- [x] Comentários com respostas
- [x] Busca com filtros
- [x] Painel de moderação para moderadores
- [x] Painel de estatísticas
- [x] Perfil do usuário editável
- [x] Página "Meus materiais"
- [x] Landing page profissional
- [x] Skeleton loading em todos os cards
- [x] Responsivo (mobile-first)
- [x] Toast notifications (sonner)

### Infraestrutura
- [x] Docker Compose completo (postgres, redis, backend, frontend)
- [x] Dockerfile do backend (multi-stage build)
- [x] Dockerfile do frontend (multi-stage build)
- [x] .env.example documentado
- [x] .gitignore completo

### Documentação
- [x] README.md profissional com badges
- [x] docs/arquitetura.md com diagramas Mermaid
- [x] docs/banco_de_dados.md com DER completo
- [x] docs/api.md com todos os endpoints
- [x] docs/deploy.md (Docker + produção)
- [x] docs/seguranca.md
- [x] docs/integracao_ia.md
- [x] docs/engenharia_prompt.md
- [x] docs/documentacao_tecnica.md
- [x] docs/relatorio_academico.md (15+ seções)

---

## 🎤 Roteiro de Apresentação (20 minutos)

### 1. Abertura (2 min)
> "O BibliON Campus resolve um problema real: materiais acadêmicos estão espalhados por WhatsApp, drives pessoais e links perdidos. Nossa solução centraliza isso com o diferencial da IA gerando resumos automáticos."

### 2. Demonstração ao vivo (8 min)
1. Abrir `http://localhost:3000`
2. **Landing page** — mostrar proposta de valor
3. **Cadastro** — criar conta ao vivo
4. **Dashboard** — mostrar materiais aprovados, cards com resumo IA
5. **Upload** — enviar um PDF real, clicar em "Gerar com IA", mostrar resumo gerado em ~1s
6. **Busca** — digitar "algoritmos", mostrar full-text search
7. **Detalhe** — avaliar o material (estrelas), comentar
8. **Moderação** — logar como moderador, aprovar o material recém enviado
9. **Swagger** — mostrar `http://localhost:3001/api/docs`

### 3. Arquitetura (5 min)
- Mostrar `docs/arquitetura.md`
- Explicar diagrama: "Frontend Next.js → API NestJS → PostgreSQL + Firebase + Groq"
- Destacar: "Monorepo com separação de responsabilidades — cada módulo NestJS é independente"

### 4. IA Generativa (3 min)
- Mostrar `docs/engenharia_prompt.md`
- Explicar o prompt: role, output format, constrained generation
- Mostrar saída real do modelo no dashboard

### 5. Fechamento (2 min)
- Mencionar Docker Compose: "sobe tudo com um comando"
- Mencionar tecnologias gratuitas: "deploy com zero custo"
- Abrir para perguntas

---

## ❓ Perguntas Prováveis da Banca

### Sobre arquitetura
**P: Por que NestJS e não Express puro?**
R: NestJS força injeção de dependências, módulos e decorators — padrões que o Express deixa opcionais. Para um avaliador, a estrutura modular é imediatamente reconhecível como profissional. Além disso, o NestJS integra nativamente Swagger, class-validator e Passport, reduzindo o código boilerplate.

**P: Por que PostgreSQL e não MongoDB?**
R: O domínio é altamente relacional: Usuário → Recurso → Tags → Avaliações → Comentários → Moderação. MongoDB forçaria replicar manualmente a integridade referencial que o PostgreSQL oferece nativamente. Além disso, o PostgreSQL tem full-text search integrado — eliminando a necessidade de Elasticsearch.

**P: O sistema é escalável?**
R: Sim. A arquitetura tem camadas claras, índices estratégicos no banco, paginação em todas as listagens e processamento assíncrono da IA. Para escalabilidade horizontal, a próxima etapa seria adicionar uma fila Redis Bull para os jobs de IA e um CDN para os PDFs.

### Sobre IA
**P: Como funciona a integração com a IA?**
R: Usamos a API da Groq com o modelo Llama 3.1 70B. Para PDFs, extraímos o texto com pdf-parse e enviamos até 6.000 caracteres para o modelo. O prompt especifica role, formato de saída JSON estrito e restrições de quantidade. A resposta é parseada defensivamente — a IA nunca bloqueia o fluxo principal.

**P: A IA pode errar? O que acontece?**
R: Sim, e está previsto. O usuário sempre pode editar o resumo e as tags geradas antes de salvar. A moderação humana também é obrigatória — a IA apenas auxilia o moderador com pré-análise. É o conceito de Human-in-the-Loop.

**P: Por que Groq e não OpenAI?**
R: Groq oferece free tier generoso sem necessidade de cartão de crédito, latência inferior (< 1s vs 2-5s do GPT-4) e acesso ao Llama 3.1 70B que tem desempenho comparável ao GPT-4 em tarefas de sumarização acadêmica.

### Sobre segurança
**P: Como funciona a autenticação?**
R: JWT com dois tokens: access token de 15 minutos e refresh token de 7 dias com rotação. Cada uso do refresh invalida o token atual e emite um novo — se um token for comprometido, o legítimo owner detecta na próxima requisição. Senhas são hasheadas com bcrypt (salt rounds 10).

**P: Como previnem SQL Injection?**
R: Prisma usa prepared statements automaticamente — nenhuma query é construída por concatenação de string. Campos de busca free-text passam por sanitização adicional antes de entrar no `plainto_tsquery`.

**P: O que é RBAC?**
R: Role-Based Access Control — controle de acesso baseado em perfil. O sistema tem três roles: STUDENT (operações básicas), MODERATOR (aprova/rejeita materiais) e ADMIN (gestão completa). A verificação é feita via decorator `@Roles()` + `RolesGuard` no NestJS.

### Sobre banco de dados
**P: Como funciona o full-text search?**
R: PostgreSQL tem suporte nativo via `ts_vector` e `ts_query`. Usamos `to_tsvector('portuguese', ...)` para indexar título, descrição e resumo, e `plainto_tsquery` para aceitar entrada livre do usuário. O ranqueamento usa `ts_rank` que implementa TF-IDF, retornando os resultados mais relevantes primeiro.

**P: Por que não usar Elasticsearch?**
R: Para o volume esperado (< 100.000 registros), o full-text search nativo do PostgreSQL é suficiente e elimina um serviço adicional para operar. Elasticsearch faria sentido acima de 10 milhões de documentos ou se precisássemos de features avançadas como fuzzy search com typos.

### Sobre deploy
**P: Como faz o deploy?**
R: Com Docker Compose, todo o ambiente sobe com `docker compose up -d`. Para produção gratuita: frontend na Vercel, backend no Railway, banco no Supabase. Custo zero para projeto acadêmico.

**P: Por que Docker?**
R: Docker elimina o problema "funciona na minha máquina". A banca pode clonar o repositório e executar o sistema em qualquer máquina com Docker instalado, sem configurar Node.js, PostgreSQL ou Redis manualmente.
