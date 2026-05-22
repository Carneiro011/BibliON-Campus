# Arquitetura do BibliON Campus

## Visão Geral

O BibliON Campus adota uma arquitetura **Modular Monolith** no backend, evitando a complexidade de microserviços para um projeto acadêmico sem perder a organização e escalabilidade necessárias.

## Diagrama de Arquitetura

```mermaid
graph TD
    subgraph Client["🌐 Cliente"]
        FE["Next.js 14\nApp Router + PWA"]
    end

    subgraph Edge["☁️ Vercel Edge"]
        CDN["CDN + Cache\nGlobal"]
    end

    subgraph Backend["🖥 Backend NestJS (Railway)"]
        AUTH["Auth Module\nJWT + Refresh"]
        RES["Resources Module\nUpload + CRUD"]
        SEARCH["Search Module\nFull-text"]
        AI["AI Module\nGroq Pipeline"]
        MOD["Moderation Module\nFila aprovação"]
        RATE["Ratings + Comments"]
    end

    subgraph Data["💾 Dados"]
        PG["PostgreSQL 15\nSupabase / Railway"]
        REDIS["Redis\nCache + Rate limit"]
        FB["Firebase Storage\nPDFs"]
    end

    subgraph External["🔌 Externos"]
        GROQ["Groq API\nLlama 3.1 70B"]
    end

    FE --> CDN --> Backend
    AUTH & RES & SEARCH --> PG
    AI --> GROQ
    RES --> FB
    Backend --> REDIS
```

## Fluxo de Upload com IA

```mermaid
sequenceDiagram
    participant U as Usuário
    participant FE as Frontend
    participant BE as Backend
    participant FB as Firebase Storage
    participant AI as Groq API
    participant DB as PostgreSQL

    U->>FE: Seleciona PDF + preenche título
    FE->>BE: POST /resources (multipart)
    BE->>FB: Upload do arquivo PDF
    FB-->>BE: URL pública do arquivo
    BE->>DB: Salva recurso (status=PENDING)
    BE-->>FE: Recurso criado

    Note over BE,AI: Processamento assíncrono
    BE->>AI: Extrai texto + envia prompt
    AI-->>BE: JSON {summary, tags}
    BE->>DB: Atualiza resumo e tags

    Note over BE,DB: Moderação
    BE->>DB: Cria entrada na tabela moderations
```

## Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant FE as Frontend
    participant BE as Backend
    participant DB as PostgreSQL

    U->>FE: Login (email + senha)
    FE->>BE: POST /auth/login
    BE->>DB: Valida credenciais (bcrypt)
    DB-->>BE: Usuário encontrado
    BE->>BE: Gera accessToken (15min) + refreshToken (7d)
    BE->>DB: Salva refreshToken
    BE-->>FE: {accessToken, refreshToken, user}
    FE->>FE: Salva tokens em cookies httpOnly

    Note over FE,BE: 15 minutos depois...
    FE->>BE: Request com accessToken expirado
    BE-->>FE: 401 Unauthorized
    FE->>BE: POST /auth/refresh {refreshToken}
    BE->>DB: Valida + deleta refreshToken antigo
    BE->>DB: Salva novo refreshToken (rotação)
    BE-->>FE: {accessToken, refreshToken} novos
    FE->>BE: Repete request original ✓
```

## Diagrama de Casos de Uso

```mermaid
graph LR
    subgraph Atores
        ALU["👤 Aluno"]
        MOD["🛡 Moderador"]
        ADM["👑 Admin"]
    end

    subgraph UC["Casos de Uso"]
        UC1["Cadastrar-se"]
        UC2["Fazer login"]
        UC3["Enviar PDF"]
        UC4["Adicionar link"]
        UC5["Buscar materiais"]
        UC6["Avaliar material"]
        UC7["Comentar"]
        UC8["Aprovar recurso"]
        UC9["Rejeitar recurso"]
        UC10["Pré-moderar com IA"]
        UC11["Gerenciar usuários"]
        UC12["Ver estatísticas"]
    end

    ALU --> UC1 & UC2 & UC3 & UC4 & UC5 & UC6 & UC7
    MOD --> UC2 & UC5 & UC8 & UC9 & UC10 & UC12
    ADM --> UC2 & UC5 & UC8 & UC9 & UC10 & UC11 & UC12
```

## Padrões Arquiteturais Adotados

### Repository Pattern via Prisma
Cada módulo acessa o banco exclusivamente via `PrismaService`, nunca com SQL manual na camada de controller.

### DTO Pattern com class-validator
Todos os inputs passam por DTOs com validação declarativa antes de chegar ao service.

### Guard + Decorator para RBAC
Autorização baseada em roles usando `@Roles(Role.MODERATOR)` + `RolesGuard`, evitando repetição de lógica.

### Interceptores globais
Transformação automática de payload e logging centralizados via interceptores NestJS.

## Decisões Arquiteturais Justificadas

| Decisão | Alternativa | Justificativa |
|---|---|---|
| NestJS | Express puro | Força boas práticas (DI, módulos, decorators) |
| PostgreSQL | MongoDB | Dados relacionais + full-text search nativo |
| Prisma | TypeORM | Melhor DX, migrations automáticas, type-safety |
| App Router Next.js 14 | Pages Router | RSC, layouts aninhados, melhor performance |
| Groq API | OpenAI | 100% gratuito no free tier, latência baixa |
| Firebase Storage | AWS S3 | Sem cartão de crédito, SDK simples |
| JWT + Refresh | Session | Stateless, escalável, compatível com mobile |
